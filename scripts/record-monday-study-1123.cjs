const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Tasks
// 1.1 科研文献学习 (16:30 - 17:00, 30m)
const researchTask = {
  id: 'task-research-study-20261123',
  categoryId: 'cat-research-advance',
  title: '任务四: 科研学术文献精读与方法学研习',
  completed: true,
  targetMinutes: 30,
  actualMinutes: 30,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '16:30-17:00 下午专注30分钟：深入精读学术前沿文献，提炼研究方法论与学术理论前沿要点。',
  createdAt: '2026-11-23T16:30:00.000+08:00',
  completedAt: '2026-11-23T17:00:00.000+08:00'
};

// 1.2 习概第九章 (17:00 - 18:30, 90m)
const polTask = {
  id: 'task-pol-ch9-study-20261123',
  categoryId: 'cat-politics-innovation',
  title: '习概第九章核心理论深入研读与考点梳理',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 90,
  estimatedPomodoros: 2,
  completedPomodoros: 3,
  notes: '17:00-18:30 傍晚连续沉浸专注90分钟（达成任务二日标 200%）：全面攻坚《习概》第九章核心理论，系统梳理关键命题、重大理论论断与章节考点脉络。',
  createdAt: '2026-11-23T17:00:00.000+08:00',
  completedAt: '2026-11-23T18:30:00.000+08:00'
};

// 1.3 英语阅读文章 (21:30 - 22:10, 40m)
const ieltsTask = {
  id: 'task-ielts-reading-20261123',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 英文文章长难句沉浸精读与语感拓展',
  completed: true,
  targetMinutes: 40,
  actualMinutes: 40,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '21:30-22:10 晚间高专注投入40分钟：精读优质原版英文文章，强化长难句解构、学术词汇语境理解与阅读抓取速度，深度沉淀英语思维。',
  createdAt: '2026-11-23T21:30:00.000+08:00',
  completedAt: '2026-11-23T22:10:00.000+08:00'
};

[researchTask, polTask, ieltsTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

// 2. TimeLogs
const researchLog = {
  id: 'log-20261123-research-study',
  taskId: 'task-research-study-20261123',
  taskTitle: '任务四: 科研文献精读研学 (30分钟)',
  categoryId: 'cat-research-advance',
  categoryName: '任务四: 科研推进 (文献研读与论文写作)',
  categoryColor: '#ec4899',
  categoryIcon: 'FileText',
  startTime: '2026-11-23T16:30:00.000+08:00',
  endTime: '2026-11-23T17:00:00.000+08:00',
  durationMinutes: 30,
  mode: 'pomodoro',
  isExtra: false,
  notes: '16:30-17:00 下午专注30分钟：深入精读专业科研文献，梳理前沿学术方法论与论文结构脉络。'
};

const polLog = {
  id: 'log-20261123-pol-ch9-study',
  taskId: 'task-pol-ch9-study-20261123',
  taskTitle: '任务二: 习概第九章深入研读 (90分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-23T17:00:00.000+08:00',
  endTime: '2026-11-23T18:30:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:00-18:30 傍晚专注90分钟（达成任务二日标 200%）：系统完成《习概》第九章理论学习，提炼核心论断与重大观点，强化政治理论思维与考点储备。'
};

const ieltsLog = {
  id: 'log-20261123-ielts-reading',
  taskId: 'task-ielts-reading-20261123',
  taskTitle: '任务一: 英文文章精读与学术阅读 (40分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-23T21:30:00.000+08:00',
  endTime: '2026-11-23T22:10:00.000+08:00',
  durationMinutes: 40,
  mode: 'pomodoro',
  isExtra: false,
  notes: '21:30-22:10 晚间专注40分钟：研读英文原版文章，提升学术词汇理解、长句语法分析与纯正英语语感。'
};

[researchLog, polLog, ieltsLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.unshift(l);
});

// Sort timeLogs descending by startTime
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 3. Update Reflection for 2026-11-23
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-23'] = {
  date: '2026-11-23',
  score: 5,
  mood: '🔥 周一开门红 · 习概第九章通关 + 科研英语双线精进',
  summary: '周一学业推进节奏紧凑高效！下午16:30-17:00专注30分钟深读科研学术文献；紧接着17:00-18:30沉浸专注90分钟强势攻克《习概》第九章全新理论体系（任务二日标达成率200%）；晚间21:30-22:10投入40分钟精读英文原版文章，长难句解构与阅读语感扎实提升！全天纯学术专注达160分钟（2小时40分钟），新一周开局稳健充实！',
  achievements: [
    '任务二 (习概第九章全新理论攻坚): 17:00-18:30 深入研读第九章核心理论与考点梳理 (90m，达成率 200%)',
    '任务一 (英语文章沉浸精读): 21:30-22:10 原版英文文章长难句精读与学术语感训练 (40m)',
    '任务四 (科研前沿文献精读): 16:30-17:00 深入研读专业文献与前沿学术方法论 (30m)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Monday (11-23) study sessions!');
console.log('Monday 11-23 total timeLogs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-23')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
