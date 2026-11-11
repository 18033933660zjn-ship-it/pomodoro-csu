const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Yesterday (2026-11-10) 2 hours English vlog (cat-ielts-research)
const yesterdayVlogLog = {
  id: 'log-20261110-ielts-vlog',
  taskId: 'task-ielts-vlog-20261110',
  taskTitle: '任务一: 听YouTube英语vlog (120分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-10T20:00:00.000+08:00',
  endTime: '2026-11-10T22:00:00.000+08:00',
  durationMinutes: 120,
  mode: 'pomodoro',
  isExtra: false,
  notes: '周二晚间在完成日常作业研习同时进行：听YouTube英语vlog 2小时（120分钟），原汁原味语感浸润、日常学术口语听力磨耳朵。'
};

const yesterdayVlogTask = {
  id: 'task-ielts-vlog-20261110',
  categoryId: 'cat-ielts-research',
  title: '英语突破: YouTube 英语 Vlog 泛听与日常学术表达精进',
  completed: true,
  targetMinutes: 120,
  actualMinutes: 120,
  estimatedPomodoros: 4,
  completedPomodoros: 4,
  notes: '周二晚间同步进行：听YouTube英语vlog 2小时（120分钟），进行沉浸式语感输入与日常学术口语听力精进',
  createdAt: '2026-11-10T20:00:00.000+08:00',
  completedAt: '2026-11-10T22:00:00.000+08:00'
};

// 2. Today (2026-11-11) 09:10-09:40 English vlog (cat-ielts-research)
const todayVlogLog = {
  id: 'log-20261111-ielts-vlog',
  taskId: 'task-ielts-vlog-20261111',
  taskTitle: '任务一: 晨间听YouTube英语vlog (30分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-11T09:10:00.000+08:00',
  endTime: '2026-11-11T09:40:00.000+08:00',
  durationMinutes: 30,
  mode: 'pomodoro',
  isExtra: false,
  notes: '09:10-09:40 晨间听YouTube英语vlog 30分钟，沉浸式语感输入与高频生活学术口语磨耳朵。'
};

const todayVlogTask = {
  id: 'task-ielts-vlog-20261111',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 晨间 YouTube 英语 Vlog 精听磨耳朵',
  completed: true,
  targetMinutes: 30,
  actualMinutes: 30,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '09:10-09:40 晨间英语vlog精听泛听30分钟，沉浸式语感输入与日常学术口语听力',
  createdAt: '2026-11-11T09:10:00.000+08:00',
  completedAt: '2026-11-11T09:40:00.000+08:00'
};

// 3. Today (2026-11-11) 22m party notes finish (cat-homework-custom)
const todayPartyNotesLog = {
  id: 'log-20261111-party-notes-finish',
  taskId: 'task-party-notes-complete-20261111',
  taskTitle: '日常作业: 完成昨晚剩下的党课笔记 (22分钟)',
  categoryId: 'cat-homework-custom',
  categoryName: '日常作业与自主研习',
  categoryColor: '#06b6d4',
  categoryIcon: 'BookMarked',
  startTime: '2026-11-11T09:18:00.000+08:00',
  endTime: '2026-11-11T09:40:00.000+08:00',
  durationMinutes: 22,
  mode: 'pomodoro',
  isExtra: false,
  notes: '09:18-09:40 晨间自主研习22分钟：高效收尾并全面完成昨晚未完结的党课笔记，完成全篇理论提炼与心得整理。'
};

const todayPartyNotesTask = {
  id: 'task-party-notes-complete-20261111',
  categoryId: 'cat-homework-custom',
  title: '日常作业: 完成昨晚剩下的党课笔记',
  completed: true,
  targetMinutes: 22,
  actualMinutes: 22,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '晨间22分钟内高效收尾：全面完成昨晚剩下的党课上课理论学习笔记与心得体会',
  createdAt: '2026-11-11T09:18:00.000+08:00',
  completedAt: '2026-11-11T09:40:00.000+08:00'
};

// Insert or update timeLogs
const newLogs = [todayPartyNotesLog, todayVlogLog, yesterdayVlogLog];
newLogs.forEach(newLog => {
  const idx = data.timeLogs.findIndex(l => l.id === newLog.id);
  if (idx >= 0) {
    data.timeLogs[idx] = newLog;
  } else {
    data.timeLogs.unshift(newLog);
  }
});

// Insert or update tasks
const newTasks = [todayPartyNotesTask, todayVlogTask, yesterdayVlogTask];
newTasks.forEach(newTask => {
  const idx = data.tasks.findIndex(t => t.id === newTask.id);
  if (idx >= 0) {
    data.tasks[idx] = newTask;
  } else {
    data.tasks.unshift(newTask);
  }
});

// Update reflections
if (!data.reflections) data.reflections = {};

data.reflections['2026-11-10'] = {
  date: '2026-11-10',
  score: 5,
  mood: '🔥 全天高效攻坚 · 四维满额达标',
  summary: '周二全天高质高效推进！上午 10:00-10:45 攻坚习概第六章（45m 任务二 100%达标）；下午 14:37-15:37 沉浸 60 分钟高质完成国际篮联三人执裁与违体犯规分类专业课作业（60m 任务三 100%达标）；晚间 20:00-22:00 持续投入 2 小时专注完成党课上课笔记整理（120m），并同步听 YouTube 英语 vlog 2小时（120m 任务一 133% 超额达标），全天累计深度专注达到 345 分钟（5.75小时）！',
  achievements: [
    '任务一 (英语突破): 20:00-22:00 听YouTube英语vlog 2小时 (120m，超额达成日标 133%)',
    '任务二 (习概理论): 10:00-10:45 深入学习习概第六章核心考点 (45m，日标达标 100%)',
    '任务三 (专业课作业): 14:37-15:37 完成国际篮联三人执裁响哨后换位与违体犯规分类作业 (60m，日标达标 100%)',
    '日常作业与自主研习: 20:00-22:00 晚间专注2小时写党课上课笔记 (120m，深度整理党课理论要点与心得)'
  ]
};

data.reflections['2026-11-11'] = {
  date: '2026-11-11',
  score: 5,
  mood: '⚡ 晨间利落开局 · 双线高效推进',
  summary: '周三晨间利落开局！09:10-09:40 专注听取 YouTube 英语 vlog 30分钟（任务一语感输入）；同时在 22 分钟内利落收尾昨晚剩下的党课上课笔记，日常作业全面清零！',
  achievements: [
    '任务一 (英语听力): 09:10-09:40 晨间听YouTube英语vlog磨耳朵 (30m)',
    '日常作业与自主研习: 09:18-09:40 晨间22分钟内高效收尾完成昨晚剩余党课笔记 (22m)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded yesterday vlog (120m), today vlog (30m), and today party notes finish (22m)!');
