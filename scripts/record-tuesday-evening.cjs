const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Add log-20261110-party-notes
const logId = 'log-20261110-party-notes';
const logIdx = data.timeLogs.findIndex(l => l.id === logId);

const eveningLog = {
  id: logId,
  taskId: 'task-party-notes-20261110',
  taskTitle: '日常研习: 写党课上课笔记 (120分钟)',
  categoryId: 'cat-homework-custom',
  categoryName: '日常作业与自主研习',
  categoryColor: '#06b6d4',
  categoryIcon: 'BookMarked',
  startTime: '2026-11-10T20:00:00.000+08:00',
  endTime: '2026-11-10T22:00:00.000+08:00',
  durationMinutes: 120,
  mode: 'pomodoro',
  isExtra: false,
  notes: '20:00-22:00 晚间深度专注2小时（120分钟）：系统撰写整理党课上课理论学习笔记，梳理党的性质宗旨、指导思想与重大理论成果，紧密结合发展对象标准提炼学习心得体会。'
};

if (logIdx >= 0) {
  data.timeLogs[logIdx] = eveningLog;
} else {
  // Put at the very beginning of timeLogs
  data.timeLogs.unshift(eveningLog);
}

// 2. Add / update task
const partyTask = {
  id: 'task-party-notes-20261110',
  categoryId: 'cat-homework-custom',
  title: '写党课上课笔记',
  completed: true,
  targetMinutes: 120,
  actualMinutes: 120,
  estimatedPomodoros: 4,
  completedPomodoros: 4,
  notes: '晚间自主研习2小时：系统整理党课上课学习笔记与心得体会',
  createdAt: '2026-11-10T20:00:00.000+08:00',
  completedAt: '2026-11-10T22:00:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === partyTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = partyTask;
} else {
  data.tasks.unshift(partyTask);
}

// 3. Update Daily Reflection for 2026-11-10
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-10'] = {
  date: '2026-11-10',
  score: 5,
  mood: '🔥 全天高效攻坚 · 三维齐头并进',
  summary: '周二全天高质高效推进！上午 10:00-10:45 攻坚习概第六章（45m 任务二 100%达标）；下午 14:37-15:37 沉浸 60 分钟高质完成国际篮联三人执裁与违体犯规分类专业课作业（60m 任务三 100%达标）；晚间 20:00-22:00 持续投入 2 小时专注完成党课上课笔记整理（120m），全天累计深度专注 225 分钟（3.75小时）！',
  achievements: [
    '任务二 (习概理论): 10:00-10:45 深入学习习概第六章核心考点 (45m，日标达标 100%)',
    '任务三 (专业课作业): 14:37-15:37 完成国际篮联三人执裁响哨后换位与违体犯规分类作业 (60m，日标达标 100%)',
    '日常作业与自主研习: 20:00-22:00 晚间专注2小时写党课上课笔记 (120m，深度整理党课理论要点与心得)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Tuesday evening 2-hour party notes study session (120m)!');
