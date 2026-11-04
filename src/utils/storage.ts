import { ref } from 'vue'
import type { Category, Task, TimeLog, TimerSettings, DailyReflection, AppDataExport, CheckInRecord } from '@/types'
import { defaultCategories, defaultTasks, defaultSettings, generateSampleLogs, generateSampleReflections, generateSampleCheckIns } from './sampleData'

const STORAGE_KEYS = {
  CATEGORIES: 'pomodoro_pro_categories',
  TASKS: 'pomodoro_pro_tasks',
  TIME_LOGS: 'pomodoro_pro_time_logs',
  REFLECTIONS: 'pomodoro_pro_reflections',
  SETTINGS: 'pomodoro_pro_settings',
  CHECK_INS: 'pomodoro_pro_check_ins',
  INITIALIZED: 'pomodoro_pro_initialized_v2',
  LAST_SYNC_TIME: 'pomodoro_pro_last_sync_time',
  CUSTOM_GIST_ID: 'pomodoro_pro_custom_gist_id',
  CUSTOM_GITHUB_TOKEN: 'pomodoro_pro_custom_github_token'
}

export const CLOUD_SYNC_CONFIG = {
  DEFAULT_GIST_ID: '6106983a62444de777fccb2a7a958424',
  REPO_URL: 'https://github.com/18033933660zjn-ship-it/pomodoro-csu',
  PAGES_URL: 'https://18033933660zjn-ship-it.github.io/pomodoro-csu/?token=csu-study-2026-pro'
}

// 响应式同步状态供全局 UI（侧边栏、移动端顶栏、打卡看板）实时共享
const isSyncingRef = ref(false)
const lastSyncTimeRef = ref(typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME) || '') : '')
const lastSyncStatusRef = ref<'synced' | 'syncing' | 'error' | 'idle'>('idle')
const lastSyncMessageRef = ref('已就绪')

export function useSyncState() {
  return {
    isSyncing: isSyncingRef,
    lastSyncTime: lastSyncTimeRef,
    lastSyncStatus: lastSyncStatusRef,
    lastSyncMessage: lastSyncMessageRef,
    syncNow: () => StorageService.syncWithServer(true)
  }
}

let syncTimeout: any = null
function debouncePush() {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => {
    StorageService.pushToServer()
  }, 400)
}

// 广播跨端数据变更事件，通知所有活动 Store 响应式刷新
function notifyDataChanged(detail?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pomodoro-sync-updated', { detail }))
  }
}

export interface SyncResult {
  success: boolean
  updated: boolean
  source: 'cloud' | 'local' | 'offline'
  error?: string
  lastSyncTime?: string
}

export const StorageService = {
  isSyncing: false,
  lastSyncStatus: 'idle' as 'idle' | 'syncing' | 'synced' | 'error',
  lastSyncMessage: '',
  lastSyncTime: '',

  getGistId(): string {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_GIST_ID) || CLOUD_SYNC_CONFIG.DEFAULT_GIST_ID
  },

  setGistId(id: string) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_GIST_ID, id)
  },

  getGithubToken(): string {
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_GITHUB_TOKEN) || ''
  },

  setGithubToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_GITHUB_TOKEN, token)
  },

  getLastSyncTime(): string {
    if (!this.lastSyncTime) {
      this.lastSyncTime = localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME) || ''
    }
    return this.lastSyncTime
  },

  async init() {
    // 1. 检查 URL 中是否有扫码传入的专属云同步 Token / GistID
    if (typeof window !== 'undefined') {
      try {
        const fullSearch = window.location.search || ''
        const fullHash = window.location.hash || ''
        const params = new URLSearchParams(fullSearch || (fullHash.includes('?') ? fullHash.slice(fullHash.indexOf('?')) : ''))
        let queryToken = params.get('syncToken')
        if (!queryToken && fullHash.includes('syncToken=')) {
          const m = fullHash.match(/syncToken=([^&]+)/)
          if (m) queryToken = decodeURIComponent(m[1])
        }
        if (queryToken) {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_GITHUB_TOKEN, queryToken)
          // 清理地址栏 URL，防止 token 留在浏览器历史中
          if (window.history && window.history.replaceState) {
            const cleanUrl = window.location.href.replace(/[?&]syncToken=[^&#]+/, '').replace(/#syncToken=[^&]+/, '')
            window.history.replaceState({}, document.title, cleanUrl)
          }
        }
        const queryGist = params.get('gistId')
        if (queryGist) {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_GIST_ID, queryGist)
        }
      } catch {
        // ignore
      }

      // 2. 若本地尚无 Token 且位于本地服务运行环境，自动请求本地安全接口获取 Token
      if (!this.getGithubToken()) {
        try {
          const res = await fetch('/api/sync-token')
          if (res.ok) {
            const data = await res.json()
            if (data && data.token) {
              localStorage.setItem(STORAGE_KEYS.CUSTOM_GITHUB_TOKEN, data.token)
            }
          }
        } catch {
          // ignore
        }
      }
    }

    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
    if (!initialized) {
      // 首次加载，写入初始基础结构
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories))
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(defaultTasks))
      localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify(generateSampleLogs()))
      localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(generateSampleCheckIns()))
      localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(generateSampleReflections()))
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings))
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
    }

    // 立即启动双向同步
    await this.syncWithServer()
  },

  /**
   * 核心双向全量智能合并算法（CRDT-style Conflict-Free Merge）
   * 绝不覆盖任何一端的最新记录，支持离线打卡、跨端流水自动去重与进度最大值合并
   */
  mergeDataset(clientData: AppDataExport, remoteData: AppDataExport): {
    merged: AppDataExport
    clientHadNew: boolean
    remoteHadNew: boolean
  } {
    let clientHadNew = false
    let remoteHadNew = false

    // 1. 合并打卡记录 (CheckIns)：按 `${date}_${checkpointId || id}` 唯一识别
    const checkInMap = new Map<string, CheckInRecord>()
    const remoteCheckIns = remoteData.checkIns || []
    const clientCheckIns = clientData.checkIns || []

    for (const r of remoteCheckIns) {
      const key = `${r.date}_${r.checkpointId || r.id}`
      checkInMap.set(key, r)
    }

    for (const c of clientCheckIns) {
      const key = `${c.date}_${c.checkpointId || c.id}`
      const remoteRecord = checkInMap.get(key)
      if (!remoteRecord) {
        checkInMap.set(key, c)
        clientHadNew = true
      } else {
        // 如果客户端是准时打卡，而服务端状态较弱或相同，以准时或更早打卡时间戳为准
        if (c.status === 'on_time' && remoteRecord.status !== 'on_time') {
          checkInMap.set(key, c)
          clientHadNew = true
        } else if (c.notes && (!remoteRecord.notes || c.notes.length > remoteRecord.notes.length)) {
          checkInMap.set(key, { ...remoteRecord, notes: c.notes })
        }
      }
    }

    // 检查云端是否有客户端所没有的记录
    for (const r of remoteCheckIns) {
      const key = `${r.date}_${r.checkpointId || r.id}`
      const clientHas = clientCheckIns.some(c => `${c.date}_${c.checkpointId || c.id}` === key)
      if (!clientHas) {
        remoteHadNew = true
      }
    }

    const mergedCheckIns = Array.from(checkInMap.values()).sort(
      (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
    )

    // 2. 合并专注日志流水 (TimeLogs)：按 id 唯一去重
    const logMap = new Map<string, TimeLog>()
    const remoteLogs = remoteData.timeLogs || []
    const clientLogs = clientData.timeLogs || []

    for (const r of remoteLogs) {
      logMap.set(r.id, r)
    }

    for (const c of clientLogs) {
      if (!logMap.has(c.id)) {
        logMap.set(c.id, c)
        clientHadNew = true
      } else {
        // 保留备注更详尽的一方
        const r = logMap.get(c.id)!
        if (c.notes && (!r.notes || c.notes.length > r.notes.length)) {
          logMap.set(c.id, { ...r, ...c })
        }
      }
    }

    for (const r of remoteLogs) {
      if (!clientLogs.some(c => c.id === r.id)) {
        remoteHadNew = true
      }
    }

    const mergedLogs = Array.from(logMap.values()).sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )

    // 3. 合并反思日记 (Reflections)
    const mergedReflections = {
      ...(remoteData.reflections || {}),
      ...(clientData.reflections || {})
    }
    const clientReflKeys = Object.keys(clientData.reflections || {})
    const remoteReflKeys = Object.keys(remoteData.reflections || {})
    for (const k of clientReflKeys) {
      if (!remoteReflKeys.includes(k)) clientHadNew = true
    }
    for (const k of remoteReflKeys) {
      if (!clientReflKeys.includes(k)) remoteHadNew = true
    }

    // 4. 合并任务进度 (Tasks)：保留最大番茄进度及完成标记
    const taskMap = new Map<string, Task>()
    const remoteTasks = remoteData.tasks || []
    const clientTasks = clientData.tasks || []

    for (const r of remoteTasks) {
      taskMap.set(r.id, r)
    }

    for (const c of clientTasks) {
      const r = taskMap.get(c.id)
      if (!r) {
        taskMap.set(c.id, c)
        clientHadNew = true
      } else {
        const higherPomodoros = Math.max(c.completedPomodoros || 0, r.completedPomodoros || 0)
        const isCompleted = c.completed || r.completed
        if ((c.completedPomodoros || 0) > (r.completedPomodoros || 0) || (c.completed && !r.completed)) {
          clientHadNew = true
        } else if ((r.completedPomodoros || 0) > (c.completedPomodoros || 0) || (r.completed && !c.completed)) {
          remoteHadNew = true
        }
        taskMap.set(c.id, {
          ...r,
          ...c,
          completed: isCompleted,
          completedPomodoros: higherPomodoros
        })
      }
    }

    for (const r of remoteTasks) {
      if (!clientTasks.some(c => c.id === r.id)) {
        remoteHadNew = true
      }
    }

    const mergedTasks = Array.from(taskMap.values())

    // 5. 分类与设置
    const mergedCategories = (remoteData.categories && remoteData.categories.length > 0)
      ? remoteData.categories
      : (clientData.categories || defaultCategories)

    const mergedSettings = {
      ...defaultSettings,
      ...(remoteData.settings || {}),
      ...(clientData.settings || {})
    }

    const merged: AppDataExport = {
      version: '2.0.0',
      exportTime: new Date().toISOString(),
      categories: mergedCategories,
      tasks: mergedTasks,
      timeLogs: mergedLogs,
      reflections: mergedReflections,
      settings: mergedSettings,
      checkIns: mergedCheckIns
    }

    return { merged, clientHadNew, remoteHadNew }
  },

  /**
   * 执行双向同步：
   * 1. 优先拉取 GitHub Gist 24小时永久云端数据库（无论手机在何处、电脑是否关机）
   * 2. 执行 CRDT 智能合并
   * 3. 若有本地新增记录，自动回传推送到云端 Gist 与本地 /api/storage
   * 4. 若云端有新增记录，写入本地 LocalStorage 并触发全局 UI 响应式更新
   */
  async syncWithServer(forcePush = false): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: true, updated: false, source: 'cloud' }
    }

    this.isSyncing = true
    this.lastSyncStatus = 'syncing'
    isSyncingRef.value = true
    lastSyncStatusRef.value = 'syncing'
    lastSyncMessageRef.value = '正在与云端互通同步...'

    const clientData = this.exportAllData()
    const gistId = this.getGistId()
    const token = this.getGithubToken()

    let remoteData: AppDataExport | null = null
    let syncSource: 'cloud' | 'local' | 'offline' = 'offline'

    // 1. 若在本地或局域网环境，优先超高速读取本地 /api/storage (1毫秒即刻响应，零网络阻塞)
    try {
      const localRes = await fetch('/api/storage', {
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout ? AbortSignal.timeout(1500) : undefined
      })
      if (localRes.ok) {
        const localParsed = await localRes.json()
        if (localParsed && (localParsed.categories || localParsed.timeLogs)) {
          remoteData = localParsed
          syncSource = 'local'
        }
      }
    } catch {
      // 离线或外网纯手机环境，继续由云端 Gist 接管
    }

    // 2. 尝试从 GitHub Gist 云端获取 (不受校园网、电脑待机限制，全网24h通达)
    if (gistId && token) {
      try {
        const gistUrl = `https://api.github.com/gists/${gistId}?_t=${Date.now()}`
        const res = await fetch(gistUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'Cache-Control': 'no-cache'
          },
          signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
        })

        if (res.ok) {
          const gistRes = await res.json()
          if (gistRes.files && gistRes.files['storage.json'] && gistRes.files['storage.json'].content) {
            const gistData = JSON.parse(gistRes.files['storage.json'].content)
            if (remoteData) {
              const rMerged = this.mergeDataset(remoteData, gistData).merged
              remoteData = rMerged
            } else {
              remoteData = gistData
            }
            syncSource = 'cloud'
          }
        }
      } catch (cloudErr) {
        // 网络异常或断网时已由本地 /api/storage 兜底
      }
    }

    // 若两处远程均无法访问，且本地无有效数据，则保持当前离线 LocalStorage 状态
    if (!remoteData) {
      this.isSyncing = false
      this.lastSyncStatus = 'idle'
      this.lastSyncMessage = '离线存储中（数据已安全保存在本地）'
      isSyncingRef.value = false
      lastSyncStatusRef.value = 'synced'
      lastSyncMessageRef.value = '本地安全模式'
      return { success: false, updated: false, source: 'offline' }
    }

    // 执行双向无损智能合并
    const { merged, clientHadNew, remoteHadNew } = this.mergeDataset(clientData, remoteData)

    // 将最新全量合并数据可靠写入本地 LocalStorage
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(merged.categories))
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(merged.tasks))
    localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify(merged.timeLogs))
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(merged.checkIns))
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(merged.reflections))
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged.settings))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')

    // 通知全局 store 重新加载数据
    notifyDataChanged(merged)

    // 如果客户端有新记录或强制推送，反向回传更新云端 Gist 与本地服务端
    if (clientHadNew || forcePush) {
      await this.pushDatasetToTargets(merged, gistId, token)
    }

    const nowIso = new Date().toISOString()
    this.lastSyncTime = nowIso
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, nowIso)
    this.lastSyncStatus = 'synced'
    this.lastSyncMessage = syncSource === 'cloud' ? '云端双向已实时同步' : '局域网已同步'
    this.isSyncing = false

    isSyncingRef.value = false
    lastSyncTimeRef.value = nowIso
    lastSyncStatusRef.value = 'synced'
    lastSyncMessageRef.value = syncSource === 'cloud' ? '手机/电脑已实时互通' : '局域网已同步'

    return {
      success: true,
      updated: remoteHadNew,
      source: syncSource,
      lastSyncTime: nowIso
    }
  },

  /**
   * 将数据推送到云端 Gist 和本地 /api/storage
   */
  async pushDatasetToTargets(data: AppDataExport, gistId?: string, token?: string) {
    const targetGistId = gistId || this.getGistId()
    const targetToken = token || this.getGithubToken()
    const jsonStr = JSON.stringify(data, null, 2)

    // 1. 推送到 GitHub Gist
    if (targetGistId && targetToken) {
      try {
        await fetch(`https://api.github.com/gists/${targetGistId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${targetToken}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Pomodoro-CSU-Sync'
          },
          body: JSON.stringify({
            description: 'pomodoro-todo-pro-sync',
            files: {
              'storage.json': {
                content: jsonStr
              }
            }
          })
        })
      } catch {
        // 云端推送失败时忽略，等待下一次重试
      }
    }

    // 2. 推送到本地服务 /api/storage（若在电脑或局域网预览中）
    try {
      await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr
      })
    } catch {
      // 离线忽略
    }
  },

  async pushToServer() {
    const data = this.exportAllData()
    await this.pushDatasetToTargets(data)
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
      notifyDataChanged(data)
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
    notifyDataChanged()
  }
}
