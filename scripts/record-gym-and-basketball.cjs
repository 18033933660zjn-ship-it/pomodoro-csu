const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Gym Workout Log (10:10 - 12:40, 150m)
const gymLog = {
  id: 'log-20261111-gym-lowerbody',
  taskId: 'task-fit-20261111-leg',
  taskTitle: '健身房大重量下肢抗阻与核心功能强化 (150分钟)',
  categoryId: 'cat-fitness-workout',
  categoryName: '周末专项: 健身房高强度锻炼',
  categoryColor: '#10b981',
  categoryIcon: 'Dumbbell',
  startTime: '2026-11-11T10:10:00.000+08:00',
  endTime: '2026-11-11T12:40:00.000+08:00',
  durationMinutes: 150,
  mode: 'pomodoro',
  isExtra: false,
  notes: '10:10-12:40 健身房下肢力量与核心专项拉练150分钟（2.5小时）：\n• 靠墙静蹲：5组×30秒（膝关节与VMO等长激活）；\n• 深蹲金字塔与大重量攻坚：60kg×5, 80kg×5, 100kg×5, 4组120kg×4（85%+ 1RM大重量机械张力攻坚）, 2组100kg×5（退减容量组）；\n• 保加利亚分腿蹲：左右腿各5组，负重30kg哑铃（强化单腿支撑稳定性与起跳制动力）；\n• 核心四重奏：45°山羊凳侧压腿15kg×10次×3组；反向山羊挺身10kg×10次×3组；反向山羊俄罗斯转体10kg×10次×3组；平板支撑60秒×3组。\n• 训练补给：瑞幸标准美式1杯（中枢神经兴奋与抗疲劳）。'
};

const gymTask = {
  id: 'task-fit-20261111-leg',
  categoryId: 'cat-fitness-workout',
  title: '健身房大重量下肢抗阻（深蹲120kg 4组 + 保加利亚蹲30kg哑铃5组 + 核心四重奏）',
  completed: true,
  targetMinutes: 150,
  actualMinutes: 150,
  estimatedPomodoros: 6,
  completedPomodoros: 6,
  notes: '10:10-12:40 扎实完成2.5小时下肢大重量深蹲与核心功能轰炸，瑞幸美式全程中枢神经支持',
  createdAt: '2026-11-11T10:10:00.000+08:00',
  completedAt: '2026-11-11T12:40:00.000+08:00'
};

// 2. Basketball Practice Log (12:50 - 13:40, 50m)
const bballLog = {
  id: 'log-20261111-basketball-special',
  taskId: 'task-fit-20261111-bball',
  taskTitle: '篮球场专项练习与技术体能强化 (50分钟)',
  categoryId: 'cat-fitness-workout',
  categoryName: '周末专项: 健身房高强度锻炼',
  categoryColor: '#10b981',
  categoryIcon: 'Dumbbell',
  startTime: '2026-11-11T12:50:00.000+08:00',
  endTime: '2026-11-11T13:40:00.000+08:00',
  durationMinutes: 50,
  mode: 'pomodoro',
  isExtra: false,
  notes: '12:50-13:40 篮球场高强度专项练习50分钟：运球变向突破、急停跳投抗疲劳手感建立与球场专项体能，下肢深蹲大力量向球场爆发力的高效迁移转化。'
};

const bballTask = {
  id: 'task-fit-20261111-bball',
  categoryId: 'cat-fitness-workout',
  title: '篮球场专项练习: 运球突破、投篮手感与球场专项体能',
  completed: true,
  targetMinutes: 50,
  actualMinutes: 50,
  estimatedPomodoros: 2,
  completedPomodoros: 2,
  notes: '12:50-13:40 力量训练后立即进行篮球专项练习50分钟，强化抗疲劳神经肌肉控制',
  createdAt: '2026-11-11T12:50:00.000+08:00',
  completedAt: '2026-11-11T13:40:00.000+08:00'
};

// Insert / update logs
const newLogs = [bballLog, gymLog];
newLogs.forEach(log => {
  const idx = data.timeLogs.findIndex(l => l.id === log.id);
  if (idx >= 0) {
    data.timeLogs[idx] = log;
  } else {
    data.timeLogs.unshift(log);
  }
});

// Insert / update tasks
const newTasks = [bballTask, gymTask];
newTasks.forEach(task => {
  const idx = data.tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) {
    data.tasks[idx] = task;
  } else {
    data.tasks.unshift(task);
  }
});

// Sort timeLogs by startTime descending
data.timeLogs.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// Update reflections for 2026-11-11
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-11'] = {
  date: '2026-11-11',
  score: 5,
  mood: '🔥 体能与学术全能爆发 · 强悍攻坚',
  summary: '周三全天体能与学术全面爆发！早间 09:10-09:40 听 YouTube 英语 vlog（30m）；09:18-09:40 22分钟内高效收尾完成昨晚剩余党课笔记；上午 10:10-12:40 进驻健身房完成 150 分钟下肢大重量深蹲（120kg×4组）+ 30kg哑铃保加利亚蹲（5组）+ 核心四重奏（瑞幸冰美式全程中枢支持）；随后 12:50-13:40 转战篮球场完成 50 分钟高强度篮球专项与体能练习！午后摄入大份白切鸡烧鸭双拼饭+大份白灼生菜，高蛋白高碳水超量恢复极其到位！',
  achievements: [
    '健身房大重量下肢抗阻: 10:10-12:40 靠墙静蹲+120kg深蹲4组+30kg保加利亚蹲+核心四重奏 (150m)',
    '篮球专项技术与体能: 12:50-13:40 篮球场专项练习50分钟，力量迁移实战 (50m)',
    '任务一 (英语听力): 09:10-09:40 晨间听YouTube英语vlog磨耳朵 (30m)',
    '日常作业与自主研习: 09:18-09:40 晨间22分钟内高效收尾完成昨晚剩余党课笔记 (22m)',
    '高水平运动营养恢复: 瑞幸冰美式激发神经状态 + 午后高蛋白（白切鸡/烧腊）高碳水超量恢复'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded gym workout (150m) and basketball practice (50m)!');
