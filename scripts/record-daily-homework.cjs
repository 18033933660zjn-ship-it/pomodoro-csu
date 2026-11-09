const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Add/Update the 4 tasks under cat-homework-custom
const newTasks = [
  {
    id: 'task-hw-20261109-01',
    categoryId: 'cat-homework-custom',
    title: '完成发展对象PPT制作',
    completed: true,
    targetMinutes: 45,
    actualMinutes: 45,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    notes: '党课培训与发展对象答辩/汇报展示 PPT 全面制作完成',
    createdAt: '2026-11-09T15:29:25.000+08:00',
    completedAt: '2026-11-09T16:29:26.000+08:00'
  },
  {
    id: 'task-hw-20261109-02',
    categoryId: 'cat-homework-custom',
    title: '写发展对象笔记',
    completed: true,
    targetMinutes: 35,
    actualMinutes: 35,
    estimatedPomodoros: 1,
    completedPomodoros: 1,
    notes: '撰写发展对象培训理论学习笔记与思想汇报心得',
    createdAt: '2026-11-09T17:12:38.000+08:00',
    completedAt: '2026-11-09T18:12:38.000+08:00'
  },
  {
    id: 'task-hw-20261109-03',
    categoryId: 'cat-homework-custom',
    title: '完成发展对象自传修改（完成一半）',
    completed: false, // 进行中，完成一半
    targetMinutes: 40,
    actualMinutes: 20,
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    notes: '发展对象自传精修：已完成前文个人成长履历与思想演进部分（完成一半），待后续继续收尾完善',
    createdAt: '2026-11-09T15:29:25.000+08:00'
  },
  {
    id: 'task-hw-20261109-04',
    categoryId: 'cat-homework-custom',
    title: '优化和完善创新创业导论的汇报PPT',
    completed: true,
    targetMinutes: 40,
    actualMinutes: 40,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    notes: '全面优化和完善创新创业导论课堂汇报 PPT，打磨商业逻辑架构与汇报视觉排版',
    createdAt: '2026-11-09T17:12:38.000+08:00',
    completedAt: '2026-11-09T21:40:00.000+08:00'
  }
];

// Merge into tasks (replace if existing by id or title, otherwise prepend)
newTasks.forEach(task => {
  const existingIdx = data.tasks.findIndex(t => t.id === task.id || t.title === task.title);
  if (existingIdx >= 0) {
    data.tasks[existingIdx] = { ...data.tasks[existingIdx], ...task };
  } else {
    data.tasks.unshift(task);
  }
});

// 2. Update the two existing 60-minute time logs for today to carry specific task substance
const log1 = data.timeLogs.find(l => l.id === 'log-1794212966479');
if (log1) {
  log1.taskId = 'task-hw-20261109-01';
  log1.taskTitle = '日常研习: 发展对象PPT制作与自传修改';
  log1.notes = '1. 完成发展对象PPT制作；2. 推进发展对象自传修改（完成一半）';
}

const log2 = data.timeLogs.find(l => l.id === 'log-1794219158325');
if (log2) {
  log2.taskId = 'task-hw-20261109-04';
  log2.taskTitle = '日常作业: 写发展对象笔记与优化双创汇报PPT';
  log2.notes = '1. 撰写发展对象学习笔记；2. 优化和完善创新创业导论的汇报PPT';
}

// 3. Add / Update Daily Reflection for 2026-11-09
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-09'] = {
  date: '2026-11-09',
  score: 5,
  mood: '🚀 高效充实',
  summary: '新一周周一高效启动！晨间09:00准时进行英语vlog泛听30分钟；下午自主研习全情投入2小时，扎实推进党课发展对象材料与双创汇报PPT；晚间按时完成创新创业导论理论课。日常作业与自选研习收获丰硕！',
  achievements: [
    '任务一 (雅思基础): 晨间 09:00-09:30 听英语vlog 30分钟，高频真实语料输入',
    '日常作业 1: 完成发展对象答辩/汇报 PPT 制作',
    '日常作业 2: 撰写完成发展对象学习笔记',
    '日常作业 3: 发展对象自传深度精修，已扎实完成一半',
    '日常作业 4: 全面优化和完善创新创业导论课程汇报 PPT',
    '大学课程全勤: 足球(一) 10:00-11:40 + 创新创业导论 19:00-20:40'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded the 4 homework & self-study tasks and linked today logs & reflection!');
