import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isoWeek from 'dayjs/plugin/isoWeek'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import type { TimeLog } from '@/types'
import { StorageService } from '@/utils/storage'

dayjs.extend(isBetween)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)

export const useTimeLogStore = defineStore('timeLogs', () => {
  const timeLogs = ref<TimeLog[]>(StorageService.getTimeLogs())

  function save() {
    StorageService.saveTimeLogs(timeLogs.value)
  }

  // 按时间降序排列的所有记录
  const sortedLogs = computed(() => {
    return [...timeLogs.value].sort((a, b) => dayjs(b.startTime).valueOf() - dayjs(a.startTime).valueOf())
  })

  // 添加时间记录
  function addLog(log: Omit<TimeLog, 'id'>) {
    const newLog: TimeLog = {
      ...log,
      id: `log-${Date.now()}`
    }
    timeLogs.value.unshift(newLog)
    save()
    return newLog
  }

  // 更新时间记录
  function updateLog(id: string, updates: Partial<TimeLog>) {
    const idx = timeLogs.value.findIndex(l => l.id === id)
    if (idx !== -1) {
      timeLogs.value[idx] = { ...timeLogs.value[idx], ...updates }
      save()
    }
  }

  // 删除记录
  function deleteLog(id: string) {
    timeLogs.value = timeLogs.value.filter(l => l.id !== id)
    save()
  }

  // 获取特定日期的记录列表
  function getLogsByDate(dateStr: string) {
    const target = dayjs(dateStr).format('YYYY-MM-DD')
    return timeLogs.value.filter(l => dayjs(l.startTime).format('YYYY-MM-DD') === target)
  }

  // 获取日期范围内的记录
  function getLogsByRange(startISO: string, endISO: string) {
    const start = dayjs(startISO)
    const end = dayjs(endISO)
    return timeLogs.value.filter(l => {
      const logTime = dayjs(l.startTime)
      return (logTime.isAfter(start) || logTime.isSame(start)) && (logTime.isBefore(end) || logTime.isSame(end))
    })
  }

  // 今日总专注分钟数
  const todayMinutes = computed(() => {
    const today = dayjs().format('YYYY-MM-DD')
    return timeLogs.value
      .filter(l => dayjs(l.startTime).format('YYYY-MM-DD') === today)
      .reduce((sum, l) => sum + l.durationMinutes, 0)
  })

  // 本周总专注分钟数（周一到周日）
  const thisWeekMinutes = computed(() => {
    const startOfWeek = dayjs().startOf('isoWeek')
    const endOfWeek = dayjs().endOf('isoWeek')
    return timeLogs.value
      .filter(l => {
        const t = dayjs(l.startTime)
        return t.isAfter(startOfWeek) && t.isBefore(endOfWeek)
      })
      .reduce((sum, l) => sum + l.durationMinutes, 0)
  })

  // 本月总专注分钟数
  const thisMonthMinutes = computed(() => {
    const currentMonth = dayjs().format('YYYY-MM')
    return timeLogs.value
      .filter(l => dayjs(l.startTime).format('YYYY-MM') === currentMonth)
      .reduce((sum, l) => sum + l.durationMinutes, 0)
  })

  // 本季度总专注分钟数
  const thisQuarterMinutes = computed(() => {
    const currentYear = dayjs().year()
    const currentQuarter = dayjs().quarter()
    return timeLogs.value
      .filter(l => {
        const t = dayjs(l.startTime)
        return t.year() === currentYear && t.quarter() === currentQuarter
      })
      .reduce((sum, l) => sum + l.durationMinutes, 0)
  })

  // 连续打卡天数 Streak (包含番茄专注日志与自习室准点打卡)
  const currentStreak = computed(() => {
    const checkIns = StorageService.getCheckIns()
    const logDates = timeLogs.value.map(l => dayjs(l.startTime).format('YYYY-MM-DD'))
    const checkInDates = checkIns.map(c => c.date)
    const dateSet = new Set([...logDates, ...checkInDates])
    let streak = 0
    let checkDate = dayjs()

    // 如果今天还没打卡，先看昨天是否打卡
    if (!dateSet.has(checkDate.format('YYYY-MM-DD'))) {
      checkDate = checkDate.subtract(1, 'day')
    }

    while (dateSet.has(checkDate.format('YYYY-MM-DD'))) {
      streak++
      checkDate = checkDate.subtract(1, 'day')
    }

    return streak
  })

  function reload() {
    timeLogs.value = StorageService.getTimeLogs()
  }

  return {
    timeLogs,
    sortedLogs,
    addLog,
    updateLog,
    deleteLog,
    getLogsByDate,
    getLogsByRange,
    todayMinutes,
    thisWeekMinutes,
    thisMonthMinutes,
    thisQuarterMinutes,
    currentStreak,
    reload
  }
})
