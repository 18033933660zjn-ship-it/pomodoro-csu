const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 雅思基础突破 (60m)
const ieltsTask = {
  id: 'task-ielts-study-20261117',
  categoryId: 'cat-ielts-research',
  title: '雅思基础突破: 核心词汇背写与长难句精读',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '17:30-18:30 傍晚专注60分钟：雅思核心学术词汇背写默写与重点长难句型精析，沉浸式语感输入与学术表达训练。',
  createdAt: '2026-11-17T17:30:00.000+08:00',
  completedAt: '2026-11-17T18:30:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === ieltsTask.id);
if (taskIdx >= 0) data.tasks[taskIdx] = ieltsTask;
else data.tasks.unshift(ieltsTask);

// 2. Log: 任务一 英语学习 (17:30 - 18:30, 60m)
const ieltsLog = {
  id: 'log-20261117-ielts-study',
  taskId: 'task-ielts-study-20261117',
  taskTitle: '任务一: 雅思基础突破 (60分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-17T17:30:00.000+08:00',
  endTime: '2026-11-17T18:30:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:30-18:30 傍晚专注60分钟：雅思核心学术词汇背写默写与重点长难句型精析，沉浸式语感输入与学术表达训练。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === ieltsLog.id);
if (logIdx >= 0) data.timeLogs[logIdx] = ieltsLog;
else data.timeLogs.unshift(ieltsLog);

// Sort timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 3. Update reflection for 2026-11-17
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-17'] = {
  date: '2026-11-17',
  score: 5,
  mood: '📖 专注突破 · 英语词汇长难句攻坚',
  summary: '周二傍晚 17:30-18:30 纯沉浸专注 1 小时（60分钟），系统推进任务一（雅思基础突破）：扎实完成核心学术词汇背写默写与长难句型精读仿写，英语思维与语感沉淀扎实！',
  achievements: [
    '任务一 (雅思基础突破): 17:30-18:30 扎实完成核心词汇背写默写与长难句精读仿写 (60m)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Tuesday 17:30-18:30 IELTS study (60m)!');
