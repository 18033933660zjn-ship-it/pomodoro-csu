export type DimensionType = 'academic' | 'language' | 'fitness' | 'skill' | 'life' | 'custom'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  dimension: DimensionType
  dailyTargetMinutes: number // 每日目标（分钟）
  weeklyTargetMinutes: number // 每周目标（分钟）
  description?: string
}

export interface Task {
  id: string
  categoryId: string
  title: string
  completed: boolean
  estimatedPomodoros: number
  completedPomodoros: number
  targetMinutes?: number // 计划/预估学习时长 (分钟)
  actualMinutes?: number // 实际完成学习时长 (分钟)
  dueDate?: string // 截止日期或要求完成时间
  notes?: string // 任务内容与作业详细要求
  createdAt: string
  completedAt?: string
}

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'stopwatch'

export interface TimeLog {
  id: string
  taskId?: string
  taskTitle: string
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  startTime: string // ISO 8601
  endTime: string // ISO 8601
  durationMinutes: number
  mode: 'pomodoro' | 'stopwatch' | 'manual' | 'extra'
  isExtra?: boolean // 是否为额外空闲多学打卡
  notes?: string
}

export interface DailyReflection {
  date: string // YYYY-MM-DD
  score: number // 1-5
  mood: string
  summary: string
  achievements?: string[]
}

export interface TimerSettings {
  pomodoroMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
  soundVolume: number
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'clock' | 'waves'
}

// 课程表项目
export interface CourseItem {
  id: string
  name: string
  dayOfWeek: number // 1..7 (周一到周日)
  time: string // "10:00-11:40"
  location: string
  instructor?: string
  weeks?: string
}

// 自习室/健身房按时打卡关键节点
export interface StudyCheckpoint {
  id: string
  dayOfWeek: number // 1..7
  time: string // "08:00"
  target: string // "自习室" | "健身房"
  taskName: string // e.g. "任务2: 习概与双创导论"
  durationMinutes: number
  description: string
}

// 实际打卡记录
export interface CheckInRecord {
  id: string
  checkpointId: string
  date: string // "YYYY-MM-DD"
  scheduledTime: string // "08:00"
  checkInTime: string // ISO 8601
  status: 'on_time' | 'late' | 'missed'
  diffMinutes: number // > 0 为迟到分钟数，<= 0 为准时/提前
  target: string
  taskName: string
  notes?: string
}

// 自动化每周复盘总结
export interface WeeklyAutomatedReview {
  weekKey: string // "2026-W45"
  startDate: string
  endDate: string
  punctualityRate: number // 准时率百分比
  totalOnTime: number
  totalLate: number
  totalMissed: number
  lateRecords: CheckInRecord[]
  task1Hours: { actual: number; target: number }
  task2Hours: { actual: number; target: number }
  task3Hours: {
    total: { actual: number; target: number }
    biomechanics: { actual: number; target: number }
    researchMethod: { actual: number; target: number }
    competition: { actual: number; target: number }
  }
  task4Hours?: { actual: number; target: number }
  fitnessHours: { actual: number; target: number }
  extraHours: number // 额外空闲多学累计小时
  extraDetails: { name: string; hours: number }[]
  praises: string[] // 表扬做的好的地方
  improvements: string[] // 需要改进的地方
  coachingAdvice: string // 下周行动指引
  overallGrade: 'S' | 'A' | 'B' | 'C' | 'D'
  generatedAt: string
}

export interface AppDataExport {
  version: string
  exportTime: string
  categories: Category[]
  tasks: Task[]
  timeLogs: TimeLog[]
  reflections: Record<string, DailyReflection>
  settings: TimerSettings
  checkIns?: CheckInRecord[]
  deletedLogIds?: string[]
  deletedCheckInIds?: string[]
}

// 受信任设备与专属密匙凭据
export interface TrustedDeviceInfo {
  isTrusted: boolean
  deviceId: string
  deviceName: string
  verifiedAt: string
  token: string
}
