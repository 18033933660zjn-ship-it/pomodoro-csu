const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 体育科学研究方法作业 (60m)
const majorTask = {
  id: 'task-major-research-method-20261111',
  categoryId: 'cat-major-courses',
  title: '专业课作业: 体育科学研究方法作业',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '21:15-22:15 晚间高效完成体育科学研究方法作业，深入掌握体育科研选题、实验设计与数据统计分析规范',
  createdAt: '2026-11-11T21:15:00.000+08:00',
  completedAt: '2026-11-11T22:15:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === majorTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = majorTask;
} else {
  data.tasks.unshift(majorTask);
}

// 2. Log: 体育科学研究方法作业 (60m)
const majorLog = {
  id: 'log-20261111-major-research-method',
  taskId: 'task-major-research-method-20261111',
  taskTitle: '专业课作业: 体育科学研究方法作业 (60分钟)',
  categoryId: 'cat-major-courses',
  categoryName: '任务三: 体育专业课三科',
  categoryColor: '#3b82f6',
  categoryIcon: 'Code',
  startTime: '2026-11-11T21:15:00.000+08:00',
  endTime: '2026-11-11T22:15:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '21:15-22:15 晚间专注60分钟：深入完成体育专业核心课程《体育科学研究方法》作业，系统梳理体育科研选题原则、研究假设建立、实验设计与数据统计分析方法规范，完成今日任务三（体育专业课 60m 100%满额达标）。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === majorLog.id);
if (logIdx >= 0) {
  data.timeLogs[logIdx] = majorLog;
} else {
  data.timeLogs.unshift(majorLog);
}

// Sort timeLogs by startTime descending
data.timeLogs.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// 3. Update Daily Reflection for 2026-11-11
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-11'] = {
  date: '2026-11-11',
  score: 5,
  mood: '🏆 全天文武双全大满贯 · 高效自律',
  summary: '周三全天各项任务全线大满贯！早间 09:10-09:40 听 YouTube 英语 vlog（30m）；09:18-09:40 22分钟内高效收尾完成昨晚剩余党课笔记；上午 10:10-12:40 进驻健身房完成 150 分钟下肢大重量深蹲（120kg×4组）+ 30kg哑铃保加利亚蹲（5组）+ 核心四重奏；随后 12:50-13:40 篮球场 50 分钟高强度专项练习；午餐足量补充白切鸡烧腊与大份生菜，饭后补充97%高纯鱼油+5g一水肌酸，15:00加餐25g坚果稳态供能；下午 15:50-17:20 深度专注 90 分钟攻克习概导论与第一章理论及单选多选刷题（任务二 200% 超额达成）；晚间 21:15-22:15 专注 1 小时高质量完成体育科学研究方法作业（任务三 100% 满额达标）！全天累计有效专注/高强度训练突破 402 分钟（6.7 小时）！',
  achievements: [
    '任务三 (专业课作业): 21:15-22:15 高质量完成体育科学研究方法作业 (60m，日标达成率 100% 满额达标)',
    '任务二 (习概理论与刷题): 15:50-17:20 深入学习导论与第一章 + 导论单选多选题刷题巩固 (90m，日标达成率 200% 超额突破)',
    '健身房大重量下肢抗阻: 10:10-12:40 靠墙静蹲+120kg深蹲4组+30kg保加利亚蹲+核心四重奏 (150m)',
    '篮球专项技术与体能: 12:50-13:40 篮球场专项练习50分钟，力量迁移实战 (50m)',
    '任务一 (英语听力): 09:10-09:40 晨间听YouTube英语vlog磨耳朵 (30m)',
    '日常作业与自主研习: 09:18-09:40 晨间22分钟内高效收尾完成昨晚剩余党课笔记 (22m)',
    '高阶运动营养与补剂超量恢复: 瑞幸冰美式 + 白切鸡烧腊高蛋白高碳水 + 饭后2粒97%高纯鱼油+5g一水肌酸 + 15:00坚果25g'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Wednesday night 60m sports research method assignment!');
