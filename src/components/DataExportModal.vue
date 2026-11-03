<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Database class="w-5 h-5 text-indigo-400" />
          数据备份与恢复中心
        </h3>
        <button @click="close" class="text-slate-400 hover:text-slate-200">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Export Section -->
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-1.5">
            <Download class="w-4 h-4 text-emerald-400" />
            导出完整数据备份 (JSON)
          </h4>
          <p class="text-xs text-slate-400 mb-3">
            包含你所有的分类、目标配额、专注历史时间日志与复盘日记。完全属于你的本地文件。
          </p>
          <button
            @click="handleExport"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all"
          >
            <Download class="w-3.5 h-3.5" />
            立即下载数据备份文件
          </button>
        </div>

        <!-- Import Section -->
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-1.5">
            <Upload class="w-4 h-4 text-blue-400" />
            导入与恢复数据备份
          </h4>
          <p class="text-xs text-slate-400 mb-3">
            选择你之前导出的 .json 备份文件进行全量无损恢复。
          </p>
          <input
            type="file"
            ref="fileInputRef"
            accept=".json"
            class="hidden"
            @change="handleFileSelected"
          />
          <button
            @click="triggerFileInput"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all"
          >
            <Upload class="w-3.5 h-3.5" />
            选择本地备份文件导入
          </button>
        </div>

        <!-- Reset / Demo Section -->
        <div class="p-4 rounded-xl bg-slate-800/20 border border-slate-700/40 flex items-center justify-between">
          <div>
            <h4 class="text-xs font-semibold text-slate-300">重置为高质示例数据 (包含文献/雅思/健身记录)</h4>
            <p class="text-[11px] text-slate-500">重新加载过去90天完整的四维多模态模拟打卡数据</p>
          </div>
          <button
            @click="handleResetDemo"
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
          >
            重置示例
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-slate-800 flex justify-end">
        <button
          @click="close"
          class="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Database, Download, Upload, X } from 'lucide-vue-next'
import { StorageService } from '@/utils/storage'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { useReflectionStore } from '@/stores/useReflectionStore'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const categoryStore = useCategoryStore()
const taskStore = useTaskStore()
const timeLogStore = useTimeLogStore()
const reflectionStore = useReflectionStore()

const fileInputRef = ref<HTMLInputElement | null>(null)

function close() {
  emit('close')
}

function handleExport() {
  const data = StorageService.exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pomodoro-todo-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const parsed = JSON.parse(content)
      const success = StorageService.importData(parsed)
      if (success) {
        categoryStore.reload()
        taskStore.reload()
        timeLogStore.reload()
        reflectionStore.reload()
        alert('数据导入并恢复成功！')
        close()
      } else {
        alert('导入失败，请检查文件格式是否有效。')
      }
    } catch {
      alert('解析备份文件出错，请确保是有效的 JSON 文件。')
    }
  }
  reader.readAsText(file)
}

function handleResetDemo() {
  if (confirm('确定要重置回默认的90天示例数据吗？（覆盖当前记录）')) {
    StorageService.resetToDemo()
    categoryStore.reload()
    taskStore.reload()
    timeLogStore.reload()
    reflectionStore.reload()
    alert('已成功重置为标准示例数据！')
    close()
  }
}
</script>
