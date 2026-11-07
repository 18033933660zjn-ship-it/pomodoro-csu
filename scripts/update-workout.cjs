const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

// 1. deletedLogIds 墓碑列表
const deletedLogSet = new Set(data.deletedLogIds || []);
deletedLogSet.add('log-1794034215079');
deletedLogSet.add('log-1794018151207');
deletedLogSet.add('log-1794014603982');
deletedLogSet.add('log-1794014626633');
deletedLogSet.add('log-1793879655096');
data.deletedLogIds = Array.from(deletedLogSet);

// 2. 过滤 timeLogs，彻底删除任何虚假预充流水
data.timeLogs = (data.timeLogs || []).filter(l => {
  if (deletedLogSet.has(l.id)) return false;
  if (l.notes && l.notes.includes('系统自动同步计入')) return false;
  return true;
});

// 3. 确保包含周六唯一真实锻炼记录 (10:40 - 13:00, 140分钟)
const realFitLog = {
  id: 'log-20261107-fit-01',
  taskId: 'task-fit-1',
  taskTitle: '健身房大重量下肢与核心专项拉练 (140分钟)',
  categoryId: 'cat-fitness-workout',
  categoryName: '周末专项: 健身房高强度锻炼',
  categoryColor: '#10b981',
  categoryIcon: 'Dumbbell',
  startTime: '2026-11-07T10:40:00.000+08:00',
  endTime: '2026-11-07T13:00:00.000+08:00',
  durationMinutes: 140,
  mode: 'pomodoro',
  isExtra: false,
  notes: '10:40-13:00 实打实高强度训练140分钟：5组西班牙蹲；深蹲梯形加重(60kg*5, 80kg*5, 100kg*5, 120kg*5, 140kg*1, 150kg*1)顶峰冲刺成功；保加利亚蹲30kg*5次*5组；坐姿髋内收机(47kg*10次*2组, 54kg*8次*2组, 64kg*6次*2组)；45°山羊凳侧压腿15kg*10次*3组；反向山羊挺身10kg*10次*3组；反向山羊俄罗斯转体10kg*10次*3组；平板支撑60秒*3组。'
};

data.timeLogs = data.timeLogs.filter(l => l.id !== 'log-20261107-fit-01');
data.timeLogs.unshift(realFitLog);

// 4. 更新 task-fit-1 任务状态为已完成
const taskIdx = (data.tasks || []).findIndex(t => t.id === 'task-fit-1');
if (taskIdx !== -1) {
  data.tasks[taskIdx] = {
    ...data.tasks[taskIdx],
    title: '周末健身房大重量下肢与核心专项拉练（深蹲顶峰150kg + 保加利亚蹲 + 髋内收 + 核心四重奏）',
    completed: true,
    estimatedPomodoros: 5,
    completedPomodoros: 5,
    notes: '10:40-13:00 实际高强度执行140分钟：5组西班牙蹲；深蹲冲刺150kg顶峰成功；保加利亚蹲30kg×5次×5组；坐姿髋内收机递增至64kg；45°山羊侧压腿15kg、反向山羊挺身10kg、反向山羊俄罗斯转体10kg、平板支撑60s×3组，核心与下肢全面超额达成！',
    completedAt: '2026-11-07T13:00:00.000+08:00'
  };
}

// 5. 确保未完成任务保持 completed: false
data.tasks.forEach(t => {
  if (t.id === 'task-ielts-1' || t.id === 'task-ielts-2' || t.id === 'task-pol-1' || t.id === 'task-major-1' || t.id === 'task-research-1') {
    t.completed = false;
    delete t.completedAt;
  }
});

// 6. 整理 checkIns
data.deletedCheckInIds = ['chk-1794018151206'];
const gymCheckIn = {
  id: 'chk-20261107-gym-1040',
  checkpointId: 'cp-sat-2',
  date: '2026-11-07',
  scheduledTime: '10:30',
  checkInTime: '2026-11-07T10:40:00.000+08:00',
  status: 'late',
  diffMinutes: 10,
  target: '健身房',
  taskName: '健身房大重量下肢与核心专项拉练 (140分钟)',
  notes: '10:40 到达健身房打卡（迟到 10 分钟）。随后高强度训练至 13:00，深蹲顶峰突破 150kg！'
};

data.checkIns = (data.checkIns || []).filter(c => c.id !== 'chk-20261107-gym-1040' && c.id !== 'chk-1794018151206');
data.checkIns.unshift(gymCheckIn);

data.exportTime = new Date().toISOString();
fs.writeFileSync('data/storage.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sanitized & updated workout successfully!');
