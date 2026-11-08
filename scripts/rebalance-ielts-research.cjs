const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

// 更新 categories 配额
data.categories = (data.categories || []).map(c => {
  if (c.id === 'cat-ielts-research') {
    return {
      ...c,
      name: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
      dailyTargetMinutes: 90,
      weeklyTargetMinutes: 630,
      description: '每天平均1.5小时（每周10.5小时）：核心词汇背写默写与长难句型读写，与科研推进时段统筹并进'
    };
  }
  if (c.id === 'cat-research-advance') {
    return {
      ...c,
      name: '任务四: 科研推进 (文献研读与论文写作)',
      dailyTargetMinutes: 90,
      weeklyTargetMinutes: 630,
      description: '每天平均1.5小时（每周10.5小时）：文献研读精析、论文写作推进、论点完善与学术格式规范'
    };
  }
  return c;
});

data.exportTime = new Date().toISOString();
fs.writeFileSync('data/storage.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Categories rebalanced successfully!');
