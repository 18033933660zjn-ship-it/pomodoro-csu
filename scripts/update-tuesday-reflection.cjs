const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 融合更新周二 (2026-11-24) 日度复盘
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-24'] = {
  date: '2026-11-24',
  score: 5,
  mood: '✍️🏃 文武并进 · 自传抄写+4km变速跑与弹跳+735kcal减脂',
  summary: '周二学业政工与户外体能双线丰收！下午14:00-15:30高专注完成90分钟发展对象个人自传工整抄写与材料归档；紧接着16:00-16:41完成4000米变速跑(21m)+20分钟蛙跳与直腿弹性跳(41m)；全天三餐自律搭配（午食堂优选荤素+晚白切鸡烧鸭+餐后香蕉），全天摄入~151g蛋白(1.59g/kg)、总热量~2,240kcal，稳斩~660-810kcal纯净减脂缺口！',
  achievements: [
    '日常研习 (发展对象重要材料完结): 14:00-15:30 纯专注工整抄写完成发展对象个人自传 (90m)',
    '户外体能与弹跳突破: 16:00-16:41 4000米变速跑(21m) + 蛙跳与直腿弹性跳(20m)',
    '饮食与减脂缺口: 全天~151g优质蛋白(1.59g/kg)，三餐健康搭配，稳守~660-810kcal黄金减脂缺口'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully updated Tuesday 11-24 reflection with merged study & fitness achievements!');
