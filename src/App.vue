<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
    <!-- Desktop Sidebar -->
    <Sidebar
      class="hidden md:flex"
      @open-manual-log="showManualLogModal = true"
      @open-quick-time="showQuickTimeModal = true"
      @open-backup="showBackupModal = true"
      @open-extra-study="showExtraStudyModal = true"
      @open-mobile-connect="showMobileConnectModal = true"
    />

    <!-- Mobile Top Header Bar -->
    <div class="md:hidden flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      <div class="flex items-center gap-2.5">
        <span class="text-xl">🍅</span>
        <span class="font-bold text-sm tracking-tight">番茄ToDo <span class="text-[10px] text-tomato-400 font-mono">PRO</span></span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Live Cloud Sync Button -->
        <button
          @click="syncState.syncNow"
          class="flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all"
          :class="[
            syncState.isSyncing.value
              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
              : 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300 hover:text-white'
          ]"
          :title="'手机/电脑实时云同步 (点击立即互通)'"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': syncState.isSyncing.value }" />
          <span class="text-[10px] font-mono">{{ syncState.isSyncing.value ? '同步' : '云互通' }}</span>
        </button>

        <!-- Quick Time Entry Trigger Button -->
        <button
          @click="showQuickTimeModal = true"
          class="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white"
          title="填报实际学时 (免等倒计时)"
        >
          <Zap class="w-4 h-4 fill-current" />
        </button>

        <button
          @click="showMobileConnectModal = true"
          class="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 hover:text-white"
          title="手机扫码/多端同步"
        >
          <Smartphone class="w-4 h-4" />
        </button>
        <button
          @click="showManualLogModal = true"
          class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          title="补录时间"
        >
          <PlusCircle class="w-4 h-4 text-tomato-400" />
        </button>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      @click="mobileMenuOpen = false"
    >
      <div
        class="w-64 bg-slate-900 h-full p-4 space-y-4 border-r border-slate-800"
        @click.stop
      >
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xl">🍅</span>
            <span class="font-bold text-sm">番茄ToDo PRO</span>
          </div>
          <button @click="mobileMenuOpen = false" class="text-slate-400">
            <X class="w-5 h-5" />
          </button>
        </div>

        <nav class="space-y-1">
          <RouterLink
            v-for="item in mobileNavItems"
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
            :class="[
              $route.path === item.path
                ? 'bg-tomato-500/15 text-tomato-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <div class="pt-4 border-t border-slate-800 space-y-2">
          <button
            @click="showQuickTimeModal = true; mobileMenuOpen = false"
            class="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/15 rounded-lg border border-amber-500/30 font-bold"
          >
            <Zap class="w-4 h-4 fill-current text-amber-400" />
            <span>填报实际学时 (免等倒计时)</span>
          </button>

          <button
            @click="showMobileConnectModal = true; mobileMenuOpen = false"
            class="w-full flex items-center gap-2 px-3 py-2 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 rounded-lg border border-cyan-800/40 font-semibold"
          >
            <Smartphone class="w-4 h-4" />
            <span>手机扫码打卡与多端同步</span>
          </button>

          <button
            @click="showBackupModal = true; mobileMenuOpen = false"
            class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            <Database class="w-4 h-4" />
            <span>备份与恢复中心</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
      <RouterView />
    </main>

    <!-- Modals -->
    <QuickTimeEntryModal
      :is-open="showQuickTimeModal"
      @close="showQuickTimeModal = false"
      @saved="showQuickTimeModal = false"
    />

    <ManualLogModal
      :is-open="showManualLogModal"
      @close="showManualLogModal = false"
    />

    <DataExportModal
      :is-open="showBackupModal"
      @close="showBackupModal = false"
    />

    <ExtraStudyModal
      :is-open="showExtraStudyModal"
      @close="showExtraStudyModal = false"
    />

    <MobileConnectModal
      :is-open="showMobileConnectModal"
      @close="showMobileConnectModal = false"
    />

    <!-- 受信任设备防护门禁 (手机首次登入免密或输密验证) -->
    <DeviceAuthGate />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Menu,
  X,
  PlusCircle,
  Database,
  Timer,
  CalendarRange,
  CheckSquare,
  History,
  BarChart3,
  Settings,
  Sparkles,
  Smartphone,
  RefreshCw,
  Zap
} from 'lucide-vue-next'
import Sidebar from '@/components/Sidebar.vue'
import QuickTimeEntryModal from '@/components/QuickTimeEntryModal.vue'
import ManualLogModal from '@/components/ManualLogModal.vue'
import DataExportModal from '@/components/DataExportModal.vue'
import ExtraStudyModal from '@/components/ExtraStudyModal.vue'
import MobileConnectModal from '@/components/MobileConnectModal.vue'
import DeviceAuthGate from '@/components/DeviceAuthGate.vue'
import { StorageService, useSyncState } from '@/utils/storage'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useReflectionStore } from '@/stores/useReflectionStore'

// 初始化存储
StorageService.init()

const syncState = useSyncState()
const scheduleStore = useScheduleStore()
const timeLogStore = useTimeLogStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const reflectionStore = useReflectionStore()

const showQuickTimeModal = ref(false)
const showManualLogModal = ref(false)
const showBackupModal = ref(false)
const showExtraStudyModal = ref(false)
const showMobileConnectModal = ref(false)
const mobileMenuOpen = ref(false)

let pollTimer: any = null

function reloadAllStores() {
  scheduleStore.reload()
  timeLogStore.reload()
  taskStore.reload()
  categoryStore.reload()
  reflectionStore.reload()
}

onMounted(async () => {
  // 1. 监听来自 storage 的跨端/云端数据变更通知
  window.addEventListener('pomodoro-sync-updated', () => {
    reloadAllStores()
  })

  // 2. 页面载入立即触发极速全量同步，并热重载全部 stores
  try {
    await StorageService.syncWithServer()
    reloadAllStores()
  } catch {
    reloadAllStores()
  }

  const syncRoutine = async () => {
    try {
      await StorageService.syncWithServer()
      reloadAllStores()
    } catch {}
  }

  // 3. 页面可见或聚焦时（如手机切回浏览器、屏幕唤醒、电脑激活窗口），立即执行一次秒级同步
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncRoutine()
    }
  })

  window.addEventListener('focus', () => {
    syncRoutine()
  })

  // 4. 每 8 秒轻量循环拉取云端，确保手机与电脑无论在任何网络下均保持零差异实时互通
  pollTimer = setInterval(syncRoutine, 8000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

const mobileNavItems = [
  { path: '/', label: '专注时钟', icon: Timer },
  { path: '/schedule', label: '课表与自习打卡', icon: CalendarRange },
  { path: '/tasks', label: '任务与目标统筹', icon: CheckSquare },
  { path: '/timeline', label: '时光机回顾', icon: History },
  { path: '/reports', label: '多维统计报表', icon: BarChart3 },
  { path: '/settings', label: '个人偏好设置', icon: Settings }
]
</script>
