const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 融合 2026-11-22 的运动、营养与学业复盘
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-22'] = {
  date: '2026-11-22',
  score: 5,
  mood: '💪🔥 卧推突破 · 习概五章串联 · 820-970kcal净减脂',
  summary: '周日文武大丰收！上午11:00起卧推突破完成3组80kg×4+90kg×1+高阶70→40kg零间歇递减(3,350kg)+高位下拉+核心抗旋转(135m)，13:30补香蕉后完成15m投篮发力校准；下午至傍晚学术自习全面爆发：16:00-17:00完成60m英语综合学习，17:30-19:30沉浸专注2小时大体量横向复盘《习概》第4-8章核心理论(120m，达成率267%)！全天运动150m+自习180m(总高效输出330m/5.5h)；全天三餐摄入~185g蛋白(1.95g/kg)、总热量~2,130kcal，斩获~820-970kcal超高净减脂缺口！',
  achievements: [
    '上肢推力突破: 卧推完成3组80kg×4+90kg×1，递减组抬高至70→40kg六阶连降 (3,350kg)',
    '聪明护腰选配: 核心切换为平板支撑哑铃划船+平板支撑4×60s+死虫式4×20，避开下背剪切',
    '任务二 (习概五章宏观大串联): 17:30-19:30 系统复盘第4-8章核心考点与理论架构 (120m，达成率 267%)',
    '任务一 (英语基础突破): 16:00-17:00 英语词汇与学术读写综合学习 (60m)',
    '饮食精准闭环: 全天~185g优质蛋白(1.95g/kg)，总热量~2,130kcal，稳斩~820-970kcal净减脂缺口'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully synced data/storage.json to public/storage.json with integrated Sunday reflection!');
console.log('Sunday 2026-11-22 total logs count:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-22')).length);
console.log('Athlete record 2026-11-22 status tag:', data.athleteRecords?.['2026-11-22']?.diagnosis?.statusTag);
