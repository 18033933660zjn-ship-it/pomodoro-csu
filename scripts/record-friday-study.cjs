const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 科研文献投稿 (90m, 成功投稿)
const researchTask = {
  id: 'task-research-submission-20261120',
  categoryId: 'cat-research-advance',
  title: '🎉 重大科研里程碑: 科研文献材料终审与正式投稿',
  completed: true,
  targetMinutes: 90,
  actualMinutes: 90,
  estimatedPomodoros: 3,
  completedPomodoros: 3,
  notes: '14:30-16:00 下午专注90分钟：完成科研论文全套终稿材料检查、投递系统信息录入、格式自审与材料上传，已成功完成论文正式投稿！达成关键科研里程碑！',
  createdAt: '2026-11-20T14:30:00.000+08:00',
  completedAt: '2026-11-20T16:00:00.000+08:00'
};

// 2. Task: 习概第七章学习与练习题 (60m)
const polTask = {
  id: 'task-pol-ch7-study-20261120',
  categoryId: 'cat-politics-innovation',
  title: '习概第七章深入研读与配套习题实战巩固',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '16:00-17:00 下午紧接着投入60分钟（达成任务二日标 133%）：系统攻坚习概第七章理论内容，梳理核心考点逻辑，并完成配套练习题巩固考点记忆。',
  createdAt: '2026-11-20T16:00:00.000+08:00',
  completedAt: '2026-11-20T17:00:00.000+08:00'
};

// 3. Task: 傍晚英语学习 (30m)
const ieltsTask = {
  id: 'task-ielts-study-20261120',
  categoryId: 'cat-ielts-research',
  title: '英语突破: 核心词汇记忆与英语语感沉浸',
  completed: true,
  targetMinutes: 30,
  actualMinutes: 30,
  estimatedPomodoros: 1,
  completedPomodoros: 1,
  notes: '17:30-18:00 傍晚专注30分钟：进行英语学术词汇背写与短文语感沉浸输入，保持每日英语语感不断线。',
  createdAt: '2026-11-20T17:30:00.000+08:00',
  completedAt: '2026-11-20T18:00:00.000+08:00'
};

[researchTask, polTask, ieltsTask].forEach(t => {
  const idx = data.tasks.findIndex(item => item.id === t.id);
  if (idx >= 0) data.tasks[idx] = t;
  else data.tasks.unshift(t);
});

// 4. TimeLogs
const researchLog = {
  id: 'log-20261120-research-submission',
  taskId: 'task-research-submission-20261120',
  taskTitle: '任务四: 科研文献投稿攻坚 (90分钟 · 成功投稿)',
  categoryId: 'cat-research-advance',
  categoryName: '任务四: 科研推进 (文献研读与论文写作)',
  categoryColor: '#ec4899',
  categoryIcon: 'FileText',
  startTime: '2026-11-20T14:30:00.000+08:00',
  endTime: '2026-11-20T16:00:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '14:30-16:00 下午专注90分钟：全面完成科研论文投稿流程，涵盖投稿系统材料提交、作者与资助信息核对、附件上传与终审确认，已成功顺利完成投稿！'
};

const polLog = {
  id: 'log-20261120-pol-ch7-study',
  taskId: 'task-pol-ch7-study-20261120',
  taskTitle: '任务二: 习概第七章学习与配套练习 (60分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-20T16:00:00.000+08:00',
  endTime: '2026-11-20T17:00:00.000+08:00',
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '16:00-17:00 下午专注60分钟（达成任务二日标 133%）：深入学习习概第七章理论框架与关键命题，紧密结合配套练习题开展实战自测，考点内化扎实。'
};

const ieltsLog = {
  id: 'log-20261120-ielts-study',
  taskId: 'task-ielts-study-20261120',
  taskTitle: '任务一: 英语词汇与语感研习 (30分钟)',
  categoryId: 'cat-ielts-research',
  categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
  categoryColor: '#8b5cf6',
  categoryIcon: 'GraduationCap',
  startTime: '2026-11-20T17:30:00.000+08:00',
  endTime: '2026-11-20T18:00:00.000+08:00',
  durationMinutes: 30,
  mode: 'pomodoro',
  isExtra: false,
  notes: '17:30-18:00 傍晚专注30分钟：进行英语高频核心词汇背诵与语料精读，持续保持敏锐的英语语感与学术英语理解力。'
};

[researchLog, polLog, ieltsLog].forEach(l => {
  const idx = data.timeLogs.findIndex(item => item.id === l.id);
  if (idx >= 0) data.timeLogs[idx] = l;
  else data.timeLogs.unshift(l);
});

// Sort timeLogs descending by startTime
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 5. Update reflection for 2026-11-20
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-20'] = {
  date: '2026-11-20',
  score: 5,
  mood: '🎉 科研重磅突破 · 论文成功投稿 + 习概第七章通关 + 英语精进',
  summary: '周五下午至傍晚学术自习捷报频传！14:30-16:00 攻坚90分钟顺利完成科研文献材料终审与系统提交，已成功正式投稿（达成极具分量的科研关键里程碑！）；16:00-17:00 紧接着投入60分钟深入攻克习概第七章理论与练习题巩固（任务二达成率133%）；17:30-18:00 扎实完成30分钟英语词汇与语感研习。全天累计纯沉浸学术专注180分钟（3.0小时），科研与政治双双迎来高光突破！',
  achievements: [
    '任务四 (重大科研里程碑): 14:30-16:00 科研文献终审与正式投稿完成，已成功投稿！(90m)',
    '任务二 (习概理论与习题实战): 16:00-17:00 习概第七章深入研学与配套练习题自测 (60m，达成率 133%)',
    '任务一 (英语语感与词汇学习): 17:30-18:00 傍晚英语核心词汇与学术语料精读 (30m)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully recorded Friday study and research submission sessions!');
console.log('Friday total timeLogs now:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-20')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));
