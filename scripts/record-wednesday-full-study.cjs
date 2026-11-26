const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// ==================== 1. 确保周二 (2026-11-24) 习概第十章记录完整 ====================
const polCh10Task = {
  id: 'task-pol-ch10-study-20261124',
  categoryId: 'cat-politics-innovation',
  title: '习概第十章深入研读与配套习题实战巩固',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '18:20-19:20 晚间高专注投入60分钟（达成任务二日标 133%）：系统攻坚《习概》第十章核心理论内容，梳理重大理论论断与关键考点，并高质量完成配套练习题巩固考点记忆。',
  createdAt: '2026-11-24T18:20:00.000+08:00',
  completedAt: '2026-11-24T19:20:00.000+08:00'
};

const polCh10Log = {
  id: 'log-20261124-pol-ch10-study',
  taskId: 'task-pol-ch10-study-20261124',
  taskTitle: '任务二: 习概第十章研学与配套练习 (60分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-24T18:20:00.000+08:00',
  endTime: '2026-11-24T19:20:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '18:20-19:20 晚间专注60分钟（任务二达成率 133%）：全面深入学习《习概》第十章核心考点理论，趁热打铁高质量完成配套练习题巩固自测，做题手感与考点储备双丰收。'
};

if (!data.tasks.find(t => t.id === polCh10Task.id)) data.tasks.unshift(polCh10Task);
if (!data.timeLogs.find(l => l.id === polCh10Log.id)) data.timeLogs.push(polCh10Log);

// ==================== 2. 录入周三 (2026-11-25 昨天) 三大学术自习记录 ====================

// 2.1 任务四: 科研与AI运用的学习 (14:30 - 16:00, 90m)
const researchAiTask = {
  id: 'task-research-ai-20261125',
  categoryId: 'cat-research-advance',
  title: '任务四: 科研学术文献研读与前沿AI工具赋能应用',
  completed: true,
  targetMinutes: 90,
  actualMinutes: 90,
  estimatedPomodoros: 3,
  completedPomodoros: 3,
  notes: '14:30-16:00 下午高专注投入90分钟（1.5小时）：深入学习科研专业文献研读技巧，掌握并实践前沿AI工具在学术检索、文献提炼、数据处理与研究方法学中的高效赋能应用。',
  createdAt: '2026-11-25T14:30:00.000+08:00',
  completedAt: '2026-11-25T16:00:00.000+08:00'
};

const researchAiLog = {
  id: 'log-20261125-research-ai',
  taskId: 'task-research-ai-20261125',
  taskTitle: '任务四: 科研文献与AI工具应用学习 (90分钟)',
  categoryId: 'cat-research-advance',
  categoryName: '任务四: 科研推进 (文献研读与论文写作)',
  categoryColor: '#ec4899',
  categoryIcon: 'FileText',
  startTime: '2026-11-25T14:30:00.000+08:00',
  endTime: '2026-11-25T16:00:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '14:30-16:00 下午高专注投入90分钟：系统研学科研前沿方法论，深入探索并实操AI技术赋能学术科研的高效工作流。'
};

// 2.2 任务二: 习概第十一章学习 (17:00 - 18:30, 90m)
const polCh11Task = {
  id: 'task-pol-ch11-study-20261125',
  categoryId: 'cat-politics-innovation',
  title: '习概第十一章核心理论深入研读与考点梳理',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 90,
  estimatedPomodoros: 2,
  completedPomodoros: 3,
  notes: '17:00-18:30 傍晚连续沉浸专注90分钟（达成任务二日标 200%）：全面攻坚《习概》第十一章理论体系，系统梳理核心考点、重大理论论断与框架脉络。',
  createdAt: '2026-11-25T17:00:00.000+08:00',
  completedAt: '2026-11-25T18:30:00.000+08:00'
};

const polCh11Log = {
  id: 'log-20261125-pol-ch11-study',
  taskId: 'task-pol-ch11-study-20261125',
  taskTitle: '任务二: 习概第十一章深入研读 (90分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-25T17:00:00.000+08:00',
  endTime: '2026-11-25T18:30:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:00-18:30 傍晚专注90分钟（任务二达成率 200%）：全面研读《习概》第十一章核心理论观点，强化政治理论思维与重大考点储备。'
};

// 2.3 任务一: 英语学习 (21:00 - 22:00, 60m)
const ieltsTask = {
  id: 'task-ielts-study-20261125',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 核心词汇记忆与学术综合读写精进',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '21:00-22:00 晚间高专注完成1小时：系统推进英语学习，落实核心学术词汇背写默写与长难句读写综合训练。',
  createdAt: '2026-11-25T21:00:00.000+08:00',
  completedAt: '2026-11-25T22:00:00.000+08:00'
};

const ieltsLog = {
  id: 'log-20261125-ielts-study',
  taskId: 'task-ielts-study-20261125',
  taskTitle: '任务一: 英语核心词汇与综合读写 (60分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-25T21:00:00.000+08:00',
  endTime: '2026-11-25T22:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '21:00-22:00 晚间专注60分钟：系统推进英语学习，进行核心词汇巩固与长难句型拆解，保持高效英语语感与学术表达输入。'
};

[researchAiTask, polCh11Task, ieltsTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

[researchAiLog, polCh11Log, ieltsLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.push(l);
});

// 2.4 融合更新周三 (2026-11-25) 日度复盘
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-25'] = {
  date: '2026-11-25',
  score: 5,
  mood: '🏊‍♂️📖 700m排酸+240m学术大爆发 · 习概11章与科研AI突破',
  summary: '周三文武双丰收！早8点游泳课完成700m蛙自排酸(35m)，全天饮食严控~1,870kcal、~153g蛋白(1.61g/kg)稳斩~690-780kcal净减脂缺口；下午至晚间学术自习全面爆发：14:30-16:00深入研学科研与AI运用(90m)，17:00-18:30沉浸攻克《习概》第11章理论(90m，达成率200%)，21:00-22:00稳健完成1小时英语综合精进！全天纯学术专注达240分钟（4.0小时），科研、政治、英语全线大捷！',
  achievements: [
    '任务四 (科研与AI深度结合): 14:30-16:00 深入研学科研方法论与前沿AI学术应用 (90m)',
    '任务二 (习概第11章全新理论攻坚): 17:00-18:30 深入研读第十一章核心理论与考点梳理 (90m，达成率 200%)',
    '任务一 (英语基础读写与词汇攻坚): 21:00-22:00 晚间高专注英语综合学习 (60m)',
    '早间游泳恢复: 08:00-08:35 完成 600m蛙泳 + 100m自由泳 (35m)',
    '控脂执行升级: 晚餐省去高脂香肠保留卤鸡排，全天脂肪仅69g且蛋白达153g(1.61g/kg)'
  ]
};

// 排序所有 timeLogs
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Tuesday Chapter 10 and Wednesday full study sessions!');
console.log('Tuesday 11-24 logs:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-24')).map(l => ({ id: l.id, cat: l.categoryId, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
console.log('Wednesday 11-25 logs:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-25')).map(l => ({ id: l.id, cat: l.categoryId, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
