const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

const catTotals = {};
d.categories.forEach(c => { catTotals[c.id] = { name: c.name, minutes: 0, target: c.weeklyTargetMinutes }; });

d.timeLogs.forEach(l => {
  if (catTotals[l.categoryId]) {
    catTotals[l.categoryId].minutes += l.durationMinutes;
  }
});

console.log('=== WEEKLY TOTALS VERIFICATION ===');
Object.values(catTotals).forEach(c => {
  const actualH = (c.minutes / 60).toFixed(1);
  const targetH = (c.target / 60).toFixed(1);
  const rate = c.target > 0 ? Math.round((c.minutes / c.target) * 100) : 100;
  console.log(`${c.name.slice(0, 20).padEnd(22)} | 实际: ${actualH}h (${c.minutes}m) | 目标: ${targetH}h (${c.target}m) | 达成率: ${rate}%`);
});
