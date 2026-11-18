const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 习概第三四章系统复习 + 第五章新学与习题实战 (120m)
const polTask = {
  id: 'task-pol-ch5-study-20261118',
  categoryId: 'cat-politics-innovation',
  title: '习概第三四章系统复习 + 第五章深入学习与配套习题',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 120,
  estimatedPomodoros: 2,
  completedPomodoros: 4,
  notes: '13:30-15:30 图书馆专注2小时（120分钟，任务二日标达成率 267%）：系统复盘回顾第三章与第四章核心考点脉络，深入攻坚第五章重要理论与概念框架，并高质量完成配套章节习题，强化考点记忆与做题实战手感。',
  createdAt: '2026-11-18T13:30:00.000+08:00',
  completedAt: '2026-11-18T15:30:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === polTask.id);
if (taskIdx >= 0) data.tasks[taskIdx] = polTask;
else data.tasks.unshift(polTask);

// 2. Log: 任务二 习概学习 (13:30 - 15:30, 120m)
const polLog = {
  id: 'log-20261118-pol-ch5-study',
  taskId: 'task-pol-ch5-study-20261118',
  taskTitle: '任务二: 习概第三四章复习 + 第五章深入学习与习题实战 (120分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-18T13:30:00.000+08:00',
  endTime: '2026-11-18T15:30:00.000+08:00',
  durationMinutes: 120,
  mode: 'pomodoro',
  isExtra: false,
  notes: '13:30-15:30 图书馆专注2小时（120分钟，任务二达成率 267%）：高效完成第三章和第四章知识点系统复习，深入研读第五章核心理论，并趁热打铁完成配套习题练习，强化考点记忆与做题手感。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === polLog.id);
if (logIdx >= 0) data.timeLogs[logIdx] = polLog;
else data.timeLogs.unshift(polLog);

// Sort timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 3. Update reflection for 2026-11-18
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-18'] = {
  date: '2026-11-18',
  score: 5,
  mood: '🔥 图书馆高效攻坚 · 习概理论与习题双突破',
  summary: '周三下午 13:20 到达图书馆，13:30-15:30 纯沉浸专注 2 小时（120分钟），高效完成任务二（习概与双创导论）：系统复盘第三章与第四章核心考点，深入攻克第五章理论要点并高质量刷完章节习题，理论研读与实战解题紧密结合（达成率 267%）！',
  achievements: [
    '任务二 (习概理论深化与习题巩固): 13:30-15:30 第三、四章系统复习 + 第五章新学及配套习题 (120m，日标达成率 267%)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Wednesday 13:30-15:30 Xi Gai study (120m)!');
