const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 习概导论与第一章深入研习与选择题刷题 (120m)
const politicsTask = {
  id: 'task-pol-intro-ch1-20261113',
  categoryId: 'cat-politics-innovation',
  title: '习概深度研习: 导论与第一章核心考点深化 + 选择题专项强化刷题',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 120,
  estimatedPomodoros: 2,
  completedPomodoros: 4,
  notes: '18:00-20:00 晚间高专注投入2小时（120分钟，超额达成日标 267%）：深入研习习概导论与第一章核心理论体系，系统攻关时代背景、历史地位与科学体系，完成导论与第一章全部单选及多选考点强化刷题与错题深度辨析。',
  createdAt: '2026-11-13T18:00:00.000+08:00',
  completedAt: '2026-11-13T20:00:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === politicsTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = politicsTask;
} else {
  data.tasks.unshift(politicsTask);
}

// 2. Log: 任务二 习概导论与第一章研习 + 选择题刷题 (120m)
const politicsLog = {
  id: 'log-20261113-pol-intro-ch1',
  taskId: 'task-pol-intro-ch1-20261113',
  taskTitle: '任务二: 习概导论与第一章深度研习 + 选择题刷题 (120分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-13T18:00:00.000+08:00',
  endTime: '2026-11-13T20:00:00.000+08:00',
  durationMinutes: 120,
  mode: 'pomodoro',
  isExtra: false,
  notes: '18:00-20:00 晚间深度专注2小时（120分钟，任务二日标达成率 267% 🔥）：精读研习习概导论与第一章核心考点，全面吃透新时代中国特色社会主义思想的创立背景、历史地位与科学体系；高质高效完成导论与第一章单选、多选题刷题实战与易错选项对比剖析。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === politicsLog.id);
if (logIdx >= 0) {
  data.timeLogs[logIdx] = politicsLog;
} else {
  data.timeLogs.unshift(politicsLog);
}

// Sort timeLogs by startTime descending
data.timeLogs.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// 3. Update Daily Reflection for 2026-11-13
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-13'] = {
  date: '2026-11-13',
  score: 5,
  mood: '🔥 上肢力量巅峰 · 理论考点狂飙',
  summary: '周五全天高质量高强度推进！上午 10:10-12:40 进驻健身房完成 150 分钟上肢大重量推拉与核心专项攻坚（平板卧推冲刺90kg突破 + 零间歇六阶超级递减组70→20kg + 引体向上 + 实力推 + 划船 + 核心三件套），练后足量补充高蛋白营养与补剂；晚间 18:00-20:00 纯沉浸专注 2 小时（120分钟）深入攻克习概导论与第一章理论体系，并高质量完成选择题刷题实操（任务二日标达成率高达 267%）！全天累计深度投入 270 分钟（4.5 小时）！',
  achievements: [
    '任务二 (习概理论与刷题): 18:00-20:00 深入研习导论与第一章 + 选择题专项刷题 (120m，日标达成率 267% 超额突破)',
    '健身房上肢大重量抗阻: 10:10-12:40 卧推90kg突破+六阶超级递减组+引体向上+实力推+划船+核心 (150m，达成度 100%)',
    '高阶运动营养与恢复: 练后补充白切鸡烧腊+满碗米饭+生菜+无糖可乐+2粒鱼油+5g肌酸'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Friday evening 120m politics session!');
