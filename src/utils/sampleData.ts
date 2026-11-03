import dayjs from 'dayjs'
import type { Category, Task, TimeLog, TimerSettings, DailyReflection, CheckInRecord } from '@/types'
import { weeklyCheckpoints } from './courseScheduleData'

export const defaultCategories: Category[] = [
  {
    id: 'cat-ielts-research',
    name: '任务一: 雅思备考 & AI科研推进',
    icon: 'GraduationCap',
    color: '#8b5cf6', // purple
    dimension: 'language',
    dailyTargetMinutes: 180, // 3h
    weeklyTargetMinutes: 1260, // 21h (7天每天3h)
    description: '每天3小时雅思强化学习，并同步利用大模型AI工具推进前沿学术科研'
  },
  {
    id: 'cat-politics-innovation',
    name: '任务二: 习概与双创导论',
    icon: 'BookOpen',
    color: '#f59e0b', // amber
    dimension: 'academic',
    dailyTargetMinutes: 90, // 1.5h
    weeklyTargetMinutes: 540, // 9h (周一到周六共6天)
    description: '每天深入学习习近平新时代思想概论与创新创业导论核心理论'
  },
  {
    id: 'cat-major-courses',
    name: '任务三: 体育专业课三科',
    icon: 'Code',
    color: '#3b82f6', // blue
    dimension: 'skill',
    dailyTargetMinutes: 60, // 1h
    weeklyTargetMinutes: 300, // 5h (周一、二、三、五、日各1h)
    description: '运动生物力学(20m) + 体育科学研究方法(20m) + 运动竞赛学(20m)'
  },
  {
    id: 'cat-fitness-workout',
    name: '周末专项: 健身房高强度锻炼',
    icon: 'Dumbbell',
    color: '#10b981', // green
    dimension: 'fitness',
    dailyTargetMinutes: 150, // 2.5h (周六、周日)
    weeklyTargetMinutes: 300, // 5h
    description: '周末10:00-12:30 健身房力量抗阻、专项爆发力与心肺体能雕刻'
  }
]

export const defaultTasks: Task[] = [
  {
    id: 'task-ielts-1',
    categoryId: 'cat-ielts-research',
    title: '剑雅18 Test 3 阅读长难句精析 + AI辅助生成学术综述论点',
    completed: false,
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    notes: '利用 AI 梳理中英文语义逻辑对照，精析判断题同义替换',
    createdAt: dayjs().toISOString()
  },
  {
    id: 'task-ielts-2',
    categoryId: 'cat-ielts-research',
    title: '雅思学术写作 Task 2 范文仿写 + AI多轮批改语法与衔接',
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    notes: '聚焦科技与健康伦理话题论证框架',
    createdAt: dayjs().subtract(1, 'day').toISOString()
  },
  {
    id: 'task-pol-1',
    categoryId: 'cat-politics-innovation',
    title: '习概核心专题知识点背诵与双创商业模式画布推演',
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 2,
    notes: '结合体育产业创新案例推演双创商业计划书草案',
    createdAt: dayjs().toISOString()
  },
  {
    id: 'task-major-1',
    categoryId: 'cat-major-courses',
    title: '专业课三科突破: 运动生物力学(20m) + 体育科研方法(20m) + 运动竞赛学(20m)',
    completed: false,
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    notes: '梳理运动环节受力平衡方程与实验抽样方法',
    createdAt: dayjs().toISOString()
  },
  {
    id: 'task-fit-1',
    categoryId: 'cat-fitness-workout',
    title: '周末健身房胸肩抗阻力训练 + 40分钟高强度心肺体能',
    completed: false,
    estimatedPomodoros: 4,
    completedPomodoros: 0,
    notes: '10:00-12:30严格执行2.5小时，深蹲与卧推递增组',
    createdAt: dayjs().toISOString()
  }
]

export const defaultSettings: TimerSettings = {
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  soundVolume: 0.8,
  ambientSound: 'none'
}

/**
 * 真实模式：新学期从第 1 天正式起步，历史记录初始为空
 */
export function generateSampleLogs(): TimeLog[] {
  return []
}

export function generateSampleCheckIns(): CheckInRecord[] {
  return []
}

export function generateSampleReflections(): Record<string, DailyReflection> {
  return {}
}
