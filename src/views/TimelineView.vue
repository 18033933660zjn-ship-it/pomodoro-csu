<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <span>时光机时间流</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            共 {{ timeLogStore.timeLogs.length }} 条专注足迹
          </span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">随时回溯任意一天的具体日程安排与学术、备考及运动投入</p>
      </div>

      <!-- Quick Date Navigator -->
      <div class="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
        <button
          @click="changeDate(-1)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="前一天"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <div class="flex items-center gap-2 px-2">
          <CalendarIcon class="w-4 h-4 text-tomato-400" />
          <input
            v-model="selectedDateStr"
            type="date"
            class="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          />
        </div>

        <button
          @click="changeDate(1)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="后一天"
        >
          <ChevronRight class="w-4 h-4" />
        </button>

        <button
          @click="selectedDateStr = dayjs().format('YYYY-MM-DD')"
          class="ml-1 px-2.5 py-1 text-xs rounded-md bg-slate-700 hover:bg-slate-650 text-slate-300 font-medium transition-colors"
        >
          回到今天
        </button>
      </div>
    </div>

    <!-- Day Overview Summary Bar -->
    <div class="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
      <div class="space-y-1">
        <div class="text-xs font-medium text-slate-400">
          {{ formattedDateDisplay }}
        </div>
        <div class="text-2xl font-extrabold text-slate-100 font-mono flex items-center gap-2">
          <span>{{ Math.floor(selectedDayMinutes / 60) }} 小时 {{ selectedDayMinutes % 60 }} 分钟</span>
          <span class="text-xs font-normal text-slate-400">({{ selectedDayLogs.length }} 次专注)</span>
        </div>
      </div>

      <!-- Category Quick Share Breakdown -->
      <div class="flex flex-wrap items-center gap-3">
        <div
          v-for="item in selectedDayCategoryBreakdown"
          :key="item.id"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs"
        >
          <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: item.color }"></span>
          <span class="text-slate-300 font-medium">{{ item.name }}</span>
          <span class="font-mono text-slate-400">{{ Math.floor(item.minutes / 60) }}h {{ item.minutes % 60 }}m</span>
        </div>
      </div>
    </div>

    <!-- 24-Hour Timeline Visual Strip -->
    <div class="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Clock class="w-3.5 h-3.5 text-tomato-400" />
          全天 24 小时作息色块带 (00:00 - 24:00)
        </span>
        <span class="text-[11px] text-slate-500">彩色区域表示实际专注时段</span>
      </div>

      <!-- Strip Container -->
      <div class="relative w-full h-8 bg-slate-900/80 rounded-lg overflow-hidden border border-slate-700/80">
        <!-- 24h markers -->
        <div class="absolute inset-0 flex justify-between pointer-events-none opacity-20">
          <div v-for="h in 24" :key="h" class="border-r border-slate-500 h-full w-full"></div>
        </div>

        <!-- Render Log Blocks -->
        <div
          v-for="log in selectedDayLogs"
          :key="log.id"
          class="absolute top-0 bottom-0 rounded-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
          :style="{
            left: `${getLogPosition(log).left}%`,
            width: `${Math.max(1, getLogPosition(log).width)}%`,
            backgroundColor: log.categoryColor
          }"
          :title="`${log.categoryName}: ${log.taskTitle} (${log.durationMinutes}m)`"
        ></div>
      </div>

      <!-- Hour Labels -->
      <div class="flex justify-between text-[10px] text-slate-500 mt-1 font-mono px-0.5">
        <span>00:00</span>
        <span>04:00</span>
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
        <span>24:00</span>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Search input -->
      <div class="relative w-full sm:w-72">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索文献题目/备考内容..."
          class="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-tomato-500"
        />
      </div>

      <!-- Category Filter -->
      <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
        <button
          @click="selectedCategory = 'all'"
          class="px-2.5 py-1.5 rounded-lg text-xs transition-colors shrink-0"
          :class="selectedCategory === 'all' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'"
        >
          全部分类
        </button>
        <button
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          class="px-2.5 py-1.5 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5"
          :class="selectedCategory === cat.id ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'"
        >
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: cat.color }"></span>
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Interactive Chronological Stream -->
    <div class="space-y-4">
      <div v-if="filteredTimelineLogs.length === 0" class="p-12 text-center bg-slate-800/20 rounded-2xl border border-slate-700/40">
        <History class="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p class="text-xs text-slate-400">该日期或搜索条件下未检索到专注记录</p>
      </div>

      <div v-else class="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
        <div
          v-for="log in filteredTimelineLogs"
          :key="log.id"
          class="relative group"
        >
          <!-- Timeline Node Point -->
          <div
            class="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow"
            :style="{ backgroundColor: log.categoryColor }"
          ></div>

          <!-- Card Content -->
          <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2.5">
                <span
                  class="text-[11px] px-2 py-0.5 rounded-md font-semibold"
                  :style="{
                    backgroundColor: `${log.categoryColor}25`,
                    color: log.categoryColor
                  }"
                >
                  {{ log.categoryName }}
                </span>
                <span class="text-sm font-bold text-slate-100">{{ log.taskTitle }}</span>
              </div>

              <!-- Time Range -->
              <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{{ formatTimeOnly(log.startTime) }} - {{ formatTimeOnly(log.endTime) }}</span>
                <span class="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-semibold">
                  {{ log.durationMinutes }} 分钟
                </span>
              </div>
            </div>

            <!-- Notes -->
            <p v-if="log.notes" class="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
              💡 {{ log.notes }}
            </p>

            <!-- Card Actions -->
            <div class="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
              <span class="capitalize">计时模式: {{ log.mode }}</span>
              <button
                @click="timeLogStore.deleteLog(log.id)"
                class="hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
              >
                <Trash2 class="w-3.5 h-3.5" />
                删除记录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Search,
  History,
  Trash2
} from 'lucide-vue-next'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import type { TimeLog } from '@/types'

const timeLogStore = useTimeLogStore()
const categoryStore = useCategoryStore()

const selectedDateStr = ref(dayjs().format('YYYY-MM-DD'))
const selectedCategory = ref<string>('all')
const searchKeyword = ref<string>('')

function changeDate(delta: number) {
  selectedDateStr.value = dayjs(selectedDateStr.value).add(delta, 'day').format('YYYY-MM-DD')
}

const formattedDateDisplay = computed(() => {
  const d = dayjs(selectedDateStr.value)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.format('YYYY年MM月DD日')} · ${weekdays[d.day()]}`
})

const selectedDayLogs = computed(() => {
  return timeLogStore.getLogsByDate(selectedDateStr.value).sort((a, b) => {
    return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
  })
})

const selectedDayMinutes = computed(() => {
  return selectedDayLogs.value.reduce((sum, l) => sum + l.durationMinutes, 0)
})

const selectedDayCategoryBreakdown = computed(() => {
  const map: Record<string, { id: string; name: string; color: string; minutes: number }> = {}
  for (const log of selectedDayLogs.value) {
    if (!map[log.categoryId]) {
      map[log.categoryId] = {
        id: log.categoryId,
        name: log.categoryName,
        color: log.categoryColor,
        minutes: 0
      }
    }
    map[log.categoryId].minutes += log.durationMinutes
  }
  return Object.values(map)
})

const filteredTimelineLogs = computed(() => {
  return selectedDayLogs.value.filter(log => {
    const matchCat = selectedCategory.value === 'all' || log.categoryId === selectedCategory.value
    const matchSearch =
      !searchKeyword.value.trim() ||
      log.taskTitle.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    return matchCat && matchSearch
  })
})

function formatTimeOnly(isoStr: string) {
  return dayjs(isoStr).format('HH:mm')
}

// 计算 24 小时色带中 log 的百分比位置
function getLogPosition(log: TimeLog) {
  const start = dayjs(log.startTime)
  const end = dayjs(log.endTime)
  const dayStart = start.startOf('day')

  const startMinutes = start.diff(dayStart, 'minute')
  const duration = Math.max(log.durationMinutes, end.diff(start, 'minute'))

  const left = (startMinutes / 1440) * 100
  const width = (duration / 1440) * 100
  return { left, width }
}
</script>
