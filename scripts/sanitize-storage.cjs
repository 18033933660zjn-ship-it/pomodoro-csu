const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

// 1. 过滤 checkIns，彻底删除未到达的健身房提前打卡
const deletedCheckInSet = new Set([
  'chk-1794018151206',
  '2026-11-07_cp-sat-2'
]);

data.checkIns = (data.checkIns || []).filter(c => {
  const key = c.date + '_' + (c.checkpointId || c.id);
  return !deletedCheckInSet.has(c.id) && !deletedCheckInSet.has(key);
});
data.deletedCheckInIds = Array.from(deletedCheckInSet);

// 2. 过滤 timeLogs (确保周六0分钟，且删除任何墓碑日志)
const deletedLogSet = new Set(data.deletedLogIds || []);
deletedLogSet.add('log-1794018151207');
deletedLogSet.add('log-1794014603982');
deletedLogSet.add('log-1794014626633');
deletedLogSet.add('log-1793879655096');

data.timeLogs = (data.timeLogs || []).filter(l => {
  if (deletedLogSet.has(l.id)) return false;
  if (l.date === '2026-11-07') return false;
  if (l.startTime && l.startTime.startsWith('2026-11-07')) return false;
  return true;
});
data.deletedLogIds = Array.from(deletedLogSet);

// 3. 确保任务状态未完成
if (data.tasks) {
  data.tasks.forEach(t => {
    if (t.id === 'task-fit-1' || t.id === 'task-research-1' || t.id === 'task-ielts-1' || t.id === 'task-ielts-2' || t.id === 'task-pol-1' || t.id === 'task-major-1') {
      t.completed = false;
      delete t.completedAt;
    }
  });
}

data.exportTime = new Date().toISOString();
fs.writeFileSync('data/storage.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sanitization complete!');
