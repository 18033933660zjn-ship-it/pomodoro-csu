const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Add evening log for Monday 2026-11-09
const eveningLog = {
  id: 'log-20261109-hw-evening',
  taskId: 'task-hw-20261109-03',
  taskTitle: '日常研习: 发展对象信息填写与自传修改 (60分钟)',
  categoryId: 'cat-homework-custom',
  categoryName: '日常作业与自主研习',
  categoryColor: '#06b6d4',
  categoryIcon: 'BookMarked',
  startTime: '2026-11-09T20:50:00.000+08:00',
  endTime: '2026-11-09T21:50:00.000+08:00',
  durationMinutes: 60,
  mode: 'manual',
  isExtra: false,
  notes: '20:50-21:50 晚课后自习专注60分钟：继续完成发展对象系统信息填报与个人自传修改完善'
};

const existingLogIdx = data.timeLogs.findIndex(l => l.id === eveningLog.id);
if (existingLogIdx >= 0) {
  data.timeLogs[existingLogIdx] = eveningLog;
} else {
  data.timeLogs.unshift(eveningLog);
}

// 2. Update task-hw-20261109-03
const taskIdx = data.tasks.findIndex(t => t.id === 'task-hw-20261109-03');
if (taskIdx >= 0) {
  data.tasks[taskIdx] = {
    ...data.tasks[taskIdx],
    title: '完成发展对象信息填写与自传修改',
    completed: true,
    targetMinutes: 60,
    actualMinutes: 60,
    completedPomodoros: 2,
    notes: '20:50-21:50 专注60分钟：继续完成发展对象信息填报与个人自传修改完善',
    completedAt: '2026-11-09T21:50:00.000+08:00'
  };
} else {
  data.tasks.unshift({
    id: 'task-hw-20261109-03',
    categoryId: 'cat-homework-custom',
    title: '完成发展对象信息填写与自传修改',
    completed: true,
    targetMinutes: 60,
    actualMinutes: 60,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    notes: '20:50-21:50 专注60分钟：继续完成发展对象信息填报与个人自传修改完善',
    createdAt: '2026-11-09T15:29:25.000+08:00',
    completedAt: '2026-11-09T21:50:00.000+08:00'
  });
}

// 3. Update Reflection for 2026-11-09
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-09'] = {
  date: '2026-11-09',
  score: 5,
  mood: '🚀 扎实大满贯',
  summary: '新一周周一高效大满贯！全天专注累计达 3.5 小时（210分钟）：晨间听英语vlog 30分钟；下午与晚课后共投入 3 小时（180分钟）深度攻坚日常作业与自主研习，全面完成党课发展对象材料（PPT制作、笔记、信息填报与自传修改）以及创新创业导论汇报PPT优化！',
  achievements: [
    '任务一 (雅思基础): 晨间 09:00-09:30 听英语vlog 30分钟，高频真实语料输入',
    '日常作业 1: 完成发展对象答辩/汇报 PPT 制作 (60m)',
    '日常作业 2: 撰写完成发展对象学习笔记与理论心得 (60m)',
    '日常作业 3: 晚间 20:50-21:50 发展对象信息系统填写与自传深度修改 (60m)',
    '日常作业 4: 全面优化和完善创新创业导论课程汇报 PPT',
    '大学课程全勤: 足球(一) 10:00-11:40 + 创新创业导论 19:00-20:40'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Monday 11-09 evening 60m session (发展对象信息填写与自传修改)!');
