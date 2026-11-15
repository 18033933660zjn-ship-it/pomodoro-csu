const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 晨间英语vlog
const vlogTask = {
  id: 'task-ielts-vlog-20261115',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 晨间 YouTube 英语 Vlog 精听磨耳朵',
  completed: true,
  targetMinutes: 30,
  actualMinutes: 30,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '10:00-10:30 晨间专注听英语vlog 30分钟，强化日常与学术口语听力理解，纯正语感输入磨耳朵。',
  createdAt: '2026-11-15T10:00:00.000+08:00',
  completedAt: '2026-11-15T10:30:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === vlogTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = vlogTask;
} else {
  data.tasks.unshift(vlogTask);
}

// 2. Log: 晨间英语vlog (30m)
const vlogLog = {
  id: 'log-20261115-ielts-vlog',
  taskId: 'task-ielts-vlog-20261115',
  taskTitle: '任务一: 晨间听YouTube英语vlog (30分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-15T10:00:00.000+08:00',
  endTime: '2026-11-15T10:30:00.000+08:00',
  durationMinutes: 30,
  mode: 'pomodoro',
  isExtra: false,
  notes: '10:00-10:30 晨间专注听英语vlog 30分钟，强化日常与学术口语听力理解，沉浸式语感输入磨耳朵。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === vlogLog.id);
if (logIdx >= 0) {
  data.timeLogs[logIdx] = vlogLog;
} else {
  data.timeLogs.unshift(vlogLog);
}

// Sort timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 3. Update reflection for 2026-11-15
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-15'] = {
  date: '2026-11-15',
  score: 5,
  mood: '📖 双核稳进 · 英语与理论高效推进',
  summary: '周日学术研习推进扎实！早间 10:00-10:30 专注听英语 vlog 30分钟（任务一语感输入与口语磨耳朵）；午后 12:30-14:30 连续专注 2 小时（120分钟）系统攻关《习概》第二章与第三章内容学习及配套练习题（任务二达成率 267%）！全天累计有效研习 150 分钟（2.5 小时）！',
  achievements: [
    '任务一 (英语听力): 10:00-10:30 晨间听英语vlog磨耳朵 (30m)',
    '任务二 (习概理论与刷题): 12:30-14:30 完成第二章、第三章内容学习与练习题 (120m，日标达成率 267%)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Sunday morning English vlog session!');
