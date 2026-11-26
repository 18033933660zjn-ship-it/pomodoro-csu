const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 习概第十章深入研读与配套习题 (60m)
const polTask = {
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

const taskIdx = data.tasks.findIndex(t => t.id === polTask.id);
if (taskIdx >= 0) data.tasks[taskIdx] = polTask;
else data.tasks.unshift(polTask);

// 2. Log: 任务二 习概第十章 (18:20 - 19:20, 60m)
const polLog = {
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

const logIdx = data.timeLogs.findIndex(l => l.id === polLog.id);
if (logIdx >= 0) data.timeLogs[logIdx] = polLog;
else data.timeLogs.unshift(polLog);

// 3. Update Reflection for 2026-11-24
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-24'] = {
  date: '2026-11-24',
  score: 5,
  mood: '🔥 文武双全 · 自传抄写+习概第十章通关+4km跑跳拉练',
  summary: '周二学业政工、政治理论与体能拉练全线丰收！下午14:00-15:30专注90分钟完成发展对象个人自传工整抄写与材料归档；16:00-16:41完成4000米变速跑(21m)+20分钟蛙跳与直腿弹性跳(41m)；晚间18:20-19:20紧接着沉浸专注60分钟攻克《习概》第十章核心理论与配套练习题（任务二达成率133%）！全天纯学术专注150分钟+体能41分钟（总产出191分钟），饮食与减脂缺口执行优秀！',
  achievements: [
    '任务二 (习概第十章理论与习题通关): 18:20-19:20 深入研读第十章核心考点并完成配套练习题 (60m，达成率 133%)',
    '日常研习 (发展对象重要材料完结): 14:00-15:30 纯专注工整抄写完成发展对象个人自传 (90m)',
    '户外体能与弹跳突破: 16:00-16:41 4000米变速跑(21m) + 蛙跳与直腿弹性跳(20m)',
    '饮食与减脂缺口: 全天~154g优质蛋白(1.62g/kg)，三餐健康搭配，稳守~695-845kcal黄金减脂缺口'
  ]
};

// Sort all timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Tuesday 18:20-19:20 Xi Gai Chapter 10 study & exercises (60m)!');
console.log('Tuesday total logs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-24')).map(l => ({ id: l.id, cat: l.categoryId, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
