const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

// 1. 确保 deletedCheckInIds 只保留具体假打卡ID，绝不误杀真实打卡
data.deletedCheckInIds = ['chk-1794018151206'];

// 2. 确保周六健身房真实打卡存在 (10:40)
const satGymCheckIn = {
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
data.checkIns.unshift(satGymCheckIn);

// 3. 录入周日健身房真实打卡 (10:30)
const sunGymCheckIn = {
  id: 'chk-20261108-gym-1030',
  checkpointId: 'cp-sun-2',
  date: '2026-11-08',
  scheduledTime: '10:00',
  checkInTime: '2026-11-08T10:30:00.000+08:00',
  status: 'late',
  diffMinutes: 30,
  target: '健身房',
  taskName: '健身房体能雕刻与抗阻训练 (150分钟)',
  notes: '10:30 到达健身房打卡（迟到 30 分钟）。因昨日大重量深蹲中枢神经与下肢疲劳，早间充分休整，10:30 就位开启上肢大容量攻坚。'
};

data.checkIns = data.checkIns.filter(c => c.id !== 'chk-20261108-gym-1030');
data.checkIns.unshift(sunGymCheckIn);

// 4. 录入周日上肢高强度锻炼专注流水 (10:30 - 13:00, 150分钟)
const sunGymTimeLog = {
  id: 'log-20261108-fit-01',
  taskId: 'task-fit-1',
  taskTitle: '健身房上肢大容量推拉与核心专项拉练 (150分钟)',
  categoryId: 'cat-fitness-workout',
  categoryName: '周末专项: 健身房高强度锻炼',
  categoryColor: '#10b981',
  categoryIcon: 'Dumbbell',
  startTime: '2026-11-08T10:30:00.000+08:00',
  endTime: '2026-11-08T13:00:00.000+08:00',
  durationMinutes: 150,
  mode: 'pomodoro',
  isExtra: false,
  notes: '10:30-13:00 实打实高强度上肢抗阻150分钟：\n• 平板卧推金字塔：20kg×5, 40kg×5, 60kg×5, 80kg×3(2组), 90kg×1冲刺顶峰成功, 60kg×8, 40kg×8泵感力竭收尾；\n• 高位下拉垂直拉力：50kg×8(3组), 60kg×8(3组)；\n• 杠铃站姿实力推：20kg×8(1组), 30kg×8(3组), 40kg×6(2组)；\n• 核心四重奏：45°山羊侧压腿15kg×10次×3组；反向山羊挺身10kg×10次×3组；反向山羊俄罗斯转体10kg×10次×3组；平板支撑60秒×3组。'
};

data.timeLogs = (data.timeLogs || []).filter(l => l.id !== 'log-20261108-fit-01');
data.timeLogs.unshift(sunGymTimeLog);

// 5. 确保 tasks 任务列表中周六与周日健身房任务都清晰完成
const taskFitIdx = (data.tasks || []).findIndex(t => t.id === 'task-fit-1');
const sunTask = {
  id: 'task-fit-1',
  categoryId: 'cat-fitness-workout',
  title: '周日健身房胸肩上肢大容量抗阻与核心专项（卧推冲刺90kg + 实力推 + 高位下拉 + 核心四重奏）',
  completed: true,
  estimatedPomodoros: 6,
  completedPomodoros: 6,
  notes: '10:30-13:00 实际高强度执行150分钟：平板卧推冲刺90kg单次顶峰成功，高位下拉大容量6组，站姿实力推40kg×6，多维度核心强化超额达成！',
  createdAt: '2026-11-02T10:04:50.858Z',
  completedAt: '2026-11-08T13:00:00.000+08:00'
};

if (taskFitIdx !== -1) {
  data.tasks[taskFitIdx] = sunTask;
} else {
  data.tasks.push(sunTask);
}

// 确保周六下肢任务也在 tasks 中归档
const satTaskIdx = data.tasks.findIndex(t => t.id === 'task-fit-sat-01');
const satTask = {
  id: 'task-fit-sat-01',
  categoryId: 'cat-fitness-workout',
  title: '周六健身房大重量下肢深蹲专项（深蹲顶峰150kg + 保加利亚蹲 + 髋内收 + 核心四重奏）',
  completed: true,
  estimatedPomodoros: 5,
  completedPomodoros: 5,
  notes: '10:40-13:00 实际高强度执行140分钟：5组西班牙蹲；深蹲冲刺150kg顶峰成功；保加利亚蹲30kg×5次×5组；坐姿髋内收机递增至64kg；核心四重奏超额达成！',
  createdAt: '2026-11-02T10:04:50.858Z',
  completedAt: '2026-11-07T13:00:00.000+08:00'
};
if (satTaskIdx !== -1) {
  data.tasks[satTaskIdx] = satTask;
} else {
  data.tasks.splice(taskFitIdx + 1, 0, satTask);
}

data.exportTime = new Date().toISOString();
fs.writeFileSync('data/storage.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sunday workout recorded successfully!');
