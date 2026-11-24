const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// ==================== 1. 补录周一 (2026-11-23) 任务三 体育科研方法课内作业 (19:00-20:00, 60m) ====================
const majorTask = {
  id: 'task-major-homework-20261123',
  categoryId: 'cat-major-courses',
  title: '任务三: 体育科学研究方法课内作业攻坚',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '19:00-20:00 晚间高专注完成1小时：扎实推进《体育科学研究方法》课内专业作业，结合方法学文献与研究设计规范完成作业撰写。',
  createdAt: '2026-11-23T19:00:00.000+08:00',
  completedAt: '2026-11-23T20:00:00.000+08:00'
};

const majorTaskIdx = data.tasks.findIndex(t => t.id === majorTask.id);
if (majorTaskIdx >= 0) data.tasks[majorTaskIdx] = majorTask;
else data.tasks.unshift(majorTask);

const majorLog = {
  id: 'log-20261123-major-homework',
  taskId: 'task-major-homework-20261123',
  taskTitle: '任务三: 体育科研方法课内作业 (60分钟)',
  categoryId: 'cat-major-courses',
  categoryName: '任务三: 体育专业课三科',
  categoryColor: '#3b82f6',
  categoryIcon: 'Code',
  startTime: '2026-11-23T19:00:00.000+08:00',
  endTime: '2026-11-23T20:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '19:00-20:00 晚间专注60分钟：高效完成《体育科研方法》课内专业作业，梳理研究设计与科研方法学考点。'
};

const majorLogIdx = data.timeLogs.findIndex(l => l.id === majorLog.id);
if (majorLogIdx >= 0) data.timeLogs[majorLogIdx] = majorLog;
else data.timeLogs.push(majorLog);

// 融合更新周一 (2026-11-23) 日度复盘
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-23'] = {
  date: '2026-11-23',
  score: 5,
  mood: '🔥 四线大满贯 · 习概九章+体育科研方法+英语+159g蛋白闭环',
  summary: '周一文武全面开花！不仅在饮食上严守16/8两餐节律，摄入159g高蛋白(1.67g/kg)、总热量仅1,720kcal（净减脂缺口580-680kcal）；在学术自习上更是四线全满贯：下午16:30-17:00精读科研文献(30m)，17:00-18:30强势攻克《习概》第九章全新理论(90m，达成率200%)，19:00-20:00高质量攻坚《体育科研方法》课内专业作业(60m)，晚间21:30-22:10精读英文原版文章(40m)！全天纯学术专注达220分钟（3小时40分钟），任务一二三四全面丰收！',
  achievements: [
    '任务三 (专业课作业攻坚): 19:00-20:00 高质量完成《体育科研方法》课内专业作业 (60m)',
    '任务二 (习概第九章全新理论攻坚): 17:00-18:30 深入研读第九章核心理论与考点梳理 (90m，达成率 200%)',
    '任务一 (英语文章沉浸精读): 21:30-22:10 原版英文文章长难句精读与学术语感训练 (40m)',
    '任务四 (科研前沿文献精读): 16:30-17:00 深入研读专业文献与前沿学术方法论 (30m)',
    '休息日精准控卡: 两餐总热量仅~1,720kcal且保持~580-680kcal净缺口',
    '高蛋白保肌执行: 11:00四蛋白去黄 + 17:00全去皮四禽腿加全蛋，全天蛋白~159g(1.67g/kg)'
  ]
};

// ==================== 2. 录入周二 (2026-11-24) 发展对象自传抄写 (14:00-15:30, 90m) ====================
const partyTask = {
  id: 'task-party-autobiography-20261124',
  categoryId: 'cat-homework-custom',
  title: '日常研习: 发展对象个人自传撰写与工整抄写',
  completed: true,
  targetMinutes: 90,
  actualMinutes: 90,
  estimatedPomodoros: 3,
  completedPomodoros: 3,
  notes: '14:00-15:30 下午高专注投入90分钟（1.5小时）：全神贯注完成发展对象自传的工整抄写与思想回顾，全面端正思想政治态度，圆满达成发展对象重要材料归档要求。',
  createdAt: '2026-11-24T14:00:00.000+08:00',
  completedAt: '2026-11-24T15:30:00.000+08:00'
};

const partyTaskIdx = data.tasks.findIndex(t => t.id === partyTask.id);
if (partyTaskIdx >= 0) data.tasks[partyTaskIdx] = partyTask;
else data.tasks.unshift(partyTask);

const partyLog = {
  id: 'log-20261124-party-autobiography',
  taskId: 'task-party-autobiography-20261124',
  taskTitle: '日常研习: 发展对象自传抄写完成 (90分钟)',
  categoryId: 'cat-homework-custom',
  categoryName: '日常作业与自主研习',
  categoryColor: '#06b6d4',
  categoryIcon: 'BookMarked',
  startTime: '2026-11-24T14:00:00.000+08:00',
  endTime: '2026-11-24T15:30:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '14:00-15:30 下午专注90分钟：认真工整完成发展对象自传抄写与重要思想汇报材料整理。'
};

const partyLogIdx = data.timeLogs.findIndex(l => l.id === partyLog.id);
if (partyLogIdx >= 0) data.timeLogs[partyLogIdx] = partyLog;
else data.timeLogs.push(partyLog);

// 创建周二 (2026-11-24) 日度复盘
data.reflections['2026-11-24'] = {
  date: '2026-11-24',
  score: 5,
  mood: '✍️ 专注沉淀 · 发展对象自传工整抄写完成',
  summary: '周二下午 14:00-15:30 纯沉浸专注 90 分钟（1.5小时），全神贯注完成发展对象个人自传的工整抄写与材料归档，思想政治端正、文风扎实！',
  achievements: [
    '日常研习 (发展对象重要材料完结): 14:00-15:30 纯专注工整抄写完成发展对象个人自传 (90m)'
  ]
};

// 重新按开始时间倒序排列所有 timeLogs
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Monday Task 3 homework and Tuesday party autobiography!');
console.log('Monday 11-23 total logs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-23')).map(l => ({ id: l.id, cat: l.categoryId, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
console.log('Tuesday 11-24 total logs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-24')).map(l => ({ id: l.id, cat: l.categoryId, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
