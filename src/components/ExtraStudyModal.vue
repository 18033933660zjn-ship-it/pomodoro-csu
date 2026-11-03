<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-amber-400" />
          <span>项目额外多学打卡 (空闲自主加餐)</span>
        </h3>
        <button @click="close" class="text-slate-400 hover:text-slate-200">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Target Project Selection -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">选择加练攻坚的项目 *</label>
          <div class="space-y-2">
            <button
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              type="button"
              @click="selectedCategoryId = cat.id"
              class="w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left"
              :class="[
                selectedCategoryId === cat.id
                  ? 'border-amber-500 bg-amber-500/10 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
              ]"
            >
              <div class="flex items-center gap-2.5">
                <span class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: cat.color }"></span>
                <span class="font-bold truncate">{{ cat.name }}</span>
              </div>
              <span class="text-[10px] text-amber-400 font-mono shrink-0">点击选择</span>
            </button>
          </div>
        </div>

        <!-- Task / Sub-topic -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">额外多学内容与成果 *</label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="例如：利用午休额外刷了一套雅思阅读 / 晚间自学运动生物力学公式推导"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />
        </div>

        <!-- Duration Quick Presets -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">加学时长 (分钟) *</label>
          <div class="grid grid-cols-4 gap-2 mb-2">
            <button
              v-for="d in [30, 45, 60, 90]"
              :key="d"
              type="button"
              @click="durationMinutes = d"
              class="py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all"
              :class="[
                durationMinutes === d
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
              ]"
            >
              {{ d }}m
            </button>
          </div>

          <input
            v-model.number="durationMinutes"
            type="number"
            min="10"
            max="360"
            required
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">心得反思与笔记</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="总结本次空闲加练的收获与突破点..."
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 placeholder-slate-500 resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-800">
          <!-- Direct launch into timer -->
          <button
            type="button"
            @click="handleLaunchTimer"
            class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Play class="w-3.5 h-3.5 fill-current" />
            <span>直连时钟开练</span>
          </button>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="close"
              class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Check class="w-4 h-4" />
              <span>保存额外打卡</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, X, Check, Play } from 'lucide-vue-next'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { usePomodoroStore } from '@/stores/usePomodoroStore'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const categoryStore = useCategoryStore()
const scheduleStore = useScheduleStore()
const pomodoroStore = usePomodoroStore()

const selectedCategoryId = ref(categoryStore.categories[0]?.id || '')
const title = ref('')
const durationMinutes = ref(45)
const notes = ref('')

function close() {
  emit('close')
}

function handleSubmit() {
  if (!title.value.trim()) return
  scheduleStore.addExtraStudySession({
    categoryId: selectedCategoryId.value,
    title: title.value,
    durationMinutes: durationMinutes.value,
    notes: notes.value
  })

  alert(`🎉 额外多学打卡成功！已为你记入 ${durationMinutes.value} 分钟有效工时，将在本周自动化复盘中获得重点表扬！`)
  title.value = ''
  notes.value = ''
  close()
}

function handleLaunchTimer() {
  pomodoroStore.setTargetDuration(
    durationMinutes.value,
    selectedCategoryId.value,
    `[额外加练] ${title.value || '空闲自主攻坚'}`
  )
  close()
  router.push('/')
}
</script>
