<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap class="w-5 h-5 text-amber-400" />
            <span>填报实际学习时间 (免等倒计时)</span>
          </h3>
          <p class="text-[11px] text-slate-400 mt-0.5">
            真实自习结束随时填入，立即算入今日专注进度并自动同步
          </p>
        </div>
        <button @click="close" class="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Form Body -->
      <form @submit.prevent="handleSubmit" class="p-5 sm:p-6 space-y-4 overflow-y-auto">
        <!-- Target Project Selection -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>关联攻坚任务 *</span>
            <span class="text-[11px] font-normal text-slate-400">选择当前完成的科目</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              type="button"
              @click="handleSelectCategory(cat)"
              class="flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left"
              :class="[
                selectedCategoryId === cat.id
                  ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm ring-1 ring-amber-500/30'
                  : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
              ]"
            >
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></span>
              <span class="truncate font-medium">{{ cat.name.split(':')[0] }}</span>
            </button>
          </div>
        </div>

        <!-- Task / Topic Title -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            学习具体内容 / 标题 *
          </label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="例如：任务2 (习概双创 90m) / 剑雅18阅读精读"
            class="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />
        </div>

        <!-- Duration Quick Chips & Custom Input -->
        <div class="bg-slate-800/40 border border-slate-700/60 p-3.5 rounded-xl space-y-2.5">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-amber-400" />
              <span>实际学习时长 (分钟) *</span>
            </label>
            <span class="text-xs font-mono font-bold text-amber-400">
              {{ formatHoursMinutes(durationMinutes) }}
            </span>
          </div>

          <!-- Quick Chips -->
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            <button
              v-for="d in [30, 45, 60, 90, 120, 150]"
              :key="d"
              type="button"
              @click="durationMinutes = d"
              class="py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all text-center"
              :class="[
                durationMinutes === d
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm'
                  : 'border-slate-700/70 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              ]"
            >
              {{ d }}m
            </button>
          </div>

          <!-- Number input -->
          <div class="flex items-center gap-2 pt-1">
            <span class="text-xs text-slate-400 shrink-0">精确填入:</span>
            <div class="relative flex-1">
              <input
                v-model.number="durationMinutes"
                type="number"
                min="1"
                max="720"
                required
                class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500 pr-12"
              />
              <span class="absolute right-3 top-2 text-xs text-slate-500">分钟</span>
            </div>
          </div>
        </div>

        <!-- Notes (Optional) -->
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">心得体会与备注 (可选)</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="写下专注收获或进度，便于后续复盘..."
            class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 placeholder-slate-500 resize-none"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
          <button
            type="submit"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Check class="w-4 h-4 stroke-[3]" />
            <span>确认填入今日专注 ({{ durationMinutes }}分钟)</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Zap, Clock, X, Check } from 'lucide-vue-next'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { usePomodoroStore } from '@/stores/usePomodoroStore'
import type { Category } from '@/types'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    initialMinutes?: number
    initialCategoryId?: string
    initialTaskTitle?: string
    initialNotes?: string
  }>(),
  {
    initialMinutes: 90,
    initialCategoryId: '',
    initialTaskTitle: '',
    initialNotes: ''
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', payload: { minutes: number; taskTitle: string }): void
}>()

const categoryStore = useCategoryStore()
const pomodoroStore = usePomodoroStore()

const selectedCategoryId = ref<string>('')
const title = ref<string>('')
const durationMinutes = ref<number>(90)
const notes = ref<string>('')

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      selectedCategoryId.value = props.initialCategoryId || categoryStore.categories[0]?.id || ''
      durationMinutes.value = props.initialMinutes || 90
      title.value = props.initialTaskTitle || ''
      notes.value = props.initialNotes || ''

      if (!title.value && selectedCategoryId.value) {
        const cat = categoryStore.getCategoryById(selectedCategoryId.value)
        if (cat) title.value = `${cat.name} 攻坚专注`
      }
    }
  },
  { immediate: true }
)

function handleSelectCategory(cat: Category) {
  selectedCategoryId.value = cat.id
  if (!title.value || title.value.endsWith('攻坚专注')) {
    title.value = `${cat.name} 攻坚专注`
  }
}

function formatHoursMinutes(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}小时 ${m}分钟`
  if (h > 0) return `${h}小时整`
  return `${m}分钟`
}

function close() {
  emit('close')
}

function handleSubmit() {
  if (!durationMinutes.value || durationMinutes.value <= 0) return

  const cat = categoryStore.getCategoryById(selectedCategoryId.value) || categoryStore.categories[0]

  pomodoroStore.quickLogDirect({
    durationMinutes: durationMinutes.value,
    categoryId: selectedCategoryId.value,
    taskTitle: title.value.trim() || `${cat?.name || '任务'} 攻坚专注`,
    notes: notes.value.trim() || '自习实际专注完成，手动快捷填入'
  })

  emit('saved', {
    minutes: durationMinutes.value,
    taskTitle: title.value.trim()
  })

  close()
}
</script>
