<template>
  <aside class="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800/80 flex flex-col h-screen shrink-0 sticky top-0">
    <!-- Brand Header -->
    <div class="p-5 flex items-center justify-between border-b border-slate-800/80">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-tomato-600 to-tomato-400 flex items-center justify-center shadow-lg shadow-tomato-500/20 text-xl font-bold text-white">
          🍅
        </div>
        <div>
          <h1 class="font-bold text-lg text-slate-100 tracking-tight">番茄ToDo <span class="text-xs font-semibold px-1.5 py-0.5 rounded bg-tomato-500/20 text-tomato-400 border border-tomato-500/30">PRO</span></h1>
          <p class="text-xs text-slate-400">时间统筹与多维复盘</p>
        </div>
      </div>
    </div>

    <!-- Trusted Device Badge -->
    <div class="px-3.5 py-1.5 mx-4 mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-400 cursor-pointer hover:bg-emerald-500/20 transition-colors"
      @click="$emit('open-mobile-connect')"
      title="点击查看手机受信任设备与专属私密链接"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <ShieldCheck class="w-3.5 h-3.5" />
        受信任设备中枢
      </span>
      <span class="text-[10px] text-emerald-300 font-semibold px-1.5 py-0.2 bg-emerald-500/20 rounded-full">
        已通达
      </span>
    </div>

    <!-- Cloud Real-time Sync Badge -->
    <div class="px-3.5 py-1.5 mx-4 mt-2 rounded-lg border flex items-center justify-between text-[11px] cursor-pointer transition-colors"
      :class="[
        syncState.isSyncing.value
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20'
      ]"
      @click="syncState.syncNow"
      :title="'手机与电脑秒级云端互通 (点击立即强制双向核验)'"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <RefreshCw class="w-3.5 h-3.5 text-cyan-400" :class="{ 'animate-spin': syncState.isSyncing.value }" />
        手机电脑云端互通
      </span>
      <span class="text-[10px] px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-1"
        :class="syncState.isSyncing.value ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" :class="{ 'animate-pulse': !syncState.isSyncing.value }"></span>
        {{ syncState.isSyncing.value ? '同步中' : '实时在线' }}
      </span>
    </div>

    <!-- Quick Stats Card -->
    <div class="px-4 py-3 mx-4 my-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
      <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
        <span class="flex items-center gap-1">
          <Flame class="w-3.5 h-3.5 text-orange-400" />
          连续专注
        </span>
        <span class="font-bold text-orange-400">{{ timeLogStore.currentStreak === 0 ? '第 1 天起步' : timeLogStore.currentStreak + ' 天' }}</span>
      </div>
      <div class="flex items-center justify-between text-xs text-slate-400">
        <span class="flex items-center gap-1">
          <Clock class="w-3.5 h-3.5 text-tomato-400" />
          今日专注
        </span>
        <span class="font-bold text-slate-200">
          {{ Math.floor(timeLogStore.todayMinutes / 60) }}h {{ timeLogStore.todayMinutes % 60 }}m
        </span>
      </div>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 px-3 space-y-1.5 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group"
        :class="[
          $route.path === item.path
            ? 'bg-gradient-to-r from-tomato-500/15 to-transparent text-tomato-400 border-l-4 border-tomato-500 font-semibold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        ]"
      >
        <component
          :is="item.icon"
          class="w-5 h-5 transition-transform group-hover:scale-110"
          :class="$route.path === item.path ? 'text-tomato-400' : 'text-slate-500'"
        />
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono"
        >
          {{ item.badge }}
        </span>
      </RouterLink>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-slate-800/80 space-y-2">
      <button
        @click="$emit('open-quick-time')"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
      >
        <Zap class="w-4 h-4 fill-current" />
        填报实际学时 (免等倒计时)
      </button>

      <button
        @click="$emit('open-mobile-connect')"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm"
      >
        <Smartphone class="w-4 h-4" />
        手机扫码打卡 (移动端)
      </button>

      <button
        @click="$emit('open-extra-study')"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
      >
        <Sparkles class="w-4 h-4 fill-current" />
        额外多学打卡 (自主加餐)
      </button>

      <button
        @click="$emit('open-manual-log')"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-all"
      >
        <PlusCircle class="w-4 h-4 text-tomato-400" />
        补录历史专注时间
      </button>

      <button
        @click="$emit('open-backup')"
        class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
      >
        <Database class="w-3.5 h-3.5" />
        数据备份与导出
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Timer,
  CalendarRange,
  CheckSquare,
  History,
  BarChart3,
  Settings,
  Flame,
  Clock,
  PlusCircle,
  Database,
  Sparkles,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Zap
} from 'lucide-vue-next'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useSyncState } from '@/utils/storage'

defineEmits<{
  (e: 'open-manual-log'): void
  (e: 'open-backup'): void
  (e: 'open-extra-study'): void
  (e: 'open-mobile-connect'): void
  (e: 'open-quick-time'): void
}>()

const syncState = useSyncState()
const route = useRoute()
const timeLogStore = useTimeLogStore()
const taskStore = useTaskStore()
const scheduleStore = useScheduleStore()

const navItems = computed(() => [
  {
    path: '/',
    label: '专注时钟',
    icon: Timer
  },
  {
    path: '/schedule',
    label: '课表与自习打卡',
    icon: CalendarRange,
    badge: `${scheduleStore.todayCheckpoints.length}节点`
  },
  {
    path: '/tasks',
    label: '任务与目标统筹',
    icon: CheckSquare,
    badge: taskStore.activeTasks.length > 0 ? `${taskStore.activeTasks.length}` : undefined
  },
  {
    path: '/timeline',
    label: '时光机回顾',
    icon: History,
    badge: `${timeLogStore.timeLogs.length}`
  },
  {
    path: '/reports',
    label: '多维统计报表',
    icon: BarChart3
  },
  {
    path: '/settings',
    label: '个人偏好设置',
    icon: Settings
  }
])
</script>
