<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
    <div>
      <h2 class="text-2xl font-bold text-slate-100 tracking-tight">个人偏好与专注设置</h2>
      <p class="text-xs text-slate-400 mt-0.5">调优番茄钟计时周期、提示音效与环境音氛围</p>
    </div>

    <!-- Timer Duration Configurations -->
    <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-6">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <Timer class="w-4 h-4 text-tomato-400" />
        番茄钟工作与休息时长设定
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <!-- Pomodoro Duration -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">专注时长 (分钟)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="pomodoroStore.settings.pomodoroMinutes"
              type="number"
              min="5"
              max="120"
              step="5"
              @change="saveSettings"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-tomato-500"
            />
          </div>
          <span class="text-[11px] text-slate-500 mt-1 block">推荐文献/雅思深学设为 25 或 50 分钟</span>
        </div>

        <!-- Short Break -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">短休息时长 (分钟)</label>
          <input
            v-model.number="pomodoroStore.settings.shortBreakMinutes"
            type="number"
            min="1"
            max="30"
            @change="saveSettings"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-tomato-500"
          />
          <span class="text-[11px] text-slate-500 mt-1 block">推荐 5 分钟，远眺放松</span>
        </div>

        <!-- Long Break -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">长休息时长 (分钟)</label>
          <input
            v-model.number="pomodoroStore.settings.longBreakMinutes"
            type="number"
            min="5"
            max="60"
            @change="saveSettings"
            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-tomato-500"
          />
          <span class="text-[11px] text-slate-500 mt-1 block">每完成 4 个番茄周期后触发</span>
        </div>
      </div>
    </div>

    <!-- Sound & Ambient Configurations -->
    <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-6">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <Volume2 class="w-4 h-4 text-emerald-400" />
        提示音效与音量调控
      </h3>

      <div class="space-y-4">
        <!-- Enable Sound -->
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-medium text-slate-200">专注结束提示音 (清脆钟声)</div>
            <div class="text-[11px] text-slate-500">周期完成时以 Zen Bell 和弦提示</div>
          </div>
          <input
            v-model="pomodoroStore.settings.soundEnabled"
            type="checkbox"
            @change="saveSettings"
            class="w-4 h-4 rounded text-tomato-500 focus:ring-0 cursor-pointer"
          />
        </div>

        <!-- Volume Slider -->
        <div>
          <div class="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span>音量大小</span>
            <span class="font-mono text-slate-400">{{ Math.round(pomodoroStore.settings.soundVolume * 100) }}%</span>
          </div>
          <input
            v-model.number="pomodoroStore.settings.soundVolume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            @change="saveSettings"
            class="w-full accent-tomato-500 cursor-pointer"
          />
        </div>

        <!-- Test Sound -->
        <div>
          <button
            @click="testSound"
            class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
          >
            试听完成提示钟声
          </button>
        </div>
      </div>
    </div>

    <!-- Storage Statistics Card -->
    <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <HardDrive class="w-4 h-4 text-blue-400" />
        数据健康与本地缓存状态
      </h3>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <div class="text-xs text-slate-500">累计专注条目</div>
          <div class="text-lg font-bold font-mono text-slate-200 mt-0.5">{{ timeLogStore.timeLogs.length }}</div>
        </div>
        <div class="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <div class="text-xs text-slate-500">核心目标分类</div>
          <div class="text-lg font-bold font-mono text-slate-200 mt-0.5">{{ categoryStore.categories.length }}</div>
        </div>
        <div class="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
          <div class="text-xs text-slate-500">规划待办总数</div>
          <div class="text-lg font-bold font-mono text-slate-200 mt-0.5">{{ taskStore.tasks.length }}</div>
        </div>
      </div>
    </div>

    <!-- Reset to Day 1 Clean Slate Card -->
    <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-amber-400" />
            开启新学期真实实战（从第 1 天干干净净起步）
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            一键清空系统预置的 30 天模拟测试数据，保留您的完整课表与自习节点，从今日开启真实打卡
          </p>
        </div>
        <button
          @click="resetToCleanDay1"
          class="px-4 py-2 rounded-xl bg-tomato-500/15 hover:bg-tomato-500 text-tomato-400 hover:text-white border border-tomato-500/30 text-xs font-semibold transition-all shrink-0"
        >
          一键清空模拟数据 (开启真实Day 1)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Timer, Volume2, HardDrive, Sparkles } from 'lucide-vue-next'
import { usePomodoroStore } from '@/stores/usePomodoroStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { StorageService } from '@/utils/storage'
import { soundManager } from '@/utils/sound'

const pomodoroStore = usePomodoroStore()
const timeLogStore = useTimeLogStore()
const categoryStore = useCategoryStore()
const taskStore = useTaskStore()
const scheduleStore = useScheduleStore()

function saveSettings() {
  pomodoroStore.updateSettings(pomodoroStore.settings)
}

function testSound() {
  soundManager.playCompletionBell(pomodoroStore.settings.soundVolume)
}

function resetToCleanDay1() {
  if (confirm('确定要清空测试演示数据，开启真实第 1 天实战打卡吗？课表与任务设置将完整保留！')) {
    StorageService.clearAllData()
    timeLogStore.reload()
    scheduleStore.reload()
    alert('🎉 已成功清空模拟数据！系统已正式重置为【真实第 1 天起步】！祝新学期自律精进！')
  }
}
</script>
