const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// ==================== 1. 周五 (2026-11-27) 两大学术专注任务 ====================

// 1.1 任务二: 习概第十二章深入研读与配套练习 (16:00 - 17:00, 60m)
const polCh12Task = {
  id: 'task-pol-ch12-study-20261127',
  categoryId: 'cat-politics-innovation',
  title: '习概第十二章深入研读与配套练习题实战巩固',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '16:00-17:00 下午高专注投入60分钟（达成任务二日标 133%）：系统攻坚《习概》第十二章核心理论体系，系统梳理关键命题与核心考点，并高质量完成配套练习题巩固。',
  createdAt: '2026-11-27T16:00:00.000+08:00',
  completedAt: '2026-11-27T17:00:00.000+08:00'
};

const polCh12Log = {
  id: 'log-20261127-pol-ch12-study',
  taskId: 'task-pol-ch12-study-20261127',
  taskTitle: '任务二: 习概第十二章研学与配套练习 (60分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-27T16:00:00.000+08:00',
  endTime: '2026-11-27T17:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '16:00-17:00 下午专注60分钟（任务二达成率 133%）：全面研读《习概》第十二章核心理论知识，梳理重大理论观点与论断，并完成配套练习题自测巩固。'
};

// 1.2 任务一: 英语学习 (YouTube视频精听 + 外文文献阅读) (17:30 - 18:30, 60m)
const ieltsTask = {
  id: 'task-ielts-study-20261127',
  categoryId: 'cat-ielts-research',
  title: '英语突破: YouTube原声视频精听与外文前沿学术文献研读',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '17:30-18:30 傍晚专注60分钟（达成任务一日标 67%）：观看优质 YouTube 英文原声视频强化地道听力与口语表达，沉浸研读英文外文专业学术文献，深化长难句解析与学术英语阅读理解。',
  createdAt: '2026-11-27T17:30:00.000+08:00',
  completedAt: '2026-11-27T18:30:00.000+08:00'
};

const ieltsLog = {
  id: 'log-20261127-ielts-study',
  taskId: 'task-ielts-study-20261127',
  taskTitle: '任务一: 英语精进 (YouTube视频精听+外文文献阅读) (60分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-27T17:30:00.000+08:00',
  endTime: '2026-11-27T18:30:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:30-18:30 傍晚高专注投入60分钟：观看 YouTube 英文原声视频进行听力语感磨耳朵，并深入阅读外文专业文献，拓展学术词汇与国际前沿文献读写视野。'
};

[polCh12Task, ieltsTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

[polCh12Log, ieltsLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.push(l);
});

// ==================== 2. 融合更新周五 (2026-11-27) 日度复盘 ====================
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-27'] = {
  date: '2026-11-27',
  score: 5,
  mood: '🏋️‍♂️📖 双90kg卧推突破 · 习概12章通关+外文文献 · 207g蛋白神级控脂',
  summary: '周五文武全面大爆发！中午12:00健身房拿下卧推2组90kg×1+70→50kg递减(2,920kg)与杠铃实力推40kg×8×3组(1,600kg)+核心17组(115m)；下午自习接力：16:00-17:00沉浸60分钟攻克《习概》第12章及配套练习(达成率133%)，17:30-18:30专注60m精看YouTube英文原声视频并精读外文专业学术文献！全天重训115m+自习120m(总高效输出235m/3.9h)；饮食升级双份嫩牛肉+西兰花白菜，全天蛋白~207g(2.18g/kg)稳斩增肌黄金缺口！',
  achievements: [
    '任务二 (习概第12章理论与习题): 16:00-17:00 深入研读第十二章核心理论并完成配套练习题 (60m，达成率 133%)',
    '任务一 (英语听力视频与外文文献): 17:30-18:30 观看YouTube原声视频精听磨耳朵 + 外文专业文献精读 (60m)',
    '上肢力量双突破: 卧推完成2组90kg×1 + 70→50kg递减，杠铃实力推飙升至40kg×8×3组 (115m)',
    '饮食结构大升级: 晚餐采用双份嫩牛肉+西兰花白菜+煎蛋，全天~207g蛋白(2.18g/kg)且脂肪仅79g'
  ]
};

// 重新按开始时间倒序排列所有 timeLogs
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Friday (11-27) study sessions!');
console.log('Friday 11-27 total logs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-27')).map(l => ({ id: l.id, cat: l.categoryId, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
