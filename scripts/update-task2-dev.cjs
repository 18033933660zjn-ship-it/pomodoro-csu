const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Remove old log log-1794124886301
data.timeLogs = data.timeLogs.filter(l => l.id !== 'log-1794124886301');

// 2. Add to deletedLogIds
if (!data.deletedLogIds) data.deletedLogIds = [];
if (!data.deletedLogIds.includes('log-1794124886301')) {
  data.deletedLogIds.push('log-1794124886301');
}

// 3. Add or update the exact 1-hour log
const newLog = {
  id: 'log-20261108-pol-dev',
  taskId: 'task-pol-dev-01',
  taskTitle: '完成发展对象学习体会',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-08T15:00:00.000+08:00',
  endTime: '2026-11-08T16:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '下午专注 60 分钟：完成发展对象学习体会撰写与思想汇报总结'
};

// Check if already present
const existingLogIdx = data.timeLogs.findIndex(l => l.id === newLog.id);
if (existingLogIdx >= 0) {
  data.timeLogs[existingLogIdx] = newLog;
} else {
  data.timeLogs.unshift(newLog);
}

// 4. Ensure task exists in tasks list
const newTask = {
  id: 'task-pol-dev-01',
  categoryId: 'cat-politics-innovation',
  title: '完成发展对象学习体会',
  completed: true,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  targetMinutes: 60,
  actualMinutes: 60,
  notes: '完成发展对象学习体会撰写与思想汇报总结',
  createdAt: '2026-11-08T15:00:00.000+08:00',
  completedAt: '2026-11-08T16:00:00.000+08:00'
};

const existingTaskIdx = data.tasks.findIndex(t => t.id === newTask.id);
if (existingTaskIdx >= 0) {
  data.tasks[existingTaskIdx] = newTask;
} else {
  data.tasks.unshift(newTask);
}

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated storage.json with new 60-minute task 2 log: 完成发展对象学习体会');
