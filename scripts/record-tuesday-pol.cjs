const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Add time log for 2026-11-10
const polLog = {
  id: 'log-20261110-pol-01',
  taskId: 'task-pol-ch6-20261110',
  taskTitle: '学习习概第六章 (45分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-10T10:00:00.000+08:00',
  endTime: '2026-11-10T10:45:00.000+08:00',
  durationMinutes: 45,
  mode: 'manual',
  isExtra: false,
  notes: '10:00-10:45 深入攻坚习概第六章：梳理核心理论要点、关键论述与考点框架'
};

const existingLogIdx = data.timeLogs.findIndex(l => l.id === polLog.id);
if (existingLogIdx >= 0) {
  data.timeLogs[existingLogIdx] = polLog;
} else {
  data.timeLogs.unshift(polLog);
}

// 2. Add completed task
const polTask = {
  id: 'task-pol-ch6-20261110',
  categoryId: 'cat-politics-innovation',
  title: '学习习概第六章 (45分钟)',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 45,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '10:00-10:45 深入攻关习概第六章重点理论考点',
  createdAt: '2026-11-10T10:00:00.000+08:00',
  completedAt: '2026-11-10T10:45:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === polTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = polTask;
} else {
  data.tasks.unshift(polTask);
}

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Tuesday 11-10 10:00-10:45 习概第六章 (45m)!');
