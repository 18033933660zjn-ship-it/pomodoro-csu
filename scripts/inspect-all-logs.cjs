const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

console.log('Total logs:', data.timeLogs.length);
console.log('----------------------------------------------------');
data.timeLogs.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
data.timeLogs.forEach(l => {
  const date = l.startTime ? l.startTime.slice(0, 10) : 'unknown';
  console.log(`${date} | ID: ${l.id} | ${l.durationMinutes}m | [${l.categoryId}] ${l.taskTitle}`);
});
console.log('----------------------------------------------------');
