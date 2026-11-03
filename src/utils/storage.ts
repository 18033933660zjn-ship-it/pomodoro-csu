import type { Category, Task, TimeLog, TimerSettings, DailyReflection, AppDataExport, CheckInRecord } from '@/types'
import { defaultCategories, defaultTasks, defaultSettings, generateSampleLogs, generateSampleReflections, generateSampleCheckIns } from './sampleData'

const STORAGE_KEYS = {
  CATEGORIES: 'pomodoro_pro_categories',
  TASKS: 'pomodoro_pro_tasks',
  TIME_LOGS: 'pomodoro_pro_time_logs',
  REFLECTIONS: 'pomodoro_pro_reflections',
  SETTINGS: 'pomodoro_pro_settings',
  CHECK_INS: 'pomodoro_pro_check_ins',
  INITIALIZED: 'pomodoro_pro_initialized_v2'
}

let syncTimeout: any = null
function debouncePush() {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => {
    StorageService.pushToServer()
  }, 300)
}

export const StorageService = {
  async init() {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
    if (!initialized) {
      // 首次加载，写入初始数据
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories))
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks))
      localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify(generateSampleLogs()))
      localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(generateSampleCheckIns()))
      localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(generateSampleReflections()))
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings))
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
    }

    // 尝试与多端共享服务端双向同步
    await this.syncWithServer()
  },

  async syncWithServer() {
    try {
      const res = await fetch('/api/storage')
      if (res.ok) {
        const serverData: AppDataExport = await res.json()
        if (serverData && serverData.categories && serverData.categories.length > 0) {
          const clientCategories = this.getCategories()
          const clientTasks = this.getTasks()
          const clientLogs = this.getTimeLogs()
          const clientCheckIns = this.getCheckIns()
          const clientReflections = this.getReflections()

          // 1. 合并打卡记录 (CheckIns)：按 checkpointId + date 或 id 唯一去重，绝不丢失离线打卡
          const checkInMap = new Map<string, CheckInRecord>()
          for (const s of (serverData.checkIns || [])) {
            const key = `${s.date}_${s.checkpointId || s.id}`
            checkInMap.set(key, s)
          }
          for (const c of clientCheckIns) {
            const key = `${c.date}_${c.checkpointId || c.id}`
            if (!checkInMap.has(key) || c.status === 'on_time') {
              checkInMap.set(key, c)
            }
          }
          const mergedCheckIns = Array.from(checkInMap.values())

          // 2. 合并专注日志流水 (TimeLogs)：按 id 唯一去重合并，降序排列
          const logMap = new Map<string, TimeLog>()
          for (const s of (serverData.timeLogs || [])) {
            logMap.set(s.id, s)
          }
          for (const c of clientLogs) {
            logMap.set(c.id, c)
          }
          const mergedLogs = Array.from(logMap.values()).sort(
            (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          )

          // 3. 合并反思日记 (Reflections)
          const mergedReflections = {
            ...(serverData.reflections || {}),
            ...clientReflections
          }

          // 4. 合并任务进度
          const taskMap = new Map<string, Task>()
          for (const s of (serverData.tasks || [])) {
            taskMap.set(s.id, s)
          }
          for (const c of clientTasks) {
            const serverTask = taskMap.get(c.id)
            if (!serverTask) {
              taskMap.set(c.id, c)
            } else {
              taskMap.set(c.id, {
                ...serverTask,
                ...c,
                completed: serverTask.completed || c.completed,
                completedPomodoros: Math.max(serverTask.completedPomodoros || 0, c.completedPomodoros || 0)
              })
            }
          }
          const mergedTasks = Array.from(taskMap.values())

          // 写入本地持久化
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(serverData.categories || clientCategories))
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(mergedTasks))
          localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify(mergedLogs))
          localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(mergedCheckIns))
          localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(mergedReflections))
          localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')

          // 若客户端产生了新的数据差量，反向回传合并结果至服务端
          if (mergedLogs.length > (serverData.timeLogs || []).length ||
              mergedCheckIns.length > (serverData.checkIns || []).length) {
            this.pushToServer()
          }

          return true
        } else {
          // 服务端为空，将本地数据初始化推送到服务端
          this.pushToServer()
        }
      }
    } catch {
      // 离线环境无缝降级为完全依赖 LocalStorage
    }
    return false
  },

  async pushToServer() {
    try {
      const data = this.exportAllData()
      await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } catch {
      // 离线忽略
    }
  },

  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data) : defaultCategories
  },

  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    debouncePush()
  },

  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS)
    return data ? JSON.parse(data) : defaultTasks
  },

  saveTasks(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    debouncePush()
  },

  getTimeLogs(): TimeLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.TIME_LOGS)
    return data ? JSON.parse(data) : []
  },

  saveTimeLogs(logs: TimeLog[]) {
    localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify(logs))
    debouncePush()
  },

  getCheckIns(): CheckInRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS)
    return data ? JSON.parse(data) : generateSampleCheckIns()
  },

  saveCheckIns(records: CheckInRecord[]) {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(records))
    debouncePush()
  },

  getReflections(): Record<string, DailyReflection> {
    const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS)
    return data ? JSON.parse(data) : {}
  },

  saveReflections(reflections: Record<string, DailyReflection>) {
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections))
    debouncePush()
  },

  getSettings(): TimerSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : defaultSettings
  },

  saveSettings(settings: TimerSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    debouncePush()
  },

  exportAllData(): AppDataExport {
    return {
      version: '2.0.0',
      exportTime: new Date().toISOString(),
      categories: this.getCategories(),
      tasks: this.getTasks(),
      timeLogs: this.getTimeLogs(),
      reflections: this.getReflections(),
      settings: this.getSettings(),
      checkIns: this.getCheckIns()
    }
  },

  importData(data: AppDataExport): boolean {
    try {
      if (data.categories) this.saveCategories(data.categories)
      if (data.tasks) this.saveTasks(data.tasks)
      if (data.timeLogs) this.saveTimeLogs(data.timeLogs)
      if (data.reflections) this.saveReflections(data.reflections)
      if (data.settings) this.saveSettings(data.settings)
      if (data.checkIns) this.saveCheckIns(data.checkIns)
      this.pushToServer()
      return true
    } catch (e) {
      console.error('Import failed', e)
      return false
    }
  },

  resetToDemo() {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
    this.init()
    this.pushToServer()
  },

  clearAllData() {
    localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify({}))
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify([]))
    this.pushToServer()
  }
}
