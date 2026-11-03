<template>
  <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-800/90 via-slate-800/70 to-slate-900/90 border border-slate-700/80 shadow-soft-lg backdrop-blur-md relative overflow-hidden">
    <!-- Glow line -->
    <div
      class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
      :class="bannerGlowClass"
    ></div>

    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <!-- Left info -->
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 font-mono flex items-center gap-1.5">
            <MapPin class="w-3.5 h-3.5 text-tomato-400" />
            {{ currentDayLabel }} · 自习打卡守则 (防作弊提前30m制)
          </span>

          <!-- State Tag -->
          <span
            v-if="nextInfo"
            class="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            :class="stateTagClass"
          >
            {{ stateTagText }}
          </span>
        </div>

        <div v-if="nextInfo" class="mt-1">
          <div class="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span>下个目标：到达{{ nextInfo.checkpoint.target }}（{{ nextInfo.checkpoint.time }} 前）</span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span class="text-tomato-400 font-medium">[{{ nextInfo.checkpoint.taskName }}]</span>
            <span class="text-slate-500">· {{ nextInfo.checkpoint.description }}</span>
          </p>
        </div>

        <div v-else class="text-sm font-semibold text-emerald-400 flex items-center gap-2 mt-1">
          <CheckCircle2 class="w-4 h-4" />
          <span>今日所有既定自习室 / 健身房打卡已全部完成！保持自律节奏！</span>
        </div>
      </div>

      <!-- Right Actions & Today Progress -->
      <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
        <!-- Today check-in count -->
        <div class="text-right hidden sm:block">
          <div class="text-[11px] text-slate-500">今日打卡进度</div>
          <div class="text-xs font-mono font-bold text-slate-200">
            {{ todayCheckedCount }} / {{ scheduleStore.todayCheckpoints.length }} 次完成
          </div>
        </div>

        <!-- Mobile Connect Quick Trigger -->
        <button
          @click="$emit('open-mobile-connect')"
          class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all shadow-sm"
          title="手机扫码在自习室/健身房随时打卡"
        >
          <Smartphone class="w-3.5 h-3.5" />
          <span>手机打卡</span>
        </button>

        <!-- Extra Study Quick Trigger -->
        <button
          @click="$emit('open-extra-study')"
          class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition-all shadow-sm"
          title="空闲时间主动加练多学打卡"
        >
          <Sparkles class="w-3.5 h-3.5 fill-current" />
          <span>额外多学</span>
        </button>

        <!-- Check-in Trigger Button with 30m window lock -->
        <button
          v-if="nextInfo"
          :disabled="!nextInfo.status.canCheckIn"
          @click="handleCheckIn"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
          :class="[
            !nextInfo.status.canCheckIn
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : nextInfo.status.state === 'late'
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 animate-pulse'
                : 'bg-tomato-500 hover:bg-tomato-600 text-white shadow-tomato-500/30'
          ]"
        >
          <MapPin class="w-4 h-4 fill-current" />
          <span v-if="!nextInfo.status.canCheckIn">
            打卡锁住 ({{ nextInfo.status.earliestTimeStr || '未到时间' }} 开放)
          </span>
          <span v-else-if="nextInfo.status.state === 'late'">
            超时迟到！立即打卡
          </span>
          <span v-else>
            准时就位打卡 ({{ nextInfo.checkpoint.target }})
          </span>
        </button>

        <button
          @click="$router.push('/schedule')"
          class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700/80 transition-colors"
          title="查看完整课表与打卡流"
        >
          完整课表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { MapPin, CheckCircle2, Sparkles, Smartphone } from 'lucide-vue-next'
import { useScheduleStore } from '@/stores/useScheduleStore'

defineEmits<{
  (e: 'open-extra-study'): void
  (e: 'open-mobile-connect'): void
}>()

const scheduleStore = useScheduleStore()

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const currentDayLabel = computed(() => {
  const d = dayjs().day()
  return weekdays[d]
})

const nextInfo = computed(() => {
  return scheduleStore.nextCheckpoint
})

const bannerGlowClass = computed(() => {
  if (!nextInfo.value) return 'from-emerald-500 to-indigo-500'
  if (nextInfo.value.status.state === 'late') return 'from-amber-500 to-red-500'
  if (nextInfo.value.status.state === 'open') return 'from-tomato-500 to-indigo-500'
  return 'from-slate-600 to-slate-700'
})

const stateTagClass = computed(() => {
  if (!nextInfo.value) return ''
  if (nextInfo.value.status.state === 'too_early') return 'bg-slate-700/60 text-slate-400 border border-slate-600'
  if (nextInfo.value.status.state === 'late') return 'bg-red-500/20 text-red-400 border border-red-500/30'
  return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
})

const stateTagText = computed(() => {
  if (!nextInfo.value) return ''
  if (nextInfo.value.status.state === 'too_early') {
    return `🔒 打卡未开启 (最多提前30分，${nextInfo.value.status.earliestTimeStr}开放)`
  }
  if (nextInfo.value.status.state === 'late') {
    return `⚠️ 已超时 ${nextInfo.value.status.diffMinutes} 分钟 (迟到预警)`
  }
  return '🟢 打卡窗口已开放 (要求准时就位)'
})

const todayCheckedCount = computed(() => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  return scheduleStore.todayCheckpoints.filter(cp => {
    return !!scheduleStore.getCheckInForCheckpoint(cp.id, todayStr)
  }).length
})

function handleCheckIn() {
  if (!nextInfo.value) return
  const cp = nextInfo.value.checkpoint
  try {
    const record = scheduleStore.checkIn(cp.id)
    if (record.status === 'late') {
      alert(`⚠️ 打卡成功，但已迟到 ${record.diffMinutes} 分钟！系统已如实记入本周总结并分析改进原因。下一次请提前就位！`)
    } else {
      alert(`🎉 打卡成功！准时到达${cp.target}，专注状态就绪，开始向既定目标冲刺！`)
    }
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : String(err))
  }
}
</script>
