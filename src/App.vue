<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
    <!-- Desktop Sidebar -->
    <Sidebar
      class="hidden md:flex"
      @open-manual-log="showManualLogModal = true"
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
  Smartphone
} from 'lucide-vue-next'
import Sidebar from '@/components/Sidebar.vue'
import ManualLogModal from '@/components/ManualLogModal.vue'
import DataExportModal from '@/components/DataExportModal.vue'
import ExtraStudyModal from '@/components/ExtraStudyModal.vue'
import MobileConnectModal from '@/components/MobileConnectModal.vue'
import DeviceAuthGate from '@/components/DeviceAuthGate.vue'
import { StorageService } from '@/utils/storage'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'

// 初始化存储
StorageService.init()

const scheduleStore = useScheduleStore()
const timeLogStore = useTimeLogStore()

const showManualLogModal = ref(false)
const showBackupModal = ref(false)
const showExtraStudyModal = ref(false)
const showMobileConnectModal = ref(false)
const mobileMenuOpen = ref(false)

let pollTimer: any = null

onMounted(() => {
  const syncAndReload = async () => {
    const updated = await StorageService.syncWithServer()
    if (updated) {
      scheduleStore.reload()
      timeLogStore.reload()
    }
  }

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      syncAndReload()
    }
  })

  // 每15秒后台轻量同步，实现手机打卡与电脑端无感一致
  pollTimer = setInterval(syncAndReload, 15000)
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
