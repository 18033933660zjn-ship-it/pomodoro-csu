<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-100 tracking-tight">目标与任务统筹</h2>
        <p class="text-xs text-slate-400 mt-0.5">规划每周文献、雅思备考与体能训练配额，实时掌控进度</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="showExtraStudyModal = true"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition-all shadow-sm"
        >
          <Sparkles class="w-4 h-4 fill-current" />
          <span>额外多学打卡</span>
        </button>
        <button
          @click="showAddCategoryModal = true"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all"
        >
          <FolderPlus class="w-4 h-4 text-indigo-400" />
          新建目标分类
        </button>
        <button
          @click="showAddTaskModal = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-tomato-500 hover:bg-tomato-600 text-white text-xs font-semibold shadow-lg shadow-tomato-500/25 transition-all"
        >
          <Plus class="w-4 h-4" />
          创建新待办
        </button>
      </div>
    </div>

    <!-- Category Budget Cards (本周配额进度) -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Target class="w-4 h-4 text-tomato-400" />
          核心领域本周目标统筹进度 (Weekly Budget)
        </h3>
        <span class="text-xs text-slate-500 font-mono">每周一 00:00 自动刷新周期</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600/80 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span
                  class="w-3 h-3 rounded-full shadow-sm"
                  :style="{ backgroundColor: cat.color }"
                ></span>
                <span class="font-bold text-sm text-slate-100">{{ cat.name }}</span>
              </div>
              <span class="text-[11px] px-2 py-0.5 rounded bg-slate-700/50 text-slate-300 font-mono">
                日标: {{ cat.dailyTargetMinutes / 60 }}h
              </span>
            </div>

            <p class="text-xs text-slate-400 mt-2 line-clamp-1">
              {{ cat.description || '保持自律与持续投入' }}
            </p>
          </div>

          <!-- Progress -->
          <div class="mt-4 pt-3 border-t border-slate-700/40">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="text-slate-400">本周已投入:</span>
              <span class="font-bold text-slate-200 font-mono">
                {{ (getCategoryWeekMinutes(cat.id) / 60).toFixed(1) }}h / {{ (cat.weeklyTargetMinutes / 60).toFixed(1) }}h
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min(100, (getCategoryWeekMinutes(cat.id) / cat.weeklyTargetMinutes) * 100)}%`,
                  backgroundColor: cat.color
                }"
              ></div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
              <span>完成度</span>
              <span class="font-semibold text-slate-300">
                {{ Math.round((getCategoryWeekMinutes(cat.id) / cat.weeklyTargetMinutes) * 100) }}%
              </span>
            </div>
          </div>

          <!-- Extra Study & Direct Immersion Action Row -->
          <div class="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between gap-2">
            <button
              @click="openExtraStudyForCat(cat.id)"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold text-xs border border-amber-500/30 transition-all"
              title="空闲时间多学加餐打卡"
            >
              <Sparkles class="w-3.5 h-3.5 fill-current" />
              <span>额外多学打卡</span>
            </button>
            <button
              @click="startImmersionForCat(cat)"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              title="番茄钟设定为此任务总时长，纯沉浸无中途休息"
            >
              <Play class="w-3 h-3 fill-current text-tomato-400" />
              <span>纯沉浸 ({{ cat.dailyTargetMinutes }}m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Tasks List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <ListTodo class="w-4 h-4 text-emerald-400" />
          待办清单与学术/训练计划 ({{ taskStore.activeTasks.length }} 项进行中)
        </h3>
        <!-- Filter Tabs -->
        <div class="flex gap-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60">
          <button
            @click="selectedCategoryFilter = 'all'"
            class="px-2.5 py-1 rounded text-xs transition-colors"
            :class="selectedCategoryFilter === 'all' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'"
          >
            全部
          </button>
          <button
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            @click="selectedCategoryFilter = cat.id"
            class="px-2.5 py-1 rounded text-xs transition-colors"
            :class="selectedCategoryFilter === cat.id ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Task Items -->
      <div v-if="filteredTasks.length === 0" class="p-8 text-center bg-slate-800/20 rounded-2xl border border-slate-700/40 text-slate-500 text-xs">
        当前分类下暂无待办任务，点击上方按钮创建新任务吧！
      </div>

      <div v-else class="space-y-2.5">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all flex items-center justify-between gap-4 group"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            <!-- Checkbox -->
            <button
              @click="taskStore.toggleTask(task.id)"
              class="w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0"
              :class="[
                task.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-600 hover:border-tomato-500 bg-slate-900/50'
              ]"
            >
              <Check v-if="task.completed" class="w-3.5 h-3.5" />
            </button>

            <!-- Details -->
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span
                  class="font-medium text-sm text-slate-100 truncate"
                  :class="{ 'line-through text-slate-500': task.completed }"
                >
                  {{ task.title }}
                </span>
                <!-- Category Tag -->
                <span
                  v-if="getCategory(task.categoryId)"
                  class="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                  :style="{
                    backgroundColor: `${getCategory(task.categoryId)?.color}20`,
                    color: getCategory(task.categoryId)?.color
                  }"
                >
                  {{ getCategory(task.categoryId)?.name }}
                </span>
              </div>

              <div class="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span class="flex items-center gap-1 font-mono text-[11px]">
                  🍅 {{ task.completedPomodoros }} / {{ task.estimatedPomodoros }} 个番茄
                </span>
                <span v-if="task.notes" class="text-slate-500 truncate text-[11px]">
                  {{ task.notes }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="!task.completed"
              @click="startTaskTimer(task)"
              title="载入专注时钟立即开练"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tomato-500/15 hover:bg-tomato-500 text-tomato-400 hover:text-white border border-tomato-500/30 text-xs font-semibold transition-all"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span>专注</span>
            </button>

            <button
              @click="taskStore.deleteTask(task.id)"
              title="删除任务"
              class="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-750 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 class="text-base font-semibold text-slate-100 mb-4">创建新任务待办</h3>
        <form @submit.prevent="handleCreateTask" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">所属目标分类 *</label>
            <select
              v-model="newTaskCategoryId"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
            >
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">任务名称 *</label>
            <input
              v-model="newTaskTitle"
              type="text"
              required
              placeholder="例如：剑桥雅思听力真题精听 / 深度学习论文精读"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">预估番茄钟个数</label>
              <input
                v-model.number="newTaskEstimatedPomodoros"
                type="number"
                min="1"
                max="20"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">备注说明</label>
              <input
                v-model="newTaskNotes"
                type="text"
                placeholder="备考重点/复习目标"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showAddTaskModal = false"
              class="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-lg bg-tomato-500 hover:bg-tomato-600 text-white font-medium text-xs transition-colors"
            >
              创建任务
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div v-if="showAddCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 class="text-base font-semibold text-slate-100 mb-4">创建全新目标分类</h3>
        <form @submit.prevent="handleCreateCategory" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">分类名称 *</label>
            <input
              v-model="newCategoryName"
              type="text"
              required
              placeholder="例如：GRE单词 / 考研数学 / 游泳训练"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">主题标识色彩</label>
            <div class="flex items-center gap-3">
              <input
                v-model="newCategoryColor"
                type="color"
                class="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span class="text-xs text-slate-400 font-mono">{{ newCategoryColor }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">每日目标 (分钟)</label>
              <input
                v-model.number="newCategoryDailyTarget"
                type="number"
                min="10"
                step="10"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">每周目标 (分钟)</label>
              <input
                v-model.number="newCategoryWeeklyTarget"
                type="number"
                min="30"
                step="30"
                class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">分类描述</label>
            <input
              v-model="newCategoryDesc"
              type="text"
              placeholder="简要描述该分类的定位"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-tomato-500"
            />
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showAddCategoryModal = false"
              class="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-lg bg-tomato-500 hover:bg-tomato-600 text-white font-medium text-xs transition-colors"
            >
              确定添加
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Extra Study Modal -->
    <ExtraStudyModal
      :is-open="showExtraStudyModal"
      @close="showExtraStudyModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  FolderPlus,
  Plus,
  Target,
  ListTodo,
  Check,
  Play,
  Trash2,
  Sparkles
} from 'lucide-vue-next'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { usePomodoroStore } from '@/stores/usePomodoroStore'
import ExtraStudyModal from '@/components/ExtraStudyModal.vue'
import type { Task, Category } from '@/types'

const router = useRouter()
const categoryStore = useCategoryStore()
const taskStore = useTaskStore()
const timeLogStore = useTimeLogStore()
const pomodoroStore = usePomodoroStore()

const showExtraStudyModal = ref(false)

const selectedCategoryFilter = ref<string>('all')

const showAddTaskModal = ref(false)
const newTaskTitle = ref('')
const newTaskCategoryId = ref(categoryStore.categories[0]?.id || '')
const newTaskEstimatedPomodoros = ref(3)
const newTaskNotes = ref('')

const showAddCategoryModal = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#3b82f6')
const newCategoryDailyTarget = ref(90)
const newCategoryWeeklyTarget = ref(600)
const newCategoryDesc = ref('')

const filteredTasks = computed(() => {
  if (selectedCategoryFilter.value === 'all') {
    return taskStore.tasks
  }
  return taskStore.tasks.filter(t => t.categoryId === selectedCategoryFilter.value)
})

function getCategory(catId: string) {
  return categoryStore.getCategoryById(catId)
}

function getCategoryWeekMinutes(catId: string): number {
  const startOfWeek = dayjs().startOf('isoWeek')
  const endOfWeek = dayjs().endOf('isoWeek')
  return timeLogStore.timeLogs
    .filter(l => {
      const t = dayjs(l.startTime)
      return l.categoryId === catId && t.isAfter(startOfWeek) && t.isBefore(endOfWeek)
    })
    .reduce((sum, l) => sum + l.durationMinutes, 0)
}

function startTaskTimer(task: Task) {
  pomodoroStore.selectedCategoryId = task.categoryId
  pomodoroStore.selectedTaskId = task.id
  pomodoroStore.sessionNotes = task.title
  router.push('/')
}

function openExtraStudyForCat(catId: string) {
  showExtraStudyModal.value = true
}

function startImmersionForCat(cat: Category) {
  pomodoroStore.setTargetDuration(cat.dailyTargetMinutes, cat.id, `${cat.name} 纯沉浸攻坚`)
  router.push('/')
}

function handleCreateTask() {
  if (!newTaskTitle.value.trim()) return
  taskStore.addTask({
    title: newTaskTitle.value,
    categoryId: newTaskCategoryId.value,
    estimatedPomodoros: newTaskEstimatedPomodoros.value,
    notes: newTaskNotes.value
  })
  newTaskTitle.value = ''
  newTaskNotes.value = ''
  showAddTaskModal.value = false
}

function handleCreateCategory() {
  if (!newCategoryName.value.trim()) return
  categoryStore.addCategory({
    name: newCategoryName.value,
    icon: 'Folder',
    color: newCategoryColor.value,
    dimension: 'custom',
    dailyTargetMinutes: newCategoryDailyTarget.value,
    weeklyTargetMinutes: newCategoryWeeklyTarget.value,
    description: newCategoryDesc.value
  })
  newCategoryName.value = ''
  newCategoryDesc.value = ''
  showAddCategoryModal.value = false
}
</script>
