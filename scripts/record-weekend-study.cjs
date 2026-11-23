const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// ==================== 1. 周六 (2026-11-21) 纠偏与补全 ====================

// 1.1 Task: 习概第八章 (16:00-17:30, 90m)
const satPolTask = {
  id: 'task-pol-ch8-20261121',
  categoryId: 'cat-politics-innovation',
  title: '习概第八章核心理论深入研读与考点梳理',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 90,
  estimatedPomodoros: 2,
  completedPomodoros: 3,
  notes: '16:00-17:30 下午高专注投入90分钟（任务二日标达成率 200%）：全面攻坚《习概》第八章核心理论考点、重大命题与知识框架。',
  createdAt: '2026-11-21T16:00:00.000+08:00',
  completedAt: '2026-11-21T17:30:00.000+08:00'
};

// 1.2 Task: 英语学习 (18:30-19:30, 60m)
const satIeltsTask = {
  id: 'task-ielts-20261121-evening',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 核心词汇背写与读写巩固',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '18:30-19:30 晚间高专注完成1小时英语词汇背写与读写综合训练。',
  createdAt: '2026-11-21T18:30:00.000+08:00',
  completedAt: '2026-11-21T19:30:00.000+08:00'
};

// 1.3 Task: 科研学习 (19:30-20:30, 60m)
const satResearchTask = {
  id: 'task-research-study-20261121',
  categoryId: 'cat-research-advance',
  title: '任务四: 科研学术文献精读与方法学研习',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '19:30-20:30 晚间专注60分钟（衔接英语时段连贯推进）：深入研读科研前沿文献、梳理学术方法学与前沿进展。',
  createdAt: '2026-11-21T19:30:00.000+08:00',
  completedAt: '2026-11-21T20:30:00.000+08:00'
};

// 移除周六旧的预填任务 (如有)
data.tasks = data.tasks.filter(t => t.id !== 'task-ielts-20261121-afternoon');

[satPolTask, satIeltsTask, satResearchTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

// 1.4 TimeLogs for Saturday (2026-11-21)
const satPolLog = {
  id: 'log-20261121-pol-ch8',
  taskId: 'task-pol-ch8-20261121',
  taskTitle: '任务二: 习概第八章深入学习 (90分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-21T16:00:00.000+08:00',
  endTime: '2026-11-21T17:30:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '16:00-17:30 下午高专注投入90分钟（达成任务二日标 200%）：系统完成《习概》第八章核心考点研学与理论框架梳理。'
};

const satIeltsLog = {
  id: 'log-20261121-ielts-study',
  taskId: 'task-ielts-20261121-evening',
  taskTitle: '任务一: 英语基础读写与词汇巩固 (60分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-21T18:30:00.000+08:00',
  endTime: '2026-11-21T19:30:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '18:30-19:30 晚间高专注投入60分钟：推进英语学习，落实核心词汇背写与英语句型精读。'
};

const satResearchLog = {
  id: 'log-20261121-research-study',
  taskId: 'task-research-study-20261121',
  taskTitle: '任务四: 科研文献精读与方法研学 (60分钟)',
  categoryId: 'cat-research-advance',
  categoryName: '任务四: 科研推进 (文献研读与论文写作)',
  categoryColor: '#ec4899',
  categoryIcon: 'FileText',
  startTime: '2026-11-21T19:30:00.000+08:00',
  endTime: '2026-11-21T20:30:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '19:30-20:30 晚间专注60分钟（紧跟英语时段连贯推进）：深入研读科研专业文献，提炼研究方法论与学术前沿知识。'
};

[satPolLog, satIeltsLog, satResearchLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.push(l);
});

// 1.5 Update Reflection for 2026-11-21
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-21'] = {
  date: '2026-11-21',
  score: 5,
  mood: '🔥 文武双全 · 下肢重装+习概八章+英语科研三科大捷',
  summary: '周六高能全天：上午10:30-12:45完成下肢重装深蹲140kg+零间歇递减组(4,040kg)+50次PAP跳+保加利亚蹲+后链核心(135m)，13:00紧接40m投篮。下午16:00-17:30高质攻克习概第八章核心理论(90m，达成率200%)；晚间18:30-19:30完成60m英语学习；19:30-20:30紧接着投入60m科研文献精读！全天有效运动175m+纯学术专注210m（合计385分钟/6.4小时），减脂增肌与学业双线大丰收！',
  achievements: [
    '下肢极限突破: 10:30-12:45 深蹲140kg+零间歇递减(4,040kg)+50次PAP跳+保加利亚蹲+后链核心 (135m)',
    '疲劳投篮校准: 13:00-13:40 下肢轰炸后完成40分钟低强度投篮',
    '任务二 (习概第八章系统研学): 16:00-17:30 完成习概第八章核心理论研习与框架梳理 (90m，达成率 200%)',
    '任务一 (英语专注突破): 18:30-19:30 晚间英语基础读写与词汇攻坚 (60m)',
    '任务四 (科研文献研学): 19:30-20:30 科研文献深度精读与方法学研习 (60m)',
    '蛋白天花板: 全天吃到~242g优质蛋白（2.55 g/kg）且晚餐控制在2/5米饭'
  ]
};

// ==================== 2. 周日 (2026-11-22) 新增记录 ====================

// 2.1 Task: 英语学习 (16:00-17:00, 60m)
const sunIeltsTask = {
  id: 'task-ielts-study-20261122',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 核心词汇记忆与英语综合研习',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '16:00-17:00 下午高专注投入60分钟：推进英语学习，落实核心词汇与学术英语读写表达。',
  createdAt: '2026-11-22T16:00:00.000+08:00',
  completedAt: '2026-11-22T17:00:00.000+08:00'
};

// 2.2 Task: 习概4-8章复习 (17:30-19:30, 120m)
const sunPolTask = {
  id: 'task-pol-ch4-8-review-20261122',
  categoryId: 'cat-politics-innovation',
  title: '习概第四至八章全脉络系统复盘与串联巩固',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 120,
  estimatedPomodoros: 2,
  completedPomodoros: 4,
  notes: '17:30-19:30 傍晚连续沉浸专注2小时（120分钟，任务二日标达成率 267%）：横跨第4章至第8章进行宏观全景式系统大复盘，打通各章逻辑关隘，深度串联核心考点、重点理论框架与关键命题。',
  createdAt: '2026-11-22T17:30:00.000+08:00',
  completedAt: '2026-11-22T19:30:00.000+08:00'
};

[sunIeltsTask, sunPolTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

// 2.3 TimeLogs for Sunday (2026-11-22)
const sunIeltsLog = {
  id: 'log-20261122-ielts-study',
  taskId: 'task-ielts-study-20261122',
  taskTitle: '任务一: 英语核心词汇与综合研学 (60分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-22T16:00:00.000+08:00',
  endTime: '2026-11-22T17:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '16:00-17:00 下午专注60分钟：系统推进英语学习，完成核心词汇背诵与长难句理解，保持每日英语语感高频在线。'
};

const sunPolLog = {
  id: 'log-20261122-pol-ch4-8-review',
  taskId: 'task-pol-ch4-8-review-20261122',
  taskTitle: '任务二: 习概第四至八章系统大复盘 (120分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-22T17:30:00.000+08:00',
  endTime: '2026-11-22T19:30:00.000+08:00',
  durationMinutes: 120,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:30-19:30 傍晚纯沉浸专注120分钟（达成任务二日标 267%）：全面完成《习概》第4-8章知识点大串联复习，建立扎实的跨章节理论思维框架。'
};

[sunIeltsLog, sunPolLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.push(l);
});

// 2.4 Update Reflection for 2026-11-22
data.reflections['2026-11-22'] = {
  date: '2026-11-22',
  score: 5,
  mood: '📖 理论大贯通 · 习概五章大串联 + 英语稳步推进',
  summary: '周日下午至傍晚专注效率极高！16:00-17:00 投入60分钟稳健完成英语综合研习；17:30-19:30 紧接着沉浸专注2小时（120分钟）完成《习概》第4章到第8章的大体量横向系统复盘，打通多章节核心考点脉络（任务二达成率高达267%）！全天纯学术专注达180分钟（3.0小时），周末两日自习总产出极为扎实！',
  achievements: [
    '任务二 (习概五章宏观大串联): 17:30-19:30 系统复盘第4-8章核心考点与理论架构 (120m，达成率 267%)',
    '任务一 (英语基础突破): 16:00-17:00 英语词汇与学术读写综合学习 (60m)'
  ]
};

// Sort all timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Saturday (11-21) and Sunday (11-22) study sessions!');
console.log('Saturday logs:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-21')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
console.log('Sunday logs:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-22')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
