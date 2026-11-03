<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
    <!-- Check-in Urgent Banner (带30分钟防作弊锁) -->
    <CheckInBanner
      @open-extra-study="showExtraModal = true"
      @open-mobile-connect="showMobileModal = true"
    />

    <!-- Continuous Slot Duration Quick Selector (直连任务时段总时长，中途无间断) -->
    <div class="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Zap class="w-4 h-4 text-amber-400" />
          任务时段总时长直连 (纯沉浸无中途休息):
        </span>
        <span class="text-[11px] text-slate-500 font-mono">点击即设</span>
      </div>

      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          v-for="p in durationPresets"
          :key="p.minutes"
          @click="selectSlotPreset(p)"
          class="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1"
          :class="[
            pomodoroStore.settings.pomodoroMinutes === p.minutes && pomodoroStore.mode === 'pomodoro'
              ? 'bg-tomato-500 text-white border-tomato-500 shadow-sm'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
          ]"
        >
          <span>{{ p.label }}</span>
        </button>
      </div>
    </div>

    <!-- Category Selector Pill Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span class="text-xs font-medium text-slate-500 shrink-0">当前攻坚项目:</span>
      <button
        v-for="cat in categoryStore.categories"
        :key="cat.id"
        @click="pomodoroStore.selectedCategoryId = cat.id"
        class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border"
        :class="[
          pomodoroStore.selectedCategoryId === cat.id
            ? 'border-transparent text-white shadow-md'
            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
        ]"
        :style="{
          backgroundColor: pomodoroStore.selectedCategoryId === cat.id ? cat.color : undefined
        }"
      >
        <span
          class="w-2 h-2 rounded-full"
          :style="{ backgroundColor: pomodoroStore.selectedCategoryId === cat.id ? '#ffffff' : cat.color }"
        ></span>
        <span>{{ cat.name }}</span>
      </button>

      <!-- Extra Study Quick Trigger -->
      <button
        @click="showExtraModal = true"
        class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 transition-all shrink-0 ml-auto"
      >
        <Sparkles class="w-3.5 h-3.5 fill-current" />
        <span>额外多学打卡</span>
      </button>
    </div>

    <!-- Main Timer Card -->
    <div class="relative bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center shadow-soft-lg backdrop-blur-sm overflow-hidden">
      <!-- Glow ambient background -->
      <div
        class="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        :style="{ backgroundColor: activeCategory?.color || '#ff4d4f' }"
      ></div>

      <!-- Circular SVG Progress Ring -->
      <div class="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        <svg class="w-full h-full transform -rotate-90">
          <!-- Background track -->
          <circle
            cx="50%"
            cy="50%"
            r="44%"
            class="stroke-slate-700/40"
            stroke-width="8"
            fill="transparent"
          />
          <!-- Progress stroke -->
          <circle
            cx="50%"
            cy="50%"
            r="44%"
            class="transition-all duration-1000 ease-linear"
            :class="pomodoroStore.isRunning ? 'stroke-tomato-500' : 'stroke-slate-500'"
            :style="{
              stroke: pomodoroStore.isRunning ? (activeCategory?.color || '#ff4d4f') : undefined
            }"
            stroke-width="8"
            stroke-linecap="round"
            fill="transparent"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>

        <!-- Inner Content (Time & State) -->
        <div class="absolute flex flex-col items-center text-center">
          <span class="text-xs uppercase tracking-widest font-mono text-slate-400 mb-1">
            CONTINUOUS FOCUS ({{ pomodoroStore.settings.pomodoroMinutes }}m)
          </span>
          <div class="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono text-slate-100 select-none">
            {{ pomodoroStore.formattedTime }}
          </div>
          <div class="mt-2 text-xs font-medium px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 flex items-center gap-1.5 border border-slate-600/50 max-w-[220px]">
            <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ backgroundColor: activeCategory?.color || '#ff4d4f' }"></span>
            <span class="truncate">{{ activeCategory?.name || '深度攻坚' }}</span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="mt-8 flex items-center gap-4">
        <!-- Reset Button -->
        <button
          @click="pomodoroStore.reset"
          title="重置为当前设定时长"
          class="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/70"
        >
          <RotateCcw class="w-5 h-5" />
        </button>

        <!-- Play / Pause Button -->
        <button
          v-if="!pomodoroStore.isRunning"
          @click="pomodoroStore.start"
          class="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-tomato-500 hover:bg-tomato-600 text-white font-bold text-base transition-all shadow-lg shadow-tomato-500/30 hover:scale-105 active:scale-95"
          :style="{ backgroundColor: activeCategory?.color || '#ff4d4f' }"
        >
          <Play class="w-5 h-5 fill-current" />
          <span>开始纯沉浸攻坚</span>
        </button>
        <button
          v-else
          @click="pomodoroStore.pause"
          class="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-base transition-all shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95"
        >
          <Pause class="w-5 h-5 fill-current" />
          <span>暂停计时</span>
        </button>

        <!-- Stopwatch finish button if stopwatch -->
        <button
          v-if="pomodoroStore.mode === 'stopwatch'"
          @click="pomodoroStore.finishStopwatch"
          title="完成并保存本次时长"
          class="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/30"
        >
          <Check class="w-5 h-5" />
        </button>
      </div>

      <!-- Current Focus Goal Note -->
      <div class="mt-8 w-full max-w-md">
        <input
          v-model="pomodoroStore.sessionNotes"
          type="text"
          placeholder="给这次专注写个小备注（例如：搞定剑雅18听力S4 / 梳理双创画布...）"
          class="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-tomato-500 transition-colors text-center"
        />
      </div>

      <!-- Ambient Sound Toggles -->
      <div class="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <span class="flex items-center gap-1 text-slate-500">
          <Volume2 class="w-3.5 h-3.5" />
          离线白噪音:
        </span>
        <button
          v-for="snd in ambientSounds"
          :key="snd.key"
          @click="setAmbient(snd.key)"
          class="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
          :class="[
            pomodoroStore.settings.ambientSound === snd.key
              ? 'bg-slate-700 text-slate-100 border border-slate-600'
              : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          {{ snd.label }}
        </button>
      </div>
    </div>

    <!-- Quick Stats Below Timer -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-tomato-500/10 border border-tomato-500/20 flex items-center justify-center text-tomato-400">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <div class="text-xs text-slate-400">今日累计专注</div>
          <div class="text-xl font-bold text-slate-100 font-mono mt-0.5">
            {{ Math.floor(timeLogStore.todayMinutes / 60) }}h {{ timeLogStore.todayMinutes % 60 }}m
          </div>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Target class="w-6 h-6" />
        </div>
        <div>
          <div class="text-xs text-slate-400">当前任务设定时长</div>
          <div class="text-xl font-bold text-slate-100 font-mono mt-0.5">
            {{ pomodoroStore.settings.pomodoroMinutes }} <span class="text-xs font-normal text-slate-400">分钟整段</span>
          </div>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Flame class="w-6 h-6" />
        </div>
        <div>
          <div class="text-xs text-slate-400">持续坚持天数</div>
          <div class="text-xl font-bold text-slate-100 font-mono mt-0.5">
            {{ timeLogStore.currentStreak === 0 ? '1' : timeLogStore.currentStreak }} <span class="text-xs font-normal text-slate-400">天 ({{ timeLogStore.currentStreak <= 1 ? '正式启程' : '连续打卡' }})</span>
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
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  Target,
  Flame,
  Volume2,
  Zap,
  Sparkles
} from 'lucide-vue-next'
import { usePomodoroStore } from '@/stores/usePomodoroStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import CheckInBanner from '@/components/CheckInBanner.vue'
import ExtraStudyModal from '@/components/ExtraStudyModal.vue'
import MobileConnectModal from '@/components/MobileConnectModal.vue'

const pomodoroStore = usePomodoroStore()
const categoryStore = useCategoryStore()
const timeLogStore = useTimeLogStore()

const showExtraModal = ref(false)
const showMobileModal = ref(false)

// 任务时段总时长直连预设（匹配用户实际课表日程，无中途强制休息中断）
const durationPresets = [
  { label: '90m (任务二 习概双创)', minutes: 90, catId: 'cat-politics-innovation' },
  { label: '180m (任务一 雅思AI科研 3h)', minutes: 180, catId: 'cat-ielts-research' },
  { label: '60m (任务三 专业课三科)', minutes: 60, catId: 'cat-major-courses' },
  { label: '150m (周末健身 2.5h)', minutes: 150, catId: 'cat-fitness-workout' },
  { label: '240m (周一下午 4h攻坚)', minutes: 240, catId: 'cat-ielts-research' },
  { label: '25m (短番茄)', minutes: 25, catId: undefined }
]

function selectSlotPreset(p: { label: string; minutes: number; catId?: string }) {
  pomodoroStore.setTargetDuration(p.minutes, p.catId, p.label)
}

const ambientSounds: { key: 'none' | 'rain' | 'whitenoise' | 'waves'; label: string }[] = [
  { key: 'none', label: '静音' },
  { key: 'rain', label: '细雨' },
  { key: 'whitenoise', label: '白噪音' },
  { key: 'waves', label: '海浪' }
]

const activeCategory = computed(() => {
  return categoryStore.getCategoryById(pomodoroStore.selectedCategoryId)
})

const radius = 132
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  if (pomodoroStore.mode === 'stopwatch') return 0
  const progress = pomodoroStore.progressPercent / 100
  return circumference * (1 - progress)
})

function setAmbient(key: 'none' | 'rain' | 'whitenoise' | 'waves') {
  pomodoroStore.updateSettings({ ambientSound: key })
}
</script>
