const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

console.log('=== TASKS UNDER 日常作业与自主研习 ===');
d.tasks.filter(t => t.categoryId === 'cat-homework-custom').forEach(t => {
  const status = t.completed ? '✅ 已完成' : '⏳ 进行中(50%)';
  console.log(`${status} | ${t.title} | ${t.notes}`);
});

console.log('\n=== TODAY TIME LOGS (2026-11-09) ===');
d.timeLogs.filter(l => l.startTime.startsWith('2026-11-09')).forEach(l => {
  console.log(`${l.startTime.slice(11, 19)} - ${l.endTime.slice(11, 19)} (${l.durationMinutes}m) [${l.categoryName}] ${l.taskTitle}`);
  console.log('  Notes: ' + l.notes);
});
