import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import type { TimerMode, TimerSettings } from '@/types'
import { StorageService } from '@/utils/storage'
import { soundManager } from '@/utils/sound'
import { useTimeLogStore } from './useTimeLogStore'
import { useTaskStore } from './useTaskStore'
import { useCategoryStore } from './useCategoryStore'

const ACTIVE_TIMER_STORAGE_KEY = 'pomodoro_pro_active_timer_v2'

interface ActiveTimerSnapshot {
  isRunning: boolean
  isPaused: boolean
  mode: TimerMode
  targetEndTime: number | null
  stopwatchBaseTime: number | null
  timeLeft: number
  stopwatchElapsed: number
  selectedCategoryId: string
  selectedTaskId: string
  sessionNotes: string
  sessionStartTime: string | null
  pomodoroMinutes: number
}

export const usePomodoroStore = defineStore('pomodoro', () => {
  const timeLogStore = useTimeLogStore()
  const taskStore = useTaskStore()
  const categoryStore = useCategoryStore()

  // 设置
  const settings = ref<TimerSettings>(StorageService.getSettings())

  // 当前计时模式
  const mode = ref<TimerMode>('pomodoro')
  const isRunning = ref(false)
  const isPaused = ref(false)

  // 倒计时剩余秒数 (默认直接对齐设定的分钟数)
  const timeLeft = ref(settings.value.pomodoroMinutes * 60)
  // 正向计时（秒数）
  const stopwatchElapsed = ref(0)

  // 绝对时间戳双保险（解决手机锁屏/切后台浏览器挂起 setInterval 的问题）
  const targetEndTime = ref<number | null>(null)
  const stopwatchBaseTime = ref<number | null>(null)

  // 当前关联的任务和分类
  const selectedCategoryId = ref<string>(categoryStore.categories[0]?.id || '')
  const selectedTaskId = ref<string>('')
  const sessionNotes = ref<string>('')

  // 记录本轮开始时间
  const sessionStartTime = ref<string | null>(null)

  // 后台 Web Worker 与备用定时器
  let timerWorker: Worker | null = null
  let fallbackInterval: number | null = null
  let wakeLock: any = null

  // 当前总设置时间（秒）
  const totalDuration = computed(() => {
    if (mode.value === 'stopwatch') return 0
    return settings.value.pomodoroMinutes * 60
  })

  // 进度百分比 (0 - 100)
  const progressPercent = computed(() => {
    if (mode.value === 'stopwatch') return 100
    if (totalDuration.value === 0) return 0
    const elapsed = totalDuration.value - timeLeft.value
    return Math.min(100, Math.max(0, (elapsed / totalDuration.value) * 100))
  })

  // 格式化展示 (支持 hh:mm:ss 或 mm:ss)
  const formattedTime = computed(() => {
    const totalSeconds = mode.value === 'stopwatch' ? stopwatchElapsed.value : timeLeft.value
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  })

  // 保存当前计时器快照到本地存储，防页面刷新或系统后台杀进程
  function saveSnapshot() {
    try {
      const snapshot: ActiveTimerSnapshot = {
        isRunning: isRunning.value,
        isPaused: isPaused.value,
        mode: mode.value,
        targetEndTime: targetEndTime.value,
        stopwatchBaseTime: stopwatchBaseTime.value,
        timeLeft: timeLeft.value,
        stopwatchElapsed: stopwatchElapsed.value,
        selectedCategoryId: selectedCategoryId.value,
        selectedTaskId: selectedTaskId.value,
        sessionNotes: sessionNotes.value,
        sessionStartTime: sessionStartTime.value,
        pomodoroMinutes: settings.value.pomodoroMinutes
      }
      localStorage.setItem(ACTIVE_TIMER_STORAGE_KEY, JSON.stringify(snapshot))
    } catch {
      // ignore
    }
  }

  // 清除本地存储的快照
  function clearSnapshot() {
    try {
      localStorage.removeItem(ACTIVE_TIMER_STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  // 更新网页标题显示实时时间
  function updateTitle() {
    if (typeof document === 'undefined') return
    if (isRunning.value) {
      document.title = `(${formattedTime.value}) 🍅 番茄ToDo PRO`
    } else {
      document.title = '🍅 番茄ToDo PRO'
    }
  }

  // 请求屏幕常亮 Wake Lock (防手机自动息屏)
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator && (navigator as any).wakeLock) {
        wakeLock = await (navigator as any).wakeLock.request('screen')
      }
    } catch {
      // 某些浏览器在省电模式或不支持时静默跳过
    }
  }

  // 释放屏幕常亮
  function releaseWakeLock() {
    try {
      if (wakeLock) {
        wakeLock.release()
        wakeLock = null
      }
    } catch {
      // ignore
    }
  }

  // 尝试申请系统通知权限
  function tryRequestNotification() {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    } catch {
      // ignore
    }
  }

  // 弹出完成通知
  function showCompletionNotification() {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 专注周期达成！', {
          body: `恭喜！已完成 ${settings.value.pomodoroMinutes} 分钟专注攻坚，数据已实时保存并对齐！`,
          icon: '/tomato-icon.svg'
        })
      }
    } catch {
      // ignore
    }
  }

  // 启动后台 Web Worker 定时器（独立线程，不受标签页后台挂起影响）
  function startWorkerTimer() {
    stopWorkerTimer()

    // 1. 创建内联 Blob Web Worker
    try {
      const workerCode = `
        let timer = null;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            if (timer) clearInterval(timer);
            timer = setInterval(function() {
              self.postMessage('tick');
            }, 1000);
          } else if (e.data === 'stop') {
            if (timer) clearInterval(timer);
            timer = null;
          }
        };
      `
      const blob = new Blob([workerCode], { type: 'application/javascript' })
      const workerUrl = URL.createObjectURL(blob)
      timerWorker = new Worker(workerUrl)
      timerWorker.onmessage = (e) => {
        if (e.data === 'tick') {
          tick()
        }
      }
      timerWorker.postMessage('start')
    } catch (err) {
      console.warn('Web Worker timer creation failed, falling back to window.setInterval', err)
    }

    // 2. 同时保留普通 window.setInterval 作为双重保险
    fallbackInterval = window.setInterval(() => {
      tick()
    }, 1000)
  }

  function stopWorkerTimer() {
    if (timerWorker) {
      try {
        timerWorker.postMessage('stop')
        timerWorker.terminate()
      } catch {
        // ignore
      }
      timerWorker = null
    }
    if (fallbackInterval) {
      clearInterval(fallbackInterval)
      fallbackInterval = null
    }
  }

  // 基于绝对系统时间戳（Date.now()）进行毫米级精准对齐
  function syncFromTimestamp() {
    if (!isRunning.value) return
    const now = Date.now()

    if (mode.value === 'pomodoro' && targetEndTime.value) {
      const remainingSeconds = Math.round((targetEndTime.value - now) / 1000)
      if (remainingSeconds <= 0) {
        timeLeft.value = 0
        completeSession()
      } else {
        timeLeft.value = remainingSeconds
        updateTitle()
      }
    } else if (mode.value === 'stopwatch' && stopwatchBaseTime.value) {
      stopwatchElapsed.value = Math.max(0, Math.round((now - stopwatchBaseTime.value) / 1000))
      updateTitle()
    }
  }

  // 计时核心递进
  function tick() {
    syncFromTimestamp()
    saveSnapshot()
  }

  // 开始计时
  function start() {
    if (isRunning.value) return
    isRunning.value = true
    isPaused.value = false

    const now = Date.now()
    if (!sessionStartTime.value) {
      sessionStartTime.value = new Date(now).toISOString()
    }

    if (mode.value === 'pomodoro') {
      // 锚定绝对目标结束时间戳
      targetEndTime.value = now + timeLeft.value * 1000
    } else if (mode.value === 'stopwatch') {
      stopwatchBaseTime.value = now - stopwatchElapsed.value * 1000
    }

    requestWakeLock()
    tryRequestNotification()

    soundManager.playClick(settings.value.soundVolume)
    if (settings.value.ambientSound !== 'none') {
      soundManager.startAmbient(settings.value.ambientSound as 'rain' | 'whitenoise' | 'waves', settings.value.soundVolume)
    }

    startWorkerTimer()
    saveSnapshot()
    updateTitle()
  }

  // 暂停计时
  function pause() {
    if (!isRunning.value) return
    isRunning.value = false
    isPaused.value = true

    stopWorkerTimer()
    releaseWakeLock()

    // 暂停前最后精准同步一次剩余时间
    syncFromTimestamp()

    targetEndTime.value = null
    stopwatchBaseTime.value = null

    soundManager.stopAmbient()
    soundManager.playClick(settings.value.soundVolume)
    saveSnapshot()
    updateTitle()
  }

  // 直接按当前时段任务时长配置番茄钟（无中途休息，整段沉浸攻坚）
  function setTargetDuration(minutes: number, categoryId?: string, taskTitle?: string) {
    pause()
    mode.value = 'pomodoro'
    settings.value.pomodoroMinutes = minutes
    timeLeft.value = minutes * 60
    sessionStartTime.value = null

    if (categoryId) {
      selectedCategoryId.value = categoryId
    }
    if (taskTitle) {
      sessionNotes.value = taskTitle
    }
    saveSnapshot()
  }

  // 完成当前周期 (无需中途休息中断)
  function completeSession() {
    pause()
    clearSnapshot()
    soundManager.stopAmbient()

    if (settings.value.soundEnabled) {
      soundManager.playCompletionBell(settings.value.soundVolume)
    }

    showCompletionNotification()

    if (typeof document !== 'undefined') {
      document.title = '🔔 专注达成！🍅 番茄ToDo PRO'
    }

    // 燃放彩带动画
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      })
    } catch {
      // ignore
    }

    if (mode.value === 'pomodoro') {
      const durationMin = settings.value.pomodoroMinutes
      recordTimeLog(durationMin, 'pomodoro')
      // 重置回预设时长，保持纯粹专注，不强行切休息
      timeLeft.value = settings.value.pomodoroMinutes * 60
    }
  }

  // 手动结束正向计时并记录
  function finishStopwatch() {
    if (mode.value !== 'stopwatch') return
    pause()
    clearSnapshot()
    const minutes = Math.max(1, Math.round(stopwatchElapsed.value / 60))
    recordTimeLog(minutes, 'stopwatch')
    stopwatchElapsed.value = 0
    sessionStartTime.value = null
  }

  // 写入一条实际时间记录
  function recordTimeLog(durationMin: number, logMode: 'pomodoro' | 'stopwatch') {
    const cat = categoryStore.getCategoryById(selectedCategoryId.value) || categoryStore.categories[0]
    const task = selectedTaskId.value ? taskStore.tasks.find(t => t.id === selectedTaskId.value) : undefined

    const endTime = new Date()
    const startTime = sessionStartTime.value ? new Date(sessionStartTime.value) : new Date(endTime.getTime() - durationMin * 60000)

    timeLogStore.addLog({
      taskId: task?.id,
      taskTitle: task?.title || sessionNotes.value || (cat ? `${cat.name} 攻坚` : '专注攻坚'),
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes: durationMin,
      mode: logMode,
      notes: sessionNotes.value || task?.notes || '整段高强度纯沉浸攻坚'
    })

    if (task) {
      taskStore.incrementTaskPomodoro(task.id)
    }

    sessionNotes.value = ''
    sessionStartTime.value = null
  }

  // 切换计时模式
  function switchMode(newMode: TimerMode) {
    pause()
    mode.value = newMode
    sessionStartTime.value = null

    if (newMode === 'pomodoro') {
      timeLeft.value = settings.value.pomodoroMinutes * 60
    } else if (newMode === 'stopwatch') {
      stopwatchElapsed.value = 0
    }
    saveSnapshot()
  }

  // 重置当前模式计时器
  function reset() {
    pause()
    clearSnapshot()
    sessionStartTime.value = null
    timeLeft.value = settings.value.pomodoroMinutes * 60
    stopwatchElapsed.value = 0
    updateTitle()
  }

  // 保存设置
  function updateSettings(newSettings: Partial<TimerSettings>) {
    settings.value = { ...settings.value, ...newSettings }
    StorageService.saveSettings(settings.value)
    if (!isRunning.value) {
      timeLeft.value = settings.value.pomodoroMinutes * 60
    }
    saveSnapshot()
  }

  // 恢复保存的正在进行的会话
  function restoreSessionFromStorage() {
    try {
      const raw = localStorage.getItem(ACTIVE_TIMER_STORAGE_KEY)
      if (!raw) return
      const snapshot: ActiveTimerSnapshot = JSON.parse(raw)
      if (!snapshot) return

      mode.value = snapshot.mode || 'pomodoro'
      if (snapshot.selectedCategoryId) selectedCategoryId.value = snapshot.selectedCategoryId
      if (snapshot.selectedTaskId) selectedTaskId.value = snapshot.selectedTaskId
      if (snapshot.sessionNotes) sessionNotes.value = snapshot.sessionNotes
      if (snapshot.sessionStartTime) sessionStartTime.value = snapshot.sessionStartTime
      if (snapshot.pomodoroMinutes) settings.value.pomodoroMinutes = snapshot.pomodoroMinutes

      if (snapshot.isRunning) {
        const now = Date.now()
        if (snapshot.mode === 'pomodoro' && snapshot.targetEndTime) {
          const diff = Math.round((snapshot.targetEndTime - now) / 1000)
          if (diff <= 0) {
            // 在页面离开/锁屏期间已经到了目标时间，立即触发完成！
            timeLeft.value = 0
            setTimeout(() => {
              completeSession()
            }, 200)
          } else {
            // 仍在倒计时范围内，无缝续跑
            targetEndTime.value = snapshot.targetEndTime
            timeLeft.value = diff
            start()
          }
        } else if (snapshot.mode === 'stopwatch' && snapshot.stopwatchBaseTime) {
          stopwatchBaseTime.value = snapshot.stopwatchBaseTime
          stopwatchElapsed.value = Math.max(0, Math.round((now - snapshot.stopwatchBaseTime) / 1000))
          start()
        }
      } else if (snapshot.isPaused) {
        isPaused.value = true
        isRunning.value = false
        timeLeft.value = snapshot.timeLeft || settings.value.pomodoroMinutes * 60
        stopwatchElapsed.value = snapshot.stopwatchElapsed || 0
      }
    } catch (e) {
      console.warn('Failed to restore active timer session:', e)
    }
  }

  // 全局唤醒监听：处理切回前台、手机点亮解锁屏幕、页面焦点激活
  if (typeof window !== 'undefined') {
    const handleForegroundWakeup = () => {
      if (isRunning.value) {
        syncFromTimestamp()
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleForegroundWakeup()
      }
    })
    window.addEventListener('pageshow', handleForegroundWakeup)
    window.addEventListener('focus', handleForegroundWakeup)

    // 初始化时尝试恢复之前的活跃状态
    restoreSessionFromStorage()
  }

  return {
    settings,
    mode,
    isRunning,
    isPaused,
    timeLeft,
    stopwatchElapsed,
    selectedCategoryId,
    selectedTaskId,
    sessionNotes,
    totalDuration,
    progressPercent,
    formattedTime,
    start,
    pause,
    reset,
    switchMode,
    setTargetDuration,
    finishStopwatch,
    updateSettings,
    syncFromTimestamp
  }
})
