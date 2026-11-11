const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 习概导论与第一章 + 刷题 (90m)
const politicsTask = {
  id: 'task-pol-intro-ch1-20261111',
  categoryId: 'cat-politics-innovation',
  title: '学习习概导论与第一章 + 导论选择题刷题训练',
  completed: true,
  targetMinutes: 45,
  actualMinutes: 90,
  estimatedPomodoros: 2,
  completedPomodoros: 3,
  notes: '15:50-17:20 下午深度专注90分钟（超额完成200%日标）：系统研读习概导论与第一章核心理论体系，深入掌握习近平新时代中国特色社会主义思想的创立背景、历史地位与科学体系；并针对导论完成单选题与多选题强化刷题训练与错题辨析。',
  createdAt: '2026-11-11T15:50:00.000+08:00',
  completedAt: '2026-11-11T17:20:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === politicsTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = politicsTask;
} else {
  data.tasks.unshift(politicsTask);
}

// 2. Log: 习概导论与第一章 + 刷题 (90m)
const politicsLog = {
  id: 'log-20261111-pol-intro-ch1',
  taskId: 'task-pol-intro-ch1-20261111',
  taskTitle: '任务二: 学习习概导论与第一章 + 导论单选多选刷题 (90分钟)',
  categoryId: 'cat-politics-innovation',
  categoryName: '任务二: 习概与双创导论',
  categoryColor: '#f59e0b',
  categoryIcon: 'BookOpen',
  startTime: '2026-11-11T15:50:00.000+08:00',
  endTime: '2026-11-11T17:20:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '15:50-17:20 下午深度学习90分钟（任务二日标45m，达成率达 200% 🔥）：系统精读习概导论与第一章理论知识，构建思想理论框架；并在课后题库中高质量完成导论单选题与多选题巩固实战，精准把控辨析细节。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === politicsLog.id);
if (logIdx >= 0) {
  data.timeLogs[logIdx] = politicsLog;
} else {
  data.timeLogs.unshift(politicsLog);
}

// Sort timeLogs by startTime descending
data.timeLogs.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// 3. Update Daily Reflection for 2026-11-11
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-11'] = {
  date: '2026-11-11',
  score: 5,
  mood: '🔥 文武双全 · 学术与体能全面爆发',
  summary: '周三全天体能、专项与理论学习全线爆发！早间 09:10-09:40 听 YouTube 英语 vlog（30m）；09:18-09:40 22分钟内高效收尾完成昨晚剩余党课笔记；上午 10:10-12:40 进驻健身房完成 150 分钟下肢大重量深蹲（120kg×4组）+ 30kg哑铃保加利亚蹲（5组）+ 核心四重奏；随后 12:50-13:40 篮球场 50 分钟高强度专项练习；午餐足量补充白切鸡烧腊与大份生菜，饭后补充97%高纯鱼油+5g一水肌酸，15:00加餐25g坚果稳态供能；下午 15:50-17:20 深度专注 90 分钟攻克习概导论与第一章理论，并完成导论单选与多选刷题巩固（任务二 200% 超额达成）！全天有效专注达 342 分钟（5.7 小时）！',
  achievements: [
    '任务二 (习概理论与刷题): 15:50-17:20 深入学习导论与第一章 + 导论单选多选题刷题巩固 (90m，日标达成率 200% 超额突破)',
    '健身房大重量下肢抗阻: 10:10-12:40 靠墙静蹲+120kg深蹲4组+30kg保加利亚蹲+核心四重奏 (150m)',
    '篮球专项技术与体能: 12:50-13:40 篮球场专项练习50分钟，力量迁移实战 (50m)',
    '任务一 (英语听力): 09:10-09:40 晨间听YouTube英语vlog磨耳朵 (30m)',
    '日常作业与自主研习: 09:18-09:40 晨间22分钟内高效收尾完成昨晚剩余党课笔记 (22m)',
    '高阶运动营养与补剂超量恢复: 瑞幸冰美式 + 白切鸡烧腊高蛋白高碳水 + 饭后2粒97%高纯鱼油+5g一水肌酸 + 15:00坚果25g'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Wednesday afternoon 90m politics intro & ch1 study with quiz practice!');
