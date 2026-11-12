const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Task: 专业核心与理论体系整合: 生物力学、竞赛编排与习概知识梳理 (90m)
const thursdayTask = {
  id: 'task-major-integrated-20261112',
  categoryId: 'cat-major-courses',
  title: '专业课三科与理论整合: 生物力学、竞赛组织编排与习概考点梳理',
  completed: true,
  targetMinutes: 90,
  actualMinutes: 90,
  estimatedPomodoros: 3,
  completedPomodoros: 3,
  notes: '19:00-20:30 晚间高专注投入90分钟：系统梳理整合运动生物力学（肌肉力学/起跳着地缓冲/角动量守恒）、运动竞赛学（单双淘汰/单循环贝格尔编排与场次轮次计算/同分破平）以及习概核心理论体系（十个明确/十四个坚持/十三个方面成就/六个必须坚持），并成功生成专属排版学术PDF手册。',
  createdAt: '2026-11-12T19:00:00.000+08:00',
  completedAt: '2026-11-12T20:30:00.000+08:00'
};

const taskIdx = data.tasks.findIndex(t => t.id === thursdayTask.id);
if (taskIdx >= 0) {
  data.tasks[taskIdx] = thursdayTask;
} else {
  data.tasks.unshift(thursdayTask);
}

// 2. Log: 专业课三科学习90分钟 (19:00 - 20:30)
const thursdayLog = {
  id: 'log-20261112-major-integrated',
  taskId: 'task-major-integrated-20261112',
  taskTitle: '任务三: 运动生物力学+竞赛组织编排+习概核心梳理 (90分钟)',
  categoryId: 'cat-major-courses',
  categoryName: '任务三: 体育专业课三科',
  categoryColor: '#3b82f6',
  categoryIcon: 'Code',
  startTime: '2026-11-12T19:00:00.000+08:00',
  endTime: '2026-11-12T20:30:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '19:00-20:30 晚间高强度专注90分钟（任务三超额攻坚 150%）：深入完成运动生物力学四大力学机制、运动竞赛组织与赛制编排（淘汰赛与循环赛全公式与贝格尔编排法）以及习概核心知识体系框架梳理，产出并归档高质量学术 PDF 整合手册。'
};

const logIdx = data.timeLogs.findIndex(l => l.id === thursdayLog.id);
if (logIdx >= 0) {
  data.timeLogs[logIdx] = thursdayLog;
} else {
  data.timeLogs.unshift(thursdayLog);
}

// Sort timeLogs by startTime descending
data.timeLogs.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

// 3. Update Daily Reflection for 2026-11-12
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-12'] = {
  date: '2026-11-12',
  score: 5,
  mood: '📚 学术攻坚 · 知识体系大贯通',
  summary: '周四晚间 19:00-20:30 纯沉浸专注 90 分钟！全面攻克运动生物力学（肌力-长度/肌力-速度/SSC周期/起跳着地冲量/空中角动量守恒）、运动竞赛学（单双淘汰赛制/单循环赛制场次与轮次全公式/贝格尔顺时针逆时针编排法/同分破平规则）以及习概理论（十个明确/十四个坚持/十三个方面成就/六个必须坚持），并成功生成导出高清排版学术 PDF《专业课三科与习概核心考点梳理整合手册.pdf》，专业核心实力扎实进阶！',
  achievements: [
    '任务三 (专业课三科理论整合): 19:00-20:30 深度梳理生物力学、竞赛编排与习概考点 (90m，达成度 150%)',
    '学术产出与成果转化: 成功导出高清排版 PDF 手册《专业课三科与习概核心考点梳理整合手册.pdf》'
  ]
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully recorded Thursday night 90m major courses session!');
