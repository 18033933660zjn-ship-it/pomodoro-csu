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
  athleteRecords?: Record<string, AthleteDailyRecord>
  deletedLogIds?: string[]
  deletedCheckInIds?: string[]
}

// ==================== 篮球高绩效与运动科学·身体管家数据结构 ====================

// 1. 篮球专项训练 (On-Court Workload)
export interface BasketballWorkload {
  modules: string[] // '投篮专项' | '运球脚步' | '半场技战术' | '全场对抗 5v5' | '球场专项体能'
  customModule?: string
  durationMinutes: number
  rpe: number // 主观疲劳度 1-10
  highIntensityJumps: number // 高负荷动作：起跳预估次数
  decelerations: string // 急停变向频度/体感
  contactIntensity: 'low' | 'medium' | 'high' | 'match' // 对抗强度
  notes?: string // 专项体感与投篮手感
}

// 2. 力量与体能训练 (S&C Session)
export interface StrengthConditioningWorkload {
  phase: string // '最大力量' | '爆发力/RFD' | '法式对比抗阻' | '核心与旋转力' | '超量恢复与减载'
  primaryLifts: string // 主要复合动作、负荷（重量/组数/RIR保留次数）
  plyometricsVolume: string // 弹跳/跳跃训练(Plyometrics)容量与地面接触类型 (快速SSC/慢速SSC)
  durationMinutes: number
  notes?: string
}

// 3. 骨骼肌与关节生物力学状态 (Biomechanics & Joint Check)
export interface BiomechanicsJointCheck {
  ankleFootFeel: 'optimal' | 'mild_tight' | 'sore' | 'protective' // 踝/足底筋膜体感
  ankleFootNotes?: string
  patellarTendonPain: number // 髌腱/股四头肌肌腱压痛或晨起僵硬 0-10
  patellarTendonNotes?: string
  hipSpineMobility: 'optimal' | 'pelvic_tilt' | 'lumbar_tight' | 'hip_restricted' // 腰椎/骨盆/髋关节灵活性或紧张感
  hipSpineNotes?: string
}

// 4. 围训练期营养与水合 (Nutrition & Hydration)
export interface NutritionHydrationLog {
  periWorkoutSupplements: string // 训练前后补给（碳水/蛋白质/电解质/肌酸/咖啡因等）
  proteinGPerKg: number // 全天优质蛋白总量（预估 g/kg 体重）
  carbEnergyFeel: 'low' | 'moderate' | 'optimal' | 'surplus' // 总碳水供能感受
  urineColorLevel: number // 全天水合状态尿液颜色等级 1-5 (1为极清澈, 5为深浓黄)
  waterIntakeMl: number // 饮水量 ml
  supplementsDetail?: string // 补剂详情（如：97%高纯鱼油、一水肌酸、复合维生素）
  mealsDetail?: string // 正餐与加餐构成
}

// 5. 睡眠架构与神经恢复 (Recovery & Sleep)
export interface RecoverySleepLog {
  bedTime: string // 入睡时间 "23:30"
  wakeTime: string // 晨起时间 "07:30"
  sleepDurationHours: number // 睡眠总时长 (小时)
  deepSleepPerception: 'poor' | 'fair' | 'good' | 'deep' // 深度睡眠感知
  restingHeartRate?: number // 晨起静息心率 (bpm)
  morningReadinessScore: number // 晨起状态自评 1-10
  cnsExcitement: 'normal' | 'relaxed' | 'wired_tired' | 'heavy_fatigue' // 神经兴奋度 (身心疲惫但入睡困难等)
  sleepNotes?: string
}

// 运动科学专家系统诊断与处方
export interface SportsScienceDiagnosis {
  generatedAt: string
  overallScore: number // 综合体能评分 0-100
  statusTag: string // 状态标签 (如: '超量恢复峰值' | '功能性超负荷' | '神经高疲劳' | '高转化窗口')
  cnsAcwrEvaluation: string // 模块一：中枢神经（CNS）与急慢性运动负荷评估
  kineticChainTransfer: string // 模块二：篮球专项技术与体能动力链转化分析
  prehabProtocol: string // 模块三：骨骼肌腱病理预警与主动防伤方案 (Prehab Protocol)
  biochemNutritionPrescription: string // 模块四：生化营养与睡眠神经调控处方
  nextDayPrescription: string // 模块五：次日【训练负荷-球场表现】处方化指令 (Prescription)
}

// 每日身体管家综合记录
export interface AthleteDailyRecord {
  id: string
  date: string // YYYY-MM-DD
  basketball: BasketballWorkload
  strength: StrengthConditioningWorkload
  biomechanics: BiomechanicsJointCheck
  nutrition: NutritionHydrationLog
  recovery: RecoverySleepLog
  diagnosis?: SportsScienceDiagnosis
  createdAt: string
  updatedAt: string
}

// 受信任设备与专属密匙凭据
export interface TrustedDeviceInfo {
  isTrusted: boolean
  deviceId: string
  deviceName: string
  verifiedAt: string
  token: string
}
