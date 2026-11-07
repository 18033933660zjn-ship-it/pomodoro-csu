import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isoWeek from 'dayjs/plugin/isoWeek'
import type { CourseItem, StudyCheckpoint, CheckInRecord, WeeklyAutomatedReview } from '@/types'
import { weeklyCourses, weeklyCheckpoints } from '@/utils/courseScheduleData'
import { StorageService } from '@/utils/storage'
import { useTimeLogStore } from './useTimeLogStore'
import { useCategoryStore } from './useCategoryStore'
import { soundManager } from '@/utils/sound'
import confetti from 'canvas-confetti'

dayjs.extend(isBetween)
dayjs.extend(isoWeek)

export const useScheduleStore = defineStore('schedule', () => {
  const timeLogStore = useTimeLogStore()
  const categoryStore = useCategoryStore()

  const courses = ref<CourseItem[]>(weeklyCourses)
  const checkpoints = ref<StudyCheckpoint[]>(weeklyCheckpoints)
  const checkIns = ref<CheckInRecord[]>(StorageService.getCheckIns())

  function saveCheckIns() {
    StorageService.saveCheckIns(checkIns.value)
  }

  // 当前周几 (1..7, 1=周一, 7=周日)
  const currentDayOfWeek = computed(() => {
    const d = dayjs().day()
    return d === 0 ? 7 : d
  })

  // 今天的自习室打卡检查点
  const todayCheckpoints = computed(() => {
    return checkpoints.value.filter(cp => cp.dayOfWeek === currentDayOfWeek.value)
  })

  // 今天的大学课程安排
  const todayCourses = computed(() => {
    return courses.value.filter(c => c.dayOfWeek === currentDayOfWeek.value)
  })

  // 获取特定日期的打卡记录
  function getCheckInsByDate(dateStr: string): CheckInRecord[] {
    return checkIns.value.filter(r => r.date === dateStr)
  }

  // 检查某天某个 checkpoint 是否已打卡
  function getCheckInForCheckpoint(checkpointId: string, dateStr: string): CheckInRecord | undefined {
    return checkIns.value.find(r => r.checkpointId === checkpointId && r.date === dateStr)
  }

  /**
   * 严格打卡时段防作弊判定：
   * 1. 仅限当日有效打卡；
   * 2. 最多只能提前 30 分钟打卡（防止提前一天或过早虚假打卡）；
   * 3. 超过计划时间点视为迟到，并记录迟到分钟数。
   */
  function getCheckpointStatus(cp: StudyCheckpoint, dateStr = dayjs().format('YYYY-MM-DD')) {
    const existing = getCheckInForCheckpoint(cp.id, dateStr)
    if (existing) {
      return {
        canCheckIn: false,
        status: existing.status,
        state: 'completed' as const,
        message: existing.status === 'on_time' ? '已准时打卡' : `已打卡 (迟到 ${existing.diffMinutes} 分钟)`,
        record: existing
      }
    }

    const now = dayjs()
    const isToday = dateStr === now.format('YYYY-MM-DD')
    const currentDay = now.day() === 0 ? 7 : now.day()

    if (!isToday || cp.dayOfWeek !== currentDay) {
      return {
        canCheckIn: false,
        state: 'wrong_day' as const,
        message: '非今日打卡时段，仅限当日打卡'
      }
    }

    const [h, m] = cp.time.split(':').map(Number)
    const scheduledDt = now.hour(h).minute(m).second(0)
    const earliestCheckIn = scheduledDt.subtract(30, 'minute')

    // 提前超过 30 分钟 -> 严禁提前打卡
    if (now.isBefore(earliestCheckIn)) {
      const waitMinutes = earliestCheckIn.diff(now, 'minute')
      return {
        canCheckIn: false,
        state: 'too_early' as const,
        message: `未到打卡时间！最多只能提前 30 分钟打卡（请在 ${earliestCheckIn.format('HH:mm')} 之后再来打卡，距开放还有约 ${waitMinutes} 分钟）`,
        earliestTimeStr: earliestCheckIn.format('HH:mm'),
        waitMinutes
      }
    }

    // 在 30 分钟提前窗口内，且未超 2 分钟容差 -> 准时打卡区间
    if (now.isBefore(scheduledDt.add(2, 'minute'))) {
      const diffToScheduled = scheduledDt.diff(now, 'minute')
      return {
        canCheckIn: true,
        state: 'open' as const,
        isLate: false,
        diffMinutes: -diffToScheduled,
        message: `打卡窗口已开放！要求在 ${cp.time} 前到达${cp.target}就位打卡（离截止还有 ${Math.max(0, diffToScheduled)} 分钟）`
      }
    }

    // 超过预定打卡时间点 -> 迟到
    const lateMinutes = now.diff(scheduledDt, 'minute')
    return {
      canCheckIn: true,
      state: 'late' as const,
      isLate: true,
      diffMinutes: lateMinutes,
      message: `已超时 ${lateMinutes} 分钟！算作迟到，请立即打卡并如实记入周度复盘！`
    }
  }

  // 计算当前最紧急/下一个打卡节点
  const nextCheckpoint = computed(() => {
    const todayStr = dayjs().format('YYYY-MM-DD')
    for (const cp of todayCheckpoints.value) {
      const existing = getCheckInForCheckpoint(cp.id, todayStr)
      if (existing) continue

      const status = getCheckpointStatus(cp, todayStr)
      return {
        checkpoint: cp,
        status,
        isPastDue: status.state === 'late',
        diffMinutes: status.diffMinutes || 0
      }
    }
    return null
  })

  // 执行自习室/健身房打卡（带最多提前30分钟严格防刷校验）
  function checkIn(checkpointId: string, notes = ''): CheckInRecord {
    const todayStr = dayjs().format('YYYY-MM-DD')
    const cp = checkpoints.value.find(c => c.id === checkpointId)
    if (!cp) throw new Error('Checkpoint not found')

    const statusCheck = getCheckpointStatus(cp, todayStr)
    if (!statusCheck.canCheckIn) {
      throw new Error(statusCheck.message)
    }

    const now = dayjs()
    const [h, m] = cp.time.split(':').map(Number)
    const scheduledDt = dayjs().hour(h).minute(m).second(0)

    const diffMin = now.diff(scheduledDt, 'minute')
    const isLate = diffMin > 2

    const record: CheckInRecord = {
      id: `chk-${Date.now()}`,
      checkpointId: cp.id,
      date: todayStr,
      scheduledTime: cp.time,
      checkInTime: now.toISOString(),
      status: isLate ? 'late' : 'on_time',
      diffMinutes: diffMin,
      target: cp.target,
      taskName: cp.taskName,
      notes: notes || (isLate ? `迟到 ${diffMin} 分钟到达，已如实记录进周总结改进项` : `准时在 ${cp.time} 前到达${cp.target}打卡！`)
    }

    const existingIdx = checkIns.value.findIndex(r => r.checkpointId === cp.id && r.date === todayStr)
    if (existingIdx !== -1) {
      checkIns.value[existingIdx] = record
    } else {
      checkIns.value.unshift(record)
    }
    saveCheckIns()

    // 打卡即记录到达考勤（不预支虚假学时，真实学时由用户实际专注完成或填报录入）
    if (!isLate) {
      soundManager.playCompletionBell(0.8)
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } })
      } catch {
        // ignore
      }
    } else {
      soundManager.playClick(0.7)
    }

    return record
  }

  /**
   * 额外打卡（空闲多学加餐模式）
   * 允许用户在课余、夜晚或任何空闲时段主动加练，并记录到对应的项目中！
   */
  function addExtraStudySession(params: {
    categoryId: string
    title: string
    durationMinutes: number
    notes?: string
  }) {
    const cat = categoryStore.getCategoryById(params.categoryId) || categoryStore.categories[0]
    const now = dayjs()
    const startTime = now.subtract(params.durationMinutes, 'minute')

    // 1. 添加进时间流水 (标记 isExtra: true, mode: 'extra')
    timeLogStore.addLog({
      taskTitle: `[额外加练] ${params.title}`,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
      durationMinutes: params.durationMinutes,
      mode: 'extra',
      isExtra: true,
      notes: params.notes || '利用空闲碎片时间额外加练多学，自驱力强化'
    })

    // 2. 添加进打卡记录
    const extraRecord: CheckInRecord = {
      id: `chk-extra-${Date.now()}`,
      checkpointId: `extra-${Date.now()}`,
      date: now.format('YYYY-MM-DD'),
      scheduledTime: now.format('HH:mm'),
      checkInTime: now.toISOString(),
      status: 'on_time',
      diffMinutes: 0,
      target: '自主空闲攻坚',
      taskName: `[额外多学] ${cat.name}: ${params.title}`,
      notes: params.notes || '空闲时间额外多学加餐'
    }
    checkIns.value.unshift(extraRecord)
    saveCheckIns()

    soundManager.playCompletionBell(0.8)
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } })
    } catch {
      // ignore
    }
    return extraRecord
  }

  // 自动化每周复盘评估生成器 (周日自动生成汇报)
  function generateWeeklyReview(weekStartDate?: string): WeeklyAutomatedReview {
    const start = weekStartDate ? dayjs(weekStartDate).startOf('isoWeek') : dayjs().startOf('isoWeek')
    const end = start.endOf('isoWeek')
    const weekKey = `${start.year()}-W${start.isoWeek()}`

    // 1. 获取该周的所有自习室打卡记录
    const weekRecords = checkIns.value.filter(r => {
      const d = dayjs(r.date)
      return (d.isAfter(start) || d.isSame(start, 'day')) && (d.isBefore(end) || d.isSame(end, 'day'))
    })

    const onTimeCount = weekRecords.filter(r => r.status === 'on_time').length
    const lateRecords = weekRecords.filter(r => r.status === 'late')
    const lateCount = lateRecords.length

    // 本周应有打卡点总数 (若为当前进行中的周，仅统计截止今日应打卡的点)
    const isCurrentWeek = dayjs().isSame(start, 'isoWeek')
    const currentDay = dayjs().day() === 0 ? 7 : dayjs().day()
    const expectedCheckpointsList = isCurrentWeek
      ? weeklyCheckpoints.filter(cp => cp.dayOfWeek <= currentDay)
      : weeklyCheckpoints

    const totalExpectedCheckpoints = Math.max(1, expectedCheckpointsList.length)
    const missedCount = Math.max(0, totalExpectedCheckpoints - onTimeCount - lateCount)
    const punctualityRate = Math.min(100, Math.round((onTimeCount / totalExpectedCheckpoints) * 100))

    // 2. 统计该周任务实际完成时长 vs 计划目标
    const weekLogs = timeLogStore.getLogsByRange(start.toISOString(), end.toISOString())

    // 任务1: 雅思基础突破 (周目标 11h = 660m，雅思21h中分出10h给科研推进)
    const t1Minutes = weekLogs
      .filter(l => l.categoryId === 'cat-ielts-research' || l.taskTitle.includes('任务一') || l.taskTitle.includes('雅思'))
      .reduce((s, l) => s + l.durationMinutes, 0)

    // 任务4: 科研推进 (周目标 10h = 600m)
    const t4Minutes = weekLogs
      .filter(l => l.categoryId === 'cat-research-advance' || l.taskTitle.includes('任务四') || l.taskTitle.includes('科研') || l.taskTitle.includes('论文'))
      .reduce((s, l) => s + l.durationMinutes, 0)

    // 任务2: 习概与创新创业导论 (周一至周六6天，每天90m，总目标 9h = 540m)
    const t2Minutes = weekLogs
      .filter(l => l.categoryId === 'cat-politics-innovation' || l.taskTitle.includes('任务二') || l.taskTitle.includes('习概') || l.taskTitle.includes('双创'))
      .reduce((s, l) => s + l.durationMinutes, 0)

    // 任务3: 专业课三科 (周一、二、三、五、日共5天，每天各20m*3=60m，总目标 5h = 300m)
    const t3Logs = weekLogs.filter(l => l.categoryId === 'cat-major-courses' || l.taskTitle.includes('任务三') || l.taskTitle.includes('专业课') || l.taskTitle.includes('生物力学') || l.taskTitle.includes('科研方法') || l.taskTitle.includes('竞赛学'))
    const t3Minutes = t3Logs.reduce((s, l) => s + l.durationMinutes, 0)

    // 专业三科拆解
    const biomechanicsMin = t3Logs.filter(l => l.taskTitle.includes('生物力学')).reduce((s, l) => s + l.durationMinutes, 0) || Math.round(t3Minutes / 3)
    const researchMethodMin = t3Logs.filter(l => l.taskTitle.includes('研究方法') || l.taskTitle.includes('科研方法')).reduce((s, l) => s + l.durationMinutes, 0) || Math.round(t3Minutes / 3)
    const competitionMin = t3Logs.filter(l => l.taskTitle.includes('竞赛学')).reduce((s, l) => s + l.durationMinutes, 0) || (t3Minutes - biomechanicsMin - researchMethodMin)

    // 周末健身房锻炼 (周六2.5h + 周日2.5h，总目标 5h = 300m)
    const fitnessMinutes = weekLogs
      .filter(l => l.categoryId === 'cat-fitness-workout' || l.taskTitle.includes('健身') || l.taskTitle.includes('力量') || l.taskTitle.includes('体能'))
      .reduce((s, l) => s + l.durationMinutes, 0)

    // 额外空闲多学统计
    const extraLogs = weekLogs.filter(l => l.isExtra || l.mode === 'extra')
    const extraMinutes = extraLogs.reduce((s, l) => s + l.durationMinutes, 0)
    const extraHours = Number((extraMinutes / 60).toFixed(1))

    // 拆解各科目额外多学
    const extraMap: Record<string, number> = {}
    for (const el of extraLogs) {
      extraMap[el.categoryName] = (extraMap[el.categoryName] || 0) + el.durationMinutes
    }
    const extraDetails = Object.entries(extraMap).map(([name, mins]) => ({
      name,
      hours: Number((mins / 60).toFixed(1))
    }))

    // 3. 自动化严谨点评算法 (做得好的地方 + 改进建议)
    const praises: string[] = []
    const improvements: string[] = []

    // 额外加练重点表扬
    if (extraHours > 0) {
      praises.push(`🔥 额外自主加练加餐：在既定课表与自习计划外，主动利用空闲碎片时间额外多学了 ${extraHours} 小时（${extraDetails.map(d => `${d.name} ${d.hours}h`).join('、')}）！展现出极强的学术内驱力与求知欲！`)
    }

    // 点评打卡守时度
    if (punctualityRate >= 90) {
      praises.push(`自习室按时就位率高达 ${punctualityRate}%！严格遵守“提前30分钟内打卡”防作弊纪律，早八自习与午后打卡作息稳固！`)
    } else if (punctualityRate >= 75) {
      praises.push(`整体出勤守时率达到 ${punctualityRate}%，绝大多数时段能够按部就班准点就位。`)
    } else {
      improvements.push(`自习室准时打卡率仅为 ${punctualityRate}%，本周共迟到 ${lateCount} 次，缺卡 ${missedCount} 次，时间防线出现松懈，必须严控起床与换场时间！`)
    }

    if (lateRecords.length > 0) {
      const lateDetails = lateRecords.map(r => `${dayjs(r.date).format('ddd')} ${r.scheduledTime} (${r.diffMinutes}m)`).join(', ')
      improvements.push(`迟到节点明细：${lateDetails}。请重点复盘以上时段前是否有拖延或下课换场耽搁，建议提前10分钟启程前往自习室。`)
    }

    // 点评任务1：雅思基础突破 (原21h中分出10h给科研推进，雅思现每周目标 11h)
    const t1Hours = Number((t1Minutes / 60).toFixed(1))
    const t1Target = isCurrentWeek ? Number(((currentDay / 7) * 11).toFixed(1)) : 11
    if (t1Hours >= t1Target * 0.9) {
      praises.push(isCurrentWeek ? `任务一（雅思基础突破）截止今日累计投入 ${t1Hours}h（阶段目标 ${t1Target}h），核心词汇默写与句型读写稳步推进！` : `任务一全周累计达成 ${t1Hours} 小时（目标 11h），基础打磨严谨！`)
    } else {
      improvements.push(`任务一实际投入 ${t1Hours}h（阶段目标 ${t1Target}h），请保持每日词汇与句型背写读写节奏。`)
    }

    // 点评任务4：科研推进 (每周目标 10h)
    const t4Hours = Number((t4Minutes / 60).toFixed(1))
    const t4Target = isCurrentWeek ? Number(((currentDay / 7) * 10).toFixed(1)) : 10
    if (t4Hours >= t4Target * 0.9) {
      praises.push(isCurrentWeek ? `任务四（科研推进）截止今日累计投入 ${t4Hours}h（阶段目标 ${t4Target}h），文献钻研与论文打磨高效推进！` : `任务四全周累计达成 ${t4Hours} 小时（目标 10h），科研产出扎实！`)
    } else if (t4Hours > 0) {
      praises.push(`任务四科研推进已累计投入 ${t4Hours}h，保持学术钻研与论文修改势头！`)
    }

    // 点评任务2：习概与双创
    const t2Hours = Number((t2Minutes / 60).toFixed(1))
    const t2Target = isCurrentWeek ? Math.min(6, currentDay) * 1.5 : 9
    if (t2Hours >= t2Target * 0.95) {
      praises.push(isCurrentWeek ? `任务二（习概与双创导论 90m）截止今日累计投入 ${t2Hours}h（阶段目标 ${t2Target}h），核心理论与商业推演执行到位！` : `任务二全周累计投入 ${t2Hours} 小时（目标 9h），理论复习与商业模式推演执行到位。`)
    } else {
      improvements.push(`任务二用时仅 ${t2Hours}h（阶段目标 ${t2Target}h），存在学时打折，需利用好早间90分钟闭环。`)
    }

    // 点评任务3：体育专业课
    const t3Hours = Number((t3Minutes / 60).toFixed(1))
    const t3Target = isCurrentWeek ? [1, 2, 3, 5, 7].filter(d => d <= currentDay).length * 1.0 : 5
    if (t3Hours >= t3Target * 0.95) {
      praises.push(isCurrentWeek ? `任务三专业课三科（力学/科研/竞赛）截止今日累计完成 ${t3Hours}h（阶段目标 ${t3Target}h），三科目并驾齐驱！` : `任务三专业课全周累计完成 ${t3Hours} 小时（目标 5h），三科目并驾齐驱，知识点无死角覆盖。`)
    } else {
      improvements.push(`任务三专业课累计 ${t3Hours}h（阶段目标 ${t3Target}h），存在欠账。请坚持每天各攻坚20分钟！`)
    }

    // 点评健身房锻炼
    const fitHours = Number((fitnessMinutes / 60).toFixed(1))
    const fitTarget = isCurrentWeek ? [6, 7].filter(d => d <= currentDay).length * 2.5 : 5
    if (fitTarget > 0) {
      if (fitHours >= fitTarget * 0.95) {
        praises.push(`周末健身房高强度拉练超额完成（${fitHours} 小时），力量抗阻与心肺耐力储备坚实，劳逸结合极佳！`)
      } else {
        improvements.push(`周末健身房锻炼累计 ${fitHours}h，未能达标 ${fitTarget} 小时。强健的体魄是高强度科研与备考的基石，周末10:00-12:30不可随意缺席！`)
      }
    }

    // 综合评级判定
    let overallGrade: 'S' | 'A' | 'B' | 'C' | 'D' = 'A'
    const totalActual = t1Hours + t2Hours + t3Hours + t4Hours + fitHours
    const totalTarget = isCurrentWeek ? (t1Target + t2Target + t3Target + t4Target + fitTarget) : 40
    const hourRate = totalTarget > 0 ? (totalActual / totalTarget) : 1

    if (punctualityRate >= 92 && hourRate >= 0.95) overallGrade = 'S'
    else if (punctualityRate >= 80 && hourRate >= 0.85) overallGrade = 'A'
    else if (punctualityRate >= 65 && hourRate >= 0.70) overallGrade = 'B'
    else overallGrade = 'C'

    const coachingAdvice = overallGrade === 'S' || overallGrade === 'A'
      ? (isCurrentWeek && currentDay === 1
          ? '🌟 周一首战告捷，达成 S 级完美开门红！明日周二上午无课，保持早起势头，08:00 自习室准点见！'
          : '状态绝佳！下周继续严格执行分段式雅思与科研攻坚，上午课后务必保证下午两点准时就位自习室，坚决捍卫打卡全勤！')
      : '警惕节奏滑坡！下周首要任务是消除迟到现象，严格设置提前10分钟闹钟。重新夺回主动权！'

    return {
      weekKey,
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      punctualityRate,
      totalOnTime: onTimeCount,
      totalLate: lateCount,
      totalMissed: missedCount,
      lateRecords,
      task1Hours: { actual: t1Hours, target: 11 },
      task4Hours: { actual: t4Hours, target: 10 },
      task2Hours: { actual: t2Hours, target: 9 },
      task3Hours: {
        total: { actual: t3Hours, target: 5 },
        biomechanics: { actual: Number((biomechanicsMin / 60).toFixed(1)), target: 1.7 },
        researchMethod: { actual: Number((researchMethodMin / 60).toFixed(1)), target: 1.7 },
        competition: { actual: Number((competitionMin / 60).toFixed(1)), target: 1.6 }
      },
      fitnessHours: { actual: fitHours, target: 5 },
      extraHours,
      extraDetails,
      praises,
      improvements,
      coachingAdvice,
      overallGrade,
      generatedAt: new Date().toISOString()
    }
  }

  function reload() {
    checkIns.value = StorageService.getCheckIns()
  }

  return {
    courses,
    checkpoints,
    checkIns,
    currentDayOfWeek,
    todayCheckpoints,
    todayCourses,
    nextCheckpoint,
    getCheckInsByDate,
    getCheckInForCheckpoint,
    getCheckpointStatus,
    checkIn,
    addExtraStudySession,
    generateWeeklyReview,
    reload
  }
})
