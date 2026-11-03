<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
          <span>每周课表与自习打卡准则</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-tomato-500/15 text-tomato-400 border border-tomato-500/30 font-semibold">
            严格准时制 (提前30m内打卡)
          </span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          严格按照大学课表规划的周一至周日日程闭环，只能在打卡时间前半小时内打卡防作弊
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="showMobileModal = true"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all shadow-sm"
        >
          <Smartphone class="w-4 h-4" />
          <span>手机移动端打卡</span>
        </button>

        <button
          @click="showExtraModal = true"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition-all shadow-sm"
        >
          <Sparkles class="w-4 h-4 fill-current" />
          <span>额外多学打卡</span>
        </button>

        <!-- Quick Day Selector -->
        <div class="flex p-1 bg-slate-800/90 rounded-xl border border-slate-700/80">
          <button
            v-for="d in dayTabs"
            :key="d.dayOfWeek"
            @click="selectedDay = d.dayOfWeek"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :class="[
              selectedDay === d.dayOfWeek
                ? 'bg-tomato-500 text-white shadow-md shadow-tomato-500/25'
                : selectedDay === scheduleStore.currentDayOfWeek && selectedDay !== d.dayOfWeek
                  ? 'text-tomato-400 hover:text-white'
                  : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            {{ d.label }}
            <span v-if="d.dayOfWeek === scheduleStore.currentDayOfWeek" class="w-1.5 h-1.5 rounded-full bg-tomato-400 inline-block ml-0.5 mb-1"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Active Day Schedule Card -->
    <div class="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700/50">
        <div>
          <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>{{ getDayTitle(selectedDay) }}</span>
            <span class="text-xs font-normal text-slate-400">({{ getDayMetaDesc(selectedDay) }})</span>
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            {{ getDayExecutionSummary(selectedDay) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500 font-mono">当日打卡节点数:</span>
          <span class="text-xs font-bold font-mono text-tomato-400">{{ selectedDayCheckpoints.length }} 次</span>
        </div>
      </div>

      <!-- University Classes for this day -->
      <div>
        <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <BookOpen class="w-4 h-4 text-indigo-400" />
          大学理论与技能课程表 (中南大学教务系统)
        </h4>

        <div v-if="selectedDayCourses.length === 0" class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-400" />
          <span>本日全天无大学理论/技能课程，全心投入自习室任务与体能训练！</span>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="course in selectedDayCourses"
            :key="course.id"
            class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-slate-100">{{ course.name }}</span>
              <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                {{ course.time }}
              </span>
            </div>
            <div class="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span class="truncate">{{ course.location }}</span>
            </div>
            <div class="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800">
              <span>{{ course.instructor || '授课教师' }}</span>
              <span class="font-mono">{{ course.weeks }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Study Room Checkpoints & Tasks Execution Sequence -->
      <div>
        <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <MapPin class="w-4 h-4 text-tomato-400" />
          自习室 / 健身房打卡攻坚节点 (仅限提前30分钟内打卡防作弊)
        </h4>

        <div class="space-y-3">
          <div
            v-for="cp in selectedDayCheckpoints"
            :key="cp.id"
            class="p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            :class="[
              getCheckpointRecord(cp.id)
                ? getCheckpointRecord(cp.id)?.status === 'on_time'
                  ? 'bg-slate-900/40 border-emerald-500/30'
                  : 'bg-slate-900/40 border-amber-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            ]"
          >
            <!-- Node Info -->
            <div class="space-y-1.5 min-w-0">
              <div class="flex items-center gap-2.5">
                <span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                  {{ cp.time }} 前必须到达
                </span>
                <span class="text-sm font-bold text-slate-100">{{ cp.taskName }}</span>
                <span
                  class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  :class="cp.target === '健身房' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-tomato-500/20 text-tomato-300'"
                >
                  {{ cp.target }}
                </span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ cp.description }}
              </p>
            </div>

            <!-- Check-in Status / Action Buttons -->
            <div class="flex items-center gap-3 shrink-0 flex-wrap justify-end">
              <!-- Direct Start Focus Timer matching Slot Duration without breaks -->
              <button
                @click="startContinuousFocus(cp)"
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                title="番茄钟直接设定为此任务总时长，纯沉浸无中途休息"
              >
                <Play class="w-3.5 h-3.5 fill-current text-tomato-400" />
                <span>直连专注 ({{ cp.durationMinutes }}m)</span>
              </button>

              <!-- If already checked in -->
              <div v-if="getCheckpointRecord(cp.id)" class="text-right">
                <div class="flex items-center gap-1.5 justify-end">
                  <span
                    class="text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                    :class="[
                      getCheckpointRecord(cp.id)?.status === 'on_time'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    ]"
                  >
                    <CheckCircle2 v-if="getCheckpointRecord(cp.id)?.status === 'on_time'" class="w-3.5 h-3.5" />
                    <AlertTriangle v-else class="w-3.5 h-3.5" />
                    {{ getCheckpointRecord(cp.id)?.status === 'on_time' ? '已准时打卡' : `迟到 ${getCheckpointRecord(cp.id)?.diffMinutes} 分钟` }}
                  </span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1 font-mono">
                  打卡时间: {{ formatCheckInTime(getCheckpointRecord(cp.id)?.checkInTime) }}
                </div>
              </div>

              <!-- If not yet checked in (Evaluate 30m lock) -->
              <div v-else class="flex items-center gap-2">
                <button
                  :disabled="!getLiveStatus(cp).canCheckIn"
                  @click="handleDoCheckIn(cp)"
                  class="px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  :class="[
                    !getLiveStatus(cp).canCheckIn
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : getLiveStatus(cp).state === 'late'
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25 animate-pulse'
                        : 'bg-tomato-500 hover:bg-tomato-600 text-white shadow-tomato-500/25'
                  ]"
                >
                  <MapPin class="w-3.5 h-3.5" />
                  <span v-if="!getLiveStatus(cp).canCheckIn">
                    提前30分开放 ({{ getLiveStatus(cp).earliestTimeStr || '未到时间' }})
                  </span>
                  <span v-else-if="getLiveStatus(cp).state === 'late'">
                    超时迟到！立即打卡
                  </span>
                  <span v-else>
                    到达{{ cp.target }}准时打卡
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Extra Study Modal -->
    <ExtraStudyModal
      :is-open="showExtraModal"
      @close="showExtraModal = false"
    />

    <!-- Mobile Connect Modal -->
    <MobileConnectModal
      :is-open="showMobileModal"
      @close="showMobileModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  BookOpen,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Smartphone
} from 'lucide-vue-next'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { usePomodoroStore } from '@/stores/usePomodoroStore'
import ExtraStudyModal from '@/components/ExtraStudyModal.vue'
import MobileConnectModal from '@/components/MobileConnectModal.vue'
import type { StudyCheckpoint } from '@/types'

const router = useRouter()
const scheduleStore = useScheduleStore()
const pomodoroStore = usePomodoroStore()

const showExtraModal = ref(false)
const showMobileModal = ref(false)

const dayTabs = [
  { dayOfWeek: 1, label: '周一' },
  { dayOfWeek: 2, label: '周二' },
  { dayOfWeek: 3, label: '周三' },
  { dayOfWeek: 4, label: '周四' },
  { dayOfWeek: 5, label: '周五' },
  { dayOfWeek: 6, label: '周六' },
  { dayOfWeek: 7, label: '周日' }
]

const selectedDay = ref<number>(scheduleStore.currentDayOfWeek)

const selectedDayCourses = computed(() => {
  return scheduleStore.courses.filter(c => c.dayOfWeek === selectedDay.value)
})

const selectedDayCheckpoints = computed(() => {
  return scheduleStore.checkpoints.filter(cp => cp.dayOfWeek === selectedDay.value)
})

function getDayTitle(day: number) {
  const map: Record<number, string> = {
    1: '周一：双创与足球课日 · 全维攻坚',
    2: '周二：技能课日 · 分段攻坚雅思与科研',
    3: '周三：游泳、组会与生物力学日',
    4: '周四：上午满课日 · 重点保质任务一与二',
    5: '周五：习概课与竞赛学日 · 课上消化任务二',
    6: '周六：无课自律日 · 早学+2.5h健身+雅思科研',
    7: '周日：收官复盘日 · 专业课+2.5h健身+周自动化汇报'
  }
  return map[day] || `星期 ${day}`
}

function getDayMetaDesc(day: number) {
  const map: Record<number, string> = {
    1: '任务1(3h) + 任务2(1.5h) + 任务3(1h) 全达标',
    2: '下午2点+晚间7点半双时段拆解任务1',
    3: '午休前完成任务2，组会后推进任务1，晚课后攻坚任务3',
    4: '上午满课，下午保任务2，晚间保任务1 (免做任务3)',
    5: '早八攻坚任务3，课上消化任务2，下午保任务1',
    6: '早八任务2，10点健身房2.5h，下午保任务1 (免做任务3)',
    7: '早八任务3，10点健身房2.5h，下午保任务1并生成周汇报 (免做任务2)'
  }
  return map[day] || ''
}

function getDayExecutionSummary(day: number) {
  const map: Record<number, string> = {
    1: '上午八点准时到达自习室打卡完成任务2，九点半上足球课；下午两点准时自习室打卡攻坚任务1和任务3，晚上上双创课。',
    2: '早上无课，八点到达自习室打卡完成任务2和任务3；下午两点打卡完成任务1前半段，技能课后晚上七点半继续打卡完成任务1后半段。',
    3: '早上游泳课后十点到达自习室打卡完成任务2，下午组会后两点半自习室打卡攻坚任务1，晚课后九点准时自习室推进任务3。',
    4: '上午满课，下午两点准时到达自习室打卡完成任务2，晚上七点半准时自习室打卡完成任务1（周四免做任务3）。',
    5: '早上八点准时到达自习室打卡完成任务3，十点习概课上完成任务2，下午两点半准时自习室打卡完成任务1。',
    6: '无课！早上八点准时到达自习室打卡完成任务2，十点准时到达健身房打卡锻炼2.5小时，下午两点半自习室打卡完成任务1。',
    7: '无课！早上八点准时到达自习室打卡完成任务3，十点准时到达健身房打卡锻炼2.5小时，下午两点半自习室打卡完成任务1并生成本周汇报。'
  }
  return map[day] || ''
}

const todayStr = computed(() => dayjs().format('YYYY-MM-DD'))

function getCheckpointRecord(cpId: string) {
  return scheduleStore.getCheckInForCheckpoint(cpId, todayStr.value)
}

function getLiveStatus(cp: StudyCheckpoint) {
  return scheduleStore.getCheckpointStatus(cp, todayStr.value)
}

function formatCheckInTime(isoStr?: string) {
  if (!isoStr) return '-'
  return dayjs(isoStr).format('HH:mm:ss')
}

function handleDoCheckIn(cp: StudyCheckpoint) {
  try {
    const rec = scheduleStore.checkIn(cp.id)
    if (rec.status === 'late') {
      alert(`⚠️ 已打卡，但你已迟到 ${rec.diffMinutes} 分钟！已被忠实记录在每周总结的改进项中！下一次务必在 ${cp.time} 前到达！`)
    } else {
      alert(`🎉 打卡成功！准时到达${cp.target}，祝你专注高效！`)
    }
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : String(err))
  }
}

// 直连当前时段所需任务总时长，中途不设休息
function startContinuousFocus(cp: StudyCheckpoint) {
  let catId = 'cat-ielts-research'
  if (cp.taskName.includes('任务二') || cp.taskName.includes('习概') || cp.taskName.includes('双创')) {
    catId = 'cat-politics-innovation'
  } else if (cp.taskName.includes('任务三') || cp.taskName.includes('专业课')) {
    catId = 'cat-major-courses'
  } else if (cp.target === '健身房') {
    catId = 'cat-fitness-workout'
  }

  pomodoroStore.setTargetDuration(cp.durationMinutes, catId, cp.taskName)
  router.push('/')
}
</script>
