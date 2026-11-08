<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-100 tracking-tight">目标与任务统筹</h2>
        <p class="text-xs text-slate-400 mt-0.5">自主规划日常作业、学术研习与训练配额，支持自定义时长与一键学时入账</p>
      </div>

      <div class="flex items-center gap-2.5 flex-wrap">
        <button
          @click="showExtraStudyModal = true"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition-all shadow-sm"
        >
          <Sparkles class="w-4 h-4 fill-current" />
          <span>额外多学打卡</span>
        </button>
        <button
          @click="showAddCategoryModal = true"
          class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 text-xs font-medium transition-all"
        >
          <FolderPlus class="w-4 h-4 text-indigo-400" />
          新建目标分类
        </button>
        <button
          @click="showAddTaskModal = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-tomato-500 hover:bg-tomato-600 text-white text-xs font-semibold shadow-lg shadow-tomato-500/25 transition-all"
        >
          <Plus class="w-4 h-4" />
          新建任务 / 作业
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
                日标: {{ (cat.dailyTargetMinutes / 60).toFixed(1) }}h
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
              <span>多学加餐</span>
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
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <ListTodo class="w-4 h-4 text-emerald-400" />
          待办清单与学术/作业计划 ({{ activeTasksFiltered.length }} 项进行中)
        </h3>
        <!-- Filter Tabs -->
        <div class="flex gap-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60 flex-wrap">
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
            {{ cat.name.split(':')[0] || cat.name }}
          </button>
        </div>
      </div>

      <!-- Task Items -->
      <div v-if="activeTasksFiltered.length === 0" class="p-8 text-center bg-slate-800/20 rounded-2xl border border-slate-700/40 text-slate-400 text-xs space-y-2">
        <p>当前分类下暂无进行中的待办任务</p>
        <button
          @click="showAddTaskModal = true"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tomato-500/20 hover:bg-tomato-500/30 text-tomato-300 text-xs font-medium border border-tomato-500/30 transition-all"
        >
          <Plus class="w-3.5 h-3.5" />
          立即创建自主任务/作业
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="task in activeTasksFiltered"
          :key="task.id"
          class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
        >
          <div class="flex items-start gap-3.5 min-w-0 flex-1">
            <!-- Checkbox (Quick Complete Trigger) -->
            <button
              @click="handleToggleTask(task)"
              title="点击记完成并存入学时"
              class="w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-all shrink-0 border-slate-600 hover:border-emerald-500 bg-slate-900/50 hover:bg-emerald-500/20 text-emerald-400"
            >
              <Check class="w-3.5 h-3.5 opacity-0 hover:opacity-100" />
            </button>

            <!-- Details -->
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm text-slate-100">
                  {{ task.title }}
                </span>
                <!-- Category Tag -->
                <span
                  v-if="getCategory(task.categoryId)"
                  class="text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0"
                  :style="{
                    backgroundColor: `${getCategory(task.categoryId)?.color}20`,
                    color: getCategory(task.categoryId)?.color
                  }"
                >
                  {{ getCategory(task.categoryId)?.name }}
                </span>
                <!-- Due Date Tag -->
                <span
                  v-if="task.dueDate"
                  class="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0 font-mono"
                >
                  <Calendar class="w-3 h-3" />
                  截止: {{ task.dueDate }}
                </span>
              </div>

              <!-- Task Notes / Content Requirements -->
              <div
                v-if="task.notes"
                class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/40 text-xs text-slate-300 leading-relaxed whitespace-pre-line"
              >
                {{ task.notes }}
              </div>

              <!-- Metrics -->
              <div class="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span class="flex items-center gap-1 font-mono text-[11px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  <Clock class="w-3 h-3" />
                  计划 {{ task.targetMinutes || (task.estimatedPomodoros * 25) }} 分钟
                </span>
                <span class="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                  🍅 预估 {{ task.estimatedPomodoros || Math.round((task.targetMinutes || 45) / 25) }} 个番茄
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <!-- Start Focus Timer -->
            <button
              @click="startTaskTimer(task)"
              title="载入此任务及自定义时长，立即开始专注"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tomato-500/20 hover:bg-tomato-500 text-tomato-300 hover:text-white border border-tomato-500/40 text-xs font-semibold transition-all shadow-sm"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span>开始专注</span>
            </button>

            <!-- Complete & Log Directly -->
            <button
              @click="openCompleteModal(task)"
              title="线下/自习已完成，直接记入实际学时流水"
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>记完成</span>
            </button>

            <!-- Delete -->
            <button
              @click="taskStore.deleteTask(task.id)"
              title="删除任务"
              class="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-750 transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Completed Tasks Section (Collapsible) -->
    <div v-if="completedTasksFiltered.length > 0" class="space-y-3 pt-2">
      <button
        @click="showCompletedList = !showCompletedList"
        class="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <CheckCheck class="w-4 h-4 text-emerald-400" />
        <span>已完成归档 ({{ completedTasksFiltered.length }} 项)</span>
        <ChevronDown v-if="!showCompletedList" class="w-3.5 h-3.5" />
        <ChevronUp v-else class="w-3.5 h-3.5" />
      </button>

      <div v-if="showCompletedList" class="space-y-2">
        <div
          v-for="task in completedTasksFiltered"
          :key="task.id"
          class="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs opacity-75 hover:opacity-100 transition-opacity"
        >
          <div class="flex items-center gap-3 min-w-0">
            <button
              @click="taskStore.toggleTask(task.id)"
              title="重新激活为待办"
              class="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0"
            >
              <Check class="w-3 h-3" />
            </button>
            <div class="min-w-0 space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="line-through text-slate-400 font-medium truncate">{{ task.title }}</span>
                <span
                  v-if="getCategory(task.categoryId)"
                  class="text-[10px] px-1.5 py-0.2 rounded font-mono"
                  :style="{ color: getCategory(task.categoryId)?.color }"
                >
                  {{ getCategory(task.categoryId)?.name }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-[11px] text-slate-500">
                <span class="text-emerald-400 font-mono">
                  实学 {{ task.actualMinutes || task.targetMinutes || 45 }} 分钟
                </span>
                <span v-if="task.completedAt" class="font-mono">
                  完成于 {{ formatTime(task.completedAt) }}
                </span>
              </div>
            </div>
          </div>

          <button
            @click="taskStore.deleteTask(task.id)"
            title="删除归档记录"
            class="p-1 rounded text-slate-600 hover:text-red-400 transition-colors"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-100">创建新任务 / 作业</h3>
            <p class="text-xs text-slate-400 mt-0.5">自定义任务要求与研习时长，支持稍后专注或直接入账</p>
          </div>
          <button
            @click="showAddTaskModal = false"
            class="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleCreateTask(false)" class="space-y-4">
          <!-- Category -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">所属目标分类 *</label>
            <select
              v-model="newTaskCategoryId"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-tomato-500 transition-colors"
            >
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Task Title -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">任务 / 作业名称 *</label>
            <input
              v-model="newTaskTitle"
              type="text"
              required
              placeholder="例如：运动生物力学第三周作业 / 论文立论部分引言精修"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-tomato-500 transition-colors"
            />
          </div>

          <!-- Task Content & Requirements (Textarea) -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">任务内容与作业要求 (详细备忘)</label>
            <textarea
              v-model="newTaskNotes"
              rows="3"
              placeholder="记录具体题目要求、论文大纲要点、文献重点关注点或作业交付标准..."
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-tomato-500 transition-colors resize-none leading-relaxed"
            ></textarea>
          </div>

          <!-- Target Duration (Minutes) & Quick Chips -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-slate-300">学习 / 研习时长 (分钟) *</label>
              <span class="text-xs text-cyan-400 font-mono">
                约 {{ Math.max(1, Math.round(newTaskDurationMinutes / 25)) }} 个番茄钟
              </span>
            </div>

            <div class="flex items-center gap-2">
              <input
                v-model.number="newTaskDurationMinutes"
                type="number"
                min="5"
                max="360"
                step="5"
                required
                class="w-28 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-tomato-500"
              />
              <span class="text-xs text-slate-400">分钟</span>

              <!-- Quick Duration Chips -->
              <div class="flex items-center gap-1.5 flex-wrap ml-auto">
                <button
                  type="button"
                  v-for="min in [25, 45, 60, 90, 120]"
                  :key="min"
                  @click="newTaskDurationMinutes = min"
                  class="px-2 py-1 rounded-lg text-xs font-mono transition-colors"
                  :class="newTaskDurationMinutes === min ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'"
                >
                  {{ min }}m
                </button>
              </div>
            </div>
          </div>

          <!-- Due Date (Optional) -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">要求截止完成时间 (可选)</label>
            <input
              v-model="newTaskDueDate"
              type="date"
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-tomato-500"
            />
          </div>

          <!-- Modal Action Buttons: Dual Paths -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showAddTaskModal = false"
              class="text-xs text-slate-400 hover:text-slate-200 order-3 sm:order-1"
            >
              取消
            </button>

            <div class="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
              <!-- Path A: Save as pending -->
              <button
                type="submit"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                加入待办清单
              </button>

              <!-- Path B: Direct Complete & Log -->
              <button
                type="button"
                @click="handleCreateTask(true)"
                class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>线下已完成，直接记学时</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Complete Task Modal (记完成确认弹窗) -->
    <div v-if="showCompleteTaskModal && selectedTaskToComplete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 class="w-5 h-5 text-emerald-400" />
            完成任务并记入学时
          </h3>
          <button
            @click="showCompleteTaskModal = false"
            class="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <div class="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div class="text-xs text-slate-400 mb-0.5">任务名称</div>
          <div class="text-sm font-semibold text-slate-100">{{ selectedTaskToComplete.title }}</div>
          <div v-if="selectedTaskToComplete.notes" class="text-xs text-slate-400 mt-1 whitespace-pre-line">
            {{ selectedTaskToComplete.notes }}
          </div>
        </div>

        <form @submit.prevent="handleConfirmComplete" class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-slate-300">实际投入研习时长 (分钟) *</label>
              <span class="text-xs text-emerald-400 font-mono">计入今日学时流水</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                v-model.number="completeActualMinutes"
                type="number"
                min="5"
                max="360"
                step="5"
                required
                class="w-28 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
              <span class="text-xs text-slate-400">分钟</span>

              <div class="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  v-for="min in [25, 45, 60, 90]"
                  :key="min"
                  @click="completeActualMinutes = min"
                  class="px-2 py-1 rounded-lg text-xs font-mono transition-colors"
                  :class="completeActualMinutes === min ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'"
                >
                  {{ min }}m
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">完成心得 / 作业备忘 (可选)</label>
            <input
              v-model="completeNotes"
              type="text"
              placeholder="例如：已完成3篇前言对比，提取核心关键词..."
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              @click="showCompleteTaskModal = false"
              class="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            >
              <Check class="w-4 h-4" />
              <span>确认记入学时并归档</span>
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
import confetti from 'canvas-confetti'
import { soundManager } from '@/utils/sound'
import {
  FolderPlus,
  Plus,
  Target,
  ListTodo,
  Check,
  Play,
  Trash2,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  CheckCheck,
  ChevronDown,
  ChevronUp
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
const showCompletedList = ref(false)

const selectedCategoryFilter = ref<string>('all')

// Add Task Form States
const showAddTaskModal = ref(false)
const newTaskTitle = ref('')
const newTaskCategoryId = ref(categoryStore.categories[0]?.id || '')
const newTaskDurationMinutes = ref(45)
const newTaskNotes = ref('')
const newTaskDueDate = ref('')

// Complete Task Confirmation Form States
const showCompleteTaskModal = ref(false)
const selectedTaskToComplete = ref<Task | null>(null)
const completeActualMinutes = ref(45)
const completeNotes = ref('')

// Add Category Form States
const showAddCategoryModal = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#3b82f6')
const newCategoryDailyTarget = ref(90)
const newCategoryWeeklyTarget = ref(600)
const newCategoryDesc = ref('')

// Filtered Active Tasks
const activeTasksFiltered = computed(() => {
  const active = taskStore.activeTasks
  if (selectedCategoryFilter.value === 'all') {
    return active
  }
  return active.filter(t => t.categoryId === selectedCategoryFilter.value)
})

// Filtered Completed Tasks
const completedTasksFiltered = computed(() => {
  const completed = taskStore.completedTasks
  if (selectedCategoryFilter.value === 'all') {
    return completed
  }
  return completed.filter(t => t.categoryId === selectedCategoryFilter.value)
})

function getCategory(catId: string) {
  return categoryStore.getCategoryById(catId)
}

function formatTime(iso: string) {
  return dayjs(iso).format('MM-DD HH:mm')
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

// 载入专注时钟：精准预设自定义时长与任务标题
function startTaskTimer(task: Task) {
  const duration = task.targetMinutes || (task.estimatedPomodoros ? task.estimatedPomodoros * 25 : 45)
  pomodoroStore.setTargetDuration(duration, task.categoryId, task.title)
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

// 创建任务：支持加入待办 vs 线下已完成直接记学时
function handleCreateTask(directComplete: boolean = false) {
  if (!newTaskTitle.value.trim()) return
  const targetMin = Number(newTaskDurationMinutes.value) || 45

  const newTask = taskStore.addTask({
    title: newTaskTitle.value.trim(),
    categoryId: newTaskCategoryId.value || categoryStore.categories[0]?.id,
    targetMinutes: targetMin,
    estimatedPomodoros: Math.max(1, Math.round(targetMin / 25)),
    notes: newTaskNotes.value.trim(),
    dueDate: newTaskDueDate.value
  })

  if (directComplete) {
    const cat = categoryStore.getCategoryById(newTask.categoryId) || categoryStore.categories[0]
    const now = new Date()
    const startTime = new Date(now.getTime() - targetMin * 60000)

    timeLogStore.addLog({
      taskId: newTask.id,
      taskTitle: newTask.title,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
      durationMinutes: targetMin,
      mode: 'manual',
      notes: newTaskNotes.value.trim() || '线下/课堂完成自主任务，直接记入学时流水'
    })

    taskStore.completeTaskWithLog({
      taskId: newTask.id,
      actualMinutes: targetMin,
      notes: newTaskNotes.value.trim()
    })

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      })
    } catch {}

    soundManager.playCompletionBell(1)
  }

  // 重置表单
  newTaskTitle.value = ''
  newTaskNotes.value = ''
  newTaskDueDate.value = ''
  newTaskDurationMinutes.value = 45
  showAddTaskModal.value = false
}

// 点击卡片上的记完成
function openCompleteModal(task: Task) {
  selectedTaskToComplete.value = task
  completeActualMinutes.value = task.targetMinutes || (task.estimatedPomodoros ? task.estimatedPomodoros * 25 : 45)
  completeNotes.value = task.notes || ''
  showCompleteTaskModal.value = true
}

// 复选框交互：未完成则弹出确认记学时，已完成则撤回
function handleToggleTask(task: Task) {
  if (!task.completed) {
    openCompleteModal(task)
  } else {
    taskStore.toggleTask(task.id)
  }
}

// 确认完成并写入学时日志
function handleConfirmComplete() {
  if (!selectedTaskToComplete.value) return
  const task = selectedTaskToComplete.value
  const duration = Number(completeActualMinutes.value) || 45
  const cat = categoryStore.getCategoryById(task.categoryId) || categoryStore.categories[0]

  const now = new Date()
  const startTime = new Date(now.getTime() - duration * 60000)

  timeLogStore.addLog({
    taskId: task.id,
    taskTitle: task.title,
    categoryId: cat.id,
    categoryName: cat.name,
    categoryColor: cat.color,
    categoryIcon: cat.icon,
    startTime: startTime.toISOString(),
    endTime: now.toISOString(),
    durationMinutes: duration,
    mode: 'manual',
    notes: completeNotes.value || task.notes || '任务达成，记入学时'
  })

  taskStore.completeTaskWithLog({
    taskId: task.id,
    actualMinutes: duration,
    notes: completeNotes.value
  })

  try {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 }
    })
  } catch {}

  soundManager.playCompletionBell(1)

  showCompleteTaskModal.value = false
  selectedTaskToComplete.value = null
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
