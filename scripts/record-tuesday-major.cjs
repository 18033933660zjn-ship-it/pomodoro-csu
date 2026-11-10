const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Update log-1794296226251 (or add if missing)
const logId = 'log-1794296226251';
const logIdx = data.timeLogs.findIndex(l => l.id === logId);

const updatedLog = {
  id: logId,
  taskId: 'task-major-referee-20261110',
  taskTitle: '专业课作业: 国际篮联三人执裁换位与违体犯规分类 (60分钟)',
  categoryId: 'cat-major-courses',
  categoryName: '任务三: 体育专业课三科',
  categoryColor: '#3b82f6',
  categoryIcon: 'Code',
  startTime: '2026-11-10T06:37:06.511Z', // 14:37:06 local
  endTime: '2026-11-10T07:37:06.251Z',   // 15:37:06 local
  durationMinutes: 60,
  mode: 'pomodoro',
  isExtra: false,
  notes: '14:37-15:37 深入完成运动竞赛学/篮球裁判法专业课作业：系统掌握国际篮联（FIBA）三人执裁机制（主副裁响哨后的换位轮转与视野分工原则），以及违体犯规五大类别（C1合法防守动作超限、C2非冲球动作、C3不必要过分接触、C4防快攻停表阻滞、C5最后两分钟界外球犯规）的判罚尺度。'
};

if (logIdx >= 0) {
  data.timeLogs[logIdx] = updatedLog;
} else {
  data.timeLogs.unshift(updatedLog);
}

// 2. Add completed task
const majorTask = {
  id: 'task-major-referee-20261110',
  categoryId: 'cat-major-courses',
  title: '专业课作业: 国际篮联三人执裁换位与违体犯规分类',
  completed: true,
  targetMinutes: 60,
  actualMinutes: 60,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '深入完成专业课作业：系统掌握国际篮联三人执裁响哨后换位及违体犯规分类标准',
  createdAt: '2026-11-10T14:37:06.000+08:00',
  completedAt: '2026-11-10T15:37:06.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === majorTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = majorTask;
} else {
  data.tasks.unshift(majorTask);
}

// 3. Add / Update Daily Reflection for 2026-11-10
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-10'] = {
  date: '2026-11-10',
  score: 5,
  mood: '🎯 双核精准达标',
  summary: '周二学习执行力极高！上午 10:00-10:45 深入攻坚习概第六章重点理论（45m 任务二 100%达标）；下午 14:37-15:37 纯沉浸专注 60 分钟高质量完成专业课作业（国际篮联三人执裁换位机制与违体犯规分类，60m 任务三 100%达标）！',
  achievements: [
    '任务二 (习概理论): 10:00-10:45 深入学习习概第六章核心考点 (45m，日标达标 100%)',
    '任务三 (专业课作业): 14:37-15:37 完成国际篮联三人执裁响哨后换位与违体犯规分类作业 (60m，日标达标 100%)'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Tuesday 14:37-15:37 major course assignment (60m)!');
