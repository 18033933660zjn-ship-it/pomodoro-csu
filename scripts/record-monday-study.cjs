const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 习概导论至第三章复习 + 第四章深入研读 (150m)
const polTask = {
  id: 'task-pol-ch4-review-20261116',
  categoryId: 'cat-politics-innovation',
  title: '习概导论至第三章复习 + 第四章深入研读',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 150,
  estimatedPomodoros: 3,
  completedPomodoros: 5,
  notes: '14:30-17:00 下午纯沉浸专注2.5小时（150分钟，任务二日标达成率 333%）：系统复盘串联习概导论、第一章、第二章与第三章核心考点脉络，并全新攻坚研读第四章重要理论与概念框架。',
  createdAt: '2026-11-16T14:30:00.000+08:00',
  completedAt: '2026-11-16T17:00:00.000+08:00'
};

// 2. Task: 科研论文方法学深入学习 (60m)
const researchTask = {
  id: 'task-research-methodology-20261116',
  categoryId: 'cat-research-advance',
  title: '科研论文方法学深入学习与方法论构建',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '17:00-18:00 傍晚专注60分钟：深入研读学术前沿科研论文的方法学部分（Methodology），系统掌握运动科学实验设计、自变量与因变量控制、数据采集与统计学处理规范。',
  createdAt: '2026-11-16T17:00:00.000+08:00',
  completedAt: '2026-11-16T18:00:00.000+08:00'
};

[polTask, researchTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

// 3. Log: 习概 (14:30 - 17:00, 150m)
const polLog = {
  id: 'log-20261116-pol-ch4-review',
  taskId: 'task-pol-ch4-review-20261116',
  taskTitle: '任务二: 习概导论至第三章复习 + 第四章深入学习 (150分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-16T14:30:00.000+08:00',
  endTime: '2026-11-16T17:00:00.000+08:00',
  durationMinutes: 150,
  mode: 'pomodoro',
  isExtra: false,
  notes: '14:30-17:00 下午纯沉浸专注2.5小时（150分钟，任务二日标达成率 333%）：系统复盘串联习概导论、第一章、第二章与第三章核心考点脉络，并深入精读第四章重要理论与概念框架。'
};

// 4. Log: 科研论文方法学 (17:00 - 18:00, 60m)
const researchLog = {
  id: 'log-20261116-research-methodology',
  taskId: 'task-research-methodology-20261116',
  taskTitle: '任务四: 科研论文方法学深入学习 (60分钟)',
  categoryId: 'cat-research-advance',
  categoryName: '任务四: 科研推进 (文献研读与论文写作)',
  categoryColor: '#ec4899',
  categoryIcon: 'FileText',
  startTime: '2026-11-16T17:00:00.000+08:00',
  endTime: '2026-11-16T18:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:00-18:00 傍晚专注60分钟：深入研读学术前沿科研论文的方法学部分（Methodology），系统掌握运动科学实验设计、自变量与因变量控制、数据采集与统计学处理规范。'
};

[polLog, researchLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.push(l);
});

// Sort timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 5. Update reflection for 2026-11-16
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-16'] = {
  date: '2026-11-16',
  score: 5,
  mood: '🔥 理论串联 · 科研方法与体育多维并进',
  summary: '周一全天理论攻坚、学术科研与体育运动推进极其高效！上午 10:00-11:00 完成约60分钟足球课中低强度有氧比赛；下午 14:30-17:00 纯沉浸专注 2.5 小时（150分钟）系统完成习概导论至第三章复习并攻克第四章新理论（任务二达成率高达 333%）；傍晚 17:00-18:00 紧接着投入 60 分钟深入研读前沿科研论文方法学，学术思维全面进阶！晚间营养执行极佳（去皮禽肉摄入足量优质蛋白），全天累计高强度运动与学术专注时长达 270 分钟（4.5 小时）！',
  achievements: [
    '任务二 (习概理论串联与第四章新学): 14:30-17:00 导论至第三章系统复习 + 第四章深入研读 (150m，日标达成率 333%)',
    '任务四 (学术科研方法学推进): 17:00-18:00 深入研读科研论文方法学部分 (60m)',
    '上午体育活动: 10:00-11:00 足球课中低强度有氧比赛 60 分钟',
    '饮食神级执行: 晚餐去皮双鸡腿+双鸭腿+热卤鸡排，单餐狂揽~101g蛋白，全天蛋白达156g(1.64g/kg)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Monday afternoon and evening study sessions!');
console.log('Monday total timeLogs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-16')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
