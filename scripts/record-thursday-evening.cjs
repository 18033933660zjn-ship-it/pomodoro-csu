const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 习概第六章深度研读 (90m)
const polTask = {
  id: 'task-pol-ch6-study-20261119',
  categoryId: 'cat-politics-innovation',
  title: '习概第六章核心理论深入研读与考点梳理',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 90,
  estimatedPomodoros: 2,
  completedPomodoros: 3,
  notes: '19:30-21:00 晚间纯沉浸专注90分钟（达成任务二日标 200%）：全面深入学习习概第六章，系统梳理核心考点、重大论断与理论逻辑框架，扎实内化政治理论素养。',
  createdAt: '2026-11-19T19:30:00.000+08:00',
  completedAt: '2026-11-19T21:00:00.000+08:00'
};

// 2. Task: 英语视频学习 (30m)
const ieltsTask = {
  id: 'task-ielts-video-20261119',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 优质英语视频精听泛听与语感输入',
  completed: true,
  targetMinutes: 30,
  actualMinutes: 30,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '21:10-21:40 晚间专注30分钟：精听与泛听优质英文原声视频，强化听力理解能力、地道口语表达与学术英语语感积累。',
  createdAt: '2026-11-19T21:10:00.000+08:00',
  completedAt: '2026-11-19T21:40:00.000+08:00'
};

[polTask, ieltsTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

// 3. Log: 任务二 习概第六章 (19:30 - 21:00, 90m)
const polLog = {
  id: 'log-20261119-pol-ch6-study',
  taskId: 'task-pol-ch6-study-20261119',
  taskTitle: '任务二: 习概第六章深入研读 (90分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-19T19:30:00.000+08:00',
  endTime: '2026-11-19T21:00:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '19:30-21:00 晚间专注90分钟（达成任务二日标 200%）：系统研读习概第六章核心理论知识，梳理重大理论观点与论断，强化政治理论思维与考点储备。'
};

// 4. Log: 任务一 英语视频 (21:10 - 21:40, 30m)
const ieltsLog = {
  id: 'log-20261119-ielts-video',
  taskId: 'task-ielts-video-20261119',
  taskTitle: '任务一: 优质英语视频沉浸学习 (30分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-19T21:10:00.000+08:00',
  endTime: '2026-11-19T21:40:00.000+08:00',
  durationMinutes: 30,
  mode: 'pomodoro',
  isExtra: false,
  notes: '21:10-21:40 晚间专注30分钟：观看优质英语视频进行磨耳朵与沉浸式输入，学习地道词汇表达与真实语境连读、听力理解技巧。'
};

[polLog, ieltsLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.unshift(l);
});

// Sort timeLogs descending by startTime
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 5. Update reflection for 2026-11-19
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-19'] = {
  date: '2026-11-19',
  score: 5,
  mood: '🔥 文武双全 · 白天160m球场拉练 + 晚间120m学术攻坚',
  summary: '周四文武并进、执行力拉满！白天完成160分钟羽毛球对抗与篮球控运实战拉练（TDEE~3,250kcal，高效减脂缺口达成）；晚间无缝切换自习模式：19:30-21:00 纯沉浸90分钟攻克习概第六章核心考点，21:10-21:40 紧接着完成30分钟优质英语视频精听研学！全天运动与学术累计高效输出达 280 分钟（4小时40分钟），体能与知识双丰收！',
  achievements: [
    '任务二 (习概理论深度攻坚): 19:30-21:00 习概第六章深入学习与考点梳理 (90m，达成率 200%)',
    '任务一 (英语视频精听研学): 21:10-21:40 优质英语视频沉浸输入与语感训练 (30m)',
    '上午体育专项: 10:00-11:30 羽毛球单双打中等强度对抗 90 分钟',
    '下午篮球专项: 50分钟低强度分组对抗 + 20分钟控运球练习 (70m)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Thursday evening study sessions!');
console.log('Thursday total timeLogs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-19')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
