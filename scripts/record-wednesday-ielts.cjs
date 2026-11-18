const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 雅思英语口语表达专项 + 高频核心单词背诵 (90m)
const ieltsTask = {
  id: 'task-ielts-speaking-vocab-20261118',
  categoryId: 'cat-ielts-research',
  title: '雅思英语口语表达专项 + 高频核心单词背诵',
  completed: true,
  targetMinutes: 90,
  actualMinutes: 90,
  estimatedPomodoros: 3,
  completedPomodoros: 3,
  notes: '16:30-18:00 傍晚专注90分钟（达成任务一日标 100%）：系统推进雅思核心学术词汇与高频场景单词深度背诵记忆，结合口语常见话题展开流利度表达、纯正发音与语料连贯性专项训练。',
  createdAt: '2026-11-18T16:30:00.000+08:00',
  completedAt: '2026-11-18T18:00:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === ieltsTask.id);
if (taskIdx >= 0) data.tasks[taskIdx] = ieltsTask;
else data.tasks.unshift(ieltsTask);

// 2. Log: 任务一 雅思学习 (16:30 - 18:00, 90m)
const ieltsLog = {
  id: 'log-20261118-ielts-speaking-vocab',
  taskId: 'task-ielts-speaking-vocab-20261118',
  taskTitle: '任务一: 雅思口语与核心词汇学习 (90分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-18T16:30:00.000+08:00',
  endTime: '2026-11-18T18:00:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '16:30-18:00 傍晚专注90分钟：高效完成雅思高频核心词汇背诵与默写，结合雅思口语话题展开流利度、发音、语料连接与口语即兴表达专项突破。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === ieltsLog.id);
if (logIdx >= 0) data.timeLogs[logIdx] = ieltsLog;
else data.timeLogs.unshift(ieltsLog);

// Sort timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 3. Update reflection for 2026-11-18
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-18'] = {
  date: '2026-11-18',
  score: 5,
  mood: '🔥 图书馆全能攻坚 · 习概与雅思口语双满贯',
  summary: '周三下午至傍晚在图书馆持续高效自习！13:30-15:30 沉浸专注 2 小时（120分钟）高效完成习概第三四章系统复习、第五章深入学习及章节习题；16:30-18:00 紧接着投入 90 分钟全情完成雅思口语流利度训练与核心单词背诵。全天高质量纯学术专注累计达 210 分钟（3.5小时），任务一、任务二双双超额/满分达成！',
  achievements: [
    '任务二 (习概理论深化与习题巩固): 13:30-15:30 第三、四章系统复习 + 第五章新学及配套习题 (120m，日标达成率 267%)',
    '任务一 (雅思口语表达与核心词汇): 16:30-18:00 雅思口语专项训练与高频学术单词背诵 (90m，日标达成率 100%)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Wednesday 16:30-18:00 IELTS speaking & vocab study (90m)!');
console.log('Today total timeLogs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-18')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
