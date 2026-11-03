<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Clock class="w-5 h-5 text-tomato-400" />
          补录专注时间记录
        </h3>
        <button @click="close" class="text-slate-400 hover:text-slate-200">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Category Selection -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1.5">专注所属分类 *</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              type="button"
              @click="selectedCategoryId = cat.id"
              class="flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left"
              :class="[
                selectedCategoryId === cat.id
                  ? 'border-tomato-500 bg-tomato-500/10 text-white shadow-sm'
                  : 'border-slate-700/70 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
              ]"
            >
              <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
              <span class="truncate">{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <!-- Task / Activity Title -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">活动 / 任务名称 *</label>
          <input
            v-model="title"
            type="text"
            required
            placeholder="例如：剑桥雅思18阅读真题精析 / Nature前沿文献阅读"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500 placeholder-slate-500"
          />
        </div>

        <!-- Date -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">日期 *</label>
            <input
              v-model="date"
              type="date"
              required
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">持续时长 (分钟) *</label>
            <input
              v-model.number="durationMinutes"
              type="number"
              min="1"
              max="720"
              required
              class="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
            />
          </div>
        </div>

        <!-- Start Time -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">开始时间点 (可选)</label>
          <input
            v-model="time"
            type="time"
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">心得体会与备注</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="例如：重点攻克了第三篇文章的段落配对题，正确率 11/13..."
            class="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500 placeholder-slate-500 resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-lg bg-tomato-500 hover:bg-tomato-600 text-white font-medium text-xs transition-colors shadow-lg shadow-tomato-500/25"
          >
            保存打卡记录
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Clock, X } from 'lucide-vue-next'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const categoryStore = useCategoryStore()
const timeLogStore = useTimeLogStore()

const selectedCategoryId = ref(categoryStore.categories[0]?.id || '')
const title = ref('')
const date = ref(dayjs().format('YYYY-MM-DD'))
const time = ref('09:30')
const durationMinutes = ref(45)
const notes = ref('')

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      date.value = dayjs().format('YYYY-MM-DD')
      time.value = dayjs().format('HH:mm')
    }
  }
)

function close() {
  emit('close')
}

function handleSubmit() {
  const cat = categoryStore.getCategoryById(selectedCategoryId.value) || categoryStore.categories[0]
  const [h, m] = time.value.split(':').map(Number)
  const startTime = dayjs(date.value).hour(h || 9).minute(m || 0).second(0)
  const endTime = startTime.add(durationMinutes.value, 'minute')

  timeLogStore.addLog({
    taskTitle: title.value,
    categoryId: cat.id,
    categoryName: cat.name,
    categoryColor: cat.color,
    categoryIcon: cat.icon,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationMinutes: durationMinutes.value,
    mode: 'manual',
    notes: notes.value
  })

  title.value = ''
  notes.value = ''
  close()
}
</script>
