const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// Fabricated logs to remove immediately
const unsanctionedLogIds = [
  'log-std-20261108-maj',
  'log-std-20261108-ielts',
  'log-std-20261108-res',
  'log-std-20261107-pol',
  'log-std-20261107-res-1',
  'log-std-20261107-res-2',
  'log-std-20261107-ielts',
  'log-1794130429267'
];

if (!data.deletedLogIds) data.deletedLogIds = [];
unsanctionedLogIds.forEach(id => {
  if (!data.deletedLogIds.includes(id)) {
    data.deletedLogIds.push(id);
  }
});

// Filter out unsanctioned logs
data.timeLogs = data.timeLogs.filter(l => !unsanctionedLogIds.includes(l.id));

// Ensure Saturday has the real log
const satRealExists = data.timeLogs.some(l => l.id === 'log-1794048210647');
if (!satRealExists) {
  data.timeLogs.push({
    id: 'log-1794048210647',
    taskId: 'task-ielts-1',
    taskTitle: '雅思与科研学术综合自习 (130分钟)',
    categoryId: 'cat-ielts-research',
    categoryName: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
    categoryColor: '#8b5cf6',
    categoryIcon: 'GraduationCap',
    startTime: '2026-11-07T14:30:00.000+08:00',
    endTime: '2026-11-07T16:40:00.000+08:00',
    durationMinutes: 130,
    mode: 'pomodoro',
    isExtra: false,
    notes: '周六下午自习室真实专注130分钟'
  });
}

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully purged all unsanctioned/fabricated logs!');
console.log('Remaining logs for Sunday 11-08:');
const sunLogs = data.timeLogs.filter(l => l.startTime.startsWith('2026-11-08'));
console.log(JSON.stringify(sunLogs.map(l => ({ id: l.id, title: l.taskTitle, duration: l.durationMinutes, start: l.startTime, end: l.endTime })), null, 2));
