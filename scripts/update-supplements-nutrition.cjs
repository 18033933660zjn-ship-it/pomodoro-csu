const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// Update daily reflection for 2026-11-11
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-11'] = {
  date: '2026-11-11',
  score: 5,
  mood: '🔥 体能与学术全能爆发 · 顶尖专业级恢复',
  summary: '周三全天体能、学术与专项全面爆发！早间 09:10-09:40 听 YouTube 英语 vlog（30m）；09:18-09:40 22分钟内高效收尾完成昨晚剩余党课笔记；上午 10:10-12:40 进驻健身房完成 150 分钟下肢大重量深蹲（120kg×4组）+ 30kg哑铃保加利亚蹲（5组）+ 核心四重奏（瑞幸冰美式全程中枢支持）；随后 12:50-13:40 在篮球场完成 50 分钟高强度篮球专项练习！午后摄入大份白切鸡烧鸭双拼饭+大份白灼生菜，高蛋白高碳水超量恢复；饭后30分钟内靶向补充2粒97%高纯度鱼油（强效抗炎护滑膜）与5g一水肌酸（胰岛素窗口极速泵入CP池），15:00加餐25g坚果稳态供能清除自由基！',
  achievements: [
    '健身房大重量下肢抗阻: 10:10-12:40 靠墙静蹲+120kg深蹲4组+30kg保加利亚蹲+核心四重奏 (150m)',
    '篮球专项技术与体能: 12:50-13:40 篮球场专项练习50分钟，力量迁移实战 (50m)',
    '任务一 (英语听力): 09:10-09:40 晨间听YouTube英语vlog磨耳朵 (30m)',
    '日常作业与自主研习: 09:18-09:40 晨间22分钟内高效收尾完成昨晚剩余党课笔记 (22m)',
    '高阶运动营养与补剂超量恢复: 瑞幸冰美式 + 白切鸡烧腊高蛋白高碳水 + 饭后2粒97%高纯鱼油+5g一水肌酸 + 15:00坚果25g'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated storage.json with supplements and nutrition details!');
