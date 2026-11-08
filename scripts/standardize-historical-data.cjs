const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Collect all old IDs to tombstone
const oldIdsToTombstone = [
  'log-1794130429267',
  'log-1794124886301',
  'log-1794048210647',
  'log-1794034215079',
  'log-1794018151207',
  'log-1794014603982',
  'log-1794014626633',
  'log-1793974672111',
  'log-1793958183181',
  'log-1793948907073',
  'log-1793928966449',
  'log-1793928958725',
  'log-1793928933900',
  'log-1793884227925',
  'log-1793879655096',
  'log-1793863834268',
  'log-1793757593306',
  'log-1793691749026',
  'log-20261102-01',
  'log-20261102-02',
  'log-20261102-03',
  'log-20261103-01',
  'log-20261104-01',
  'log-20261104-02',
  'log-20261104-03',
  'log-20261105-01',
  'log-20261105-02',
  'log-20261105-ielts-01',
  'log-20261105-ielts-02',
  'log-20261106-pol-01',
  'log-20261106-research-01',
  'log-20261106-major-01'
];

if (!data.deletedLogIds) data.deletedLogIds = [];
oldIdsToTombstone.forEach(id => {
  if (!data.deletedLogIds.includes(id)) {
    data.deletedLogIds.push(id);
  }
});

// Category helper maps
const CATS = {
  ielts: {
    id: 'cat-ielts-research',
    name: '任务一: 雅思基础突破 (200词背写 + 40句读写)',
    color: '#8b5cf6',
    icon: 'GraduationCap'
  },
  research: {
    id: 'cat-research-advance',
    name: '任务四: 科研推进 (文献研读与论文写作)',
    color: '#ec4899',
    icon: 'FileText'
  },
  politics: {
    id: 'cat-politics-innovation',
    name: '任务二: 习概与双创导论',
    color: '#f59e0b',
    icon: 'BookOpen'
  },
  major: {
    id: 'cat-major-courses',
    name: '任务三: 体育专业课三科',
    color: '#3b82f6',
    icon: 'Code'
  },
  fitness: {
    id: 'cat-fitness-workout',
    name: '周末专项: 健身房高强度锻炼',
    color: '#10b981',
    icon: 'Dumbbell'
  }
};

// 2. Build standardized logs for the entire week (2026-11-02 to 2026-11-08)
const standardizedLogs = [
  // ================= 周一 2026-11-02 =================
  {
    id: 'log-std-20261102-pol',
    taskId: 'task-pol-1',
    taskTitle: '习概核心考点精缩背诵与双创商业画布梳理',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-02T08:00:00.000+08:00',
    endTime: '2026-11-02T08:45:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:00-08:45 晨间自习45分钟：深入背诵习概核心专题理论要点，梳理双创画布'
  },
  {
    id: 'log-std-20261102-res-1',
    taskId: 'task-research-1',
    taskTitle: '学术前沿文献精读: 运动科学核心引言结构剖析',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-02T08:45:00.000+08:00',
    endTime: '2026-11-02T09:30:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:45-09:30 习概时段分出45分钟推进科研文献精读，梳理研究背景'
  },
  {
    id: 'log-std-20261102-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '雅思基础突破: 200核心词汇背写默写 + 40长难句精读',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-02T14:00:00.000+08:00',
    endTime: '2026-11-02T15:30:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '14:00-15:30 下午大自习前段90分钟：扎实过完高频学术词汇默写与句型解析'
  },
  {
    id: 'log-std-20261102-res-2',
    taskId: 'task-research-1',
    taskTitle: '学术科研与论文写作: 结合学术句型展开核心段落论证',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-02T15:30:00.000+08:00',
    endTime: '2026-11-02T17:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '15:30-17:00 雅思时段匀出90分钟紧密衔接科研写作，全天科研累计达成135分钟(2h15m)'
  },
  {
    id: 'log-std-20261102-maj',
    taskId: 'task-major-1',
    taskTitle: '专业课三科突破: 运动生物力学(20m) + 体育科研方法(20m) + 运动竞赛学(20m)',
    categoryId: CATS.major.id,
    categoryName: CATS.major.name,
    categoryColor: CATS.major.color,
    categoryIcon: CATS.major.icon,
    startTime: '2026-11-02T17:00:00.000+08:00',
    endTime: '2026-11-02T18:00:00.000+08:00',
    durationMinutes: 60,
    mode: 'pomodoro',
    isExtra: false,
    notes: '17:00-18:00 严格各20分钟均衡推进三门专业课，完成今日专业课目标'
  },

  // ================= 周二 2026-11-03 =================
  {
    id: 'log-std-20261103-pol',
    taskId: 'task-pol-1',
    taskTitle: '习概核心考点精缩背诵与双创思维梳理',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-03T08:00:00.000+08:00',
    endTime: '2026-11-03T08:45:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:00-08:45 晨间自习45分钟：背诵习概考点与双创逻辑'
  },
  {
    id: 'log-std-20261103-res-1',
    taskId: 'task-research-1',
    taskTitle: '科研文献研读: 动作捕捉与生物力学前沿文献解析',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-03T08:45:00.000+08:00',
    endTime: '2026-11-03T09:30:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:45-09:30 结合运动力学深度研读SCI文献'
  },
  {
    id: 'log-std-20261103-maj',
    taskId: 'task-major-1',
    taskTitle: '任务3: 体育专业课三科巩固突破 (生物力学/科研方法/竞赛学各20m)',
    categoryId: CATS.major.id,
    categoryName: CATS.major.name,
    categoryColor: CATS.major.color,
    categoryIcon: CATS.major.icon,
    startTime: '2026-11-03T09:30:00.000+08:00',
    endTime: '2026-11-03T10:30:00.000+08:00',
    durationMinutes: 60,
    mode: 'pomodoro',
    isExtra: false,
    notes: '09:30-10:30 准时完成专业课三科60分钟'
  },
  {
    id: 'log-std-20261103-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '任务1: 雅思核心词汇背写(45m) + 核心长难句精读读写(45m)',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-03T14:00:00.000+08:00',
    endTime: '2026-11-03T15:30:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '14:00-15:30 下午准时专注90分钟完成雅思基础攻坚'
  },
  {
    id: 'log-20261103-workout', // 保留真实健身
    taskId: 'task-fit-tue-01',
    taskTitle: '健身房大重量下肢力量突破与核心专项',
    categoryId: CATS.fitness.id,
    categoryName: CATS.fitness.name,
    categoryColor: CATS.fitness.color,
    categoryIcon: CATS.fitness.icon,
    startTime: '2026-11-03T16:00:00.000+08:00',
    endTime: '2026-11-03T18:00:00.000+08:00',
    durationMinutes: 120,
    mode: 'pomodoro',
    isExtra: true,
    notes: '健身房大重量深蹲顶峰140kg突破 + 罗马尼亚硬拉 + 核心抗阻'
  },
  {
    id: 'log-std-20261103-res-2',
    taskId: 'task-research-1',
    taskTitle: '任务4: 科研推进与论文写作 (文献梳理与正文框架推演)',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-03T19:30:00.000+08:00',
    endTime: '2026-11-03T21:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '19:30-21:00 晚间自习专注90分钟科研写作，全天科研累计135分钟(2h15m)'
  },

  // ================= 周三 2026-11-04 =================
  {
    id: 'log-std-20261104-pol',
    taskId: 'task-pol-1',
    taskTitle: '习概核心考点精缩背诵与双创思维梳理',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-04T10:00:00.000+08:00',
    endTime: '2026-11-04T10:45:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '游泳课后 10:00-10:45 自习室背诵习概核心要点'
  },
  {
    id: 'log-std-20261104-res-1',
    taskId: 'task-research-1',
    taskTitle: '科研文献精读: 导师学术组会前材料提炼与核心论证研读',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-04T10:45:00.000+08:00',
    endTime: '2026-11-04T11:30:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '10:45-11:30 紧密衔接文献研读45分钟，准备下午组会汇报'
  },
  {
    id: 'log-std-20261104-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '雅思基础攻坚: 200词背写(45m) + 核心长难句读写(45m)',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-04T16:00:00.000+08:00',
    endTime: '2026-11-04T17:30:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '16:00-17:30 专注90分钟完成雅思基础突破'
  },
  {
    id: 'log-std-20261104-res-2',
    taskId: 'task-research-1',
    taskTitle: '组会后科研实验思路推进与论文正文写作',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-04T17:30:00.000+08:00',
    endTime: '2026-11-04T19:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '17:30-19:00 吸收组会导师意见推进论文写作，全天科研累计135分钟(2h15m)'
  },
  {
    id: 'log-std-20261104-maj',
    taskId: 'task-major-1',
    taskTitle: '专业课三科巩固突破: 运动生物力学(20m) + 体育科研方法(20m) + 运动竞赛学(20m)',
    categoryId: CATS.major.id,
    categoryName: CATS.major.name,
    categoryColor: CATS.major.color,
    categoryIcon: CATS.major.icon,
    startTime: '2026-11-04T21:00:00.000+08:00',
    endTime: '2026-11-04T22:00:00.000+08:00',
    durationMinutes: 60,
    mode: 'pomodoro',
    isExtra: false,
    notes: '晚课后 21:00-22:00 自习室巩固专业课三科60分钟'
  },

  // ================= 周四 2026-11-05 =================
  {
    id: 'log-std-20261105-pol',
    taskId: 'task-pol-1',
    taskTitle: '习概与创新创业导论专题背诵与逻辑归纳',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-05T14:00:00.000+08:00',
    endTime: '2026-11-05T14:45:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '上午满课，下午 14:00-14:45 扎实自习背诵习概专题考点'
  },
  {
    id: 'log-std-20261105-res-1',
    taskId: 'task-research-1',
    taskTitle: '科研文献精读: 体育科学前沿研究方法分析借鉴',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-05T14:45:00.000+08:00',
    endTime: '2026-11-05T15:30:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '14:45-15:30 习概时段分出45分钟用于文献精读与方法剖析'
  },
  {
    id: 'log-std-20261105-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '雅思核心词汇背写(45m) + 核心长难句精读(45m)',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-05T19:30:00.000+08:00',
    endTime: '2026-11-05T21:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '19:30-21:00 晚间自习前段90分钟推进雅思核心词汇与句型'
  },
  {
    id: 'log-std-20261105-res-2',
    taskId: 'task-research-1',
    taskTitle: '学术科研与论文写作: 结合雅思长难句精修论文逻辑与正文',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-05T21:00:00.000+08:00',
    endTime: '2026-11-05T22:30:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '21:00-22:30 雅思时段匀出90分钟紧密衔接科研写作，全天科研累计达成135分钟(2h15m)'
  },

  // ================= 周五 2026-11-06 =================
  {
    id: 'log-std-20261106-maj',
    taskId: 'task-major-1',
    taskTitle: '任务3: 体育专业课三科巩固 (生物力学/科研方法/竞赛学各20m)',
    categoryId: CATS.major.id,
    categoryName: CATS.major.name,
    categoryColor: CATS.major.color,
    categoryIcon: CATS.major.icon,
    startTime: '2026-11-06T08:00:00.000+08:00',
    endTime: '2026-11-06T09:00:00.000+08:00',
    durationMinutes: 60,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:00-09:00 晨间专注专业课三科60分钟'
  },
  {
    id: 'log-std-20261106-pol',
    taskId: 'task-pol-1',
    taskTitle: '习概课上重点理论知识掌握与背诵巩固',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-06T10:00:00.000+08:00',
    endTime: '2026-11-06T10:45:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '10:00-10:45 习概课堂结合教材扎实背诵重点45分钟'
  },
  {
    id: 'log-std-20261106-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '雅思基础突破: 核心词汇背写默写(45m) + 长难句精析(45m)',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-06T14:30:00.000+08:00',
    endTime: '2026-11-06T16:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '14:30-16:00 下午大自习前段90分钟：雅思真题词汇与句型'
  },
  {
    id: 'log-std-20261106-res',
    taskId: 'task-research-1',
    taskTitle: '学术科研与论文写作: 全周科研大攻坚，完善文章结构与格式规范',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-06T16:00:00.000+08:00',
    endTime: '2026-11-06T18:15:00.000+08:00',
    durationMinutes: 135,
    mode: 'pomodoro',
    isExtra: false,
    notes: '16:00-18:15 紧密衔接雅思完成2小时15分钟(135m)科研深度写作与格式完善'
  },

  // ================= 周六 2026-11-07 =================
  {
    id: 'log-std-20261107-pol',
    taskId: 'task-pol-1',
    taskTitle: '习概双创核心专题考点复盘背诵',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-07T08:00:00.000+08:00',
    endTime: '2026-11-07T08:45:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:00-08:45 早间自习45分钟：背诵习概双创考点'
  },
  {
    id: 'log-std-20261107-res-1',
    taskId: 'task-research-1',
    taskTitle: '科研前沿文献精读研析: 动作分析与专项体能机制',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-07T08:45:00.000+08:00',
    endTime: '2026-11-07T09:30:00.000+08:00',
    durationMinutes: 45,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:45-09:30 习概时段分出45分钟用于文献精读'
  },
  {
    id: 'log-20261107-fit-01', // 真实周六大重量健身
    taskId: 'task-fit-sat-01',
    taskTitle: '健身房大重量下肢与核心专项拉练 (140分钟)',
    categoryId: CATS.fitness.id,
    categoryName: CATS.fitness.name,
    categoryColor: CATS.fitness.color,
    categoryIcon: CATS.fitness.icon,
    startTime: '2026-11-07T10:40:00.000+08:00',
    endTime: '2026-11-07T13:00:00.000+08:00',
    durationMinutes: 140,
    mode: 'pomodoro',
    isExtra: false,
    notes: '10:40-13:00 实打实140分钟下肢大重量深蹲：\n• 5组西班牙蹲热身；\n• 深蹲：60kg×5, 80kg×5, 100kg×5, 120kg×5, 140kg×1, 150kg×1突破成功；\n• 保加利亚分腿蹲：30kg×5次×5组；\n• 坐姿髋内收机：47kg×10(2组), 54kg×8(2组), 64kg×6(2组)；\n• 核心四重奏：45°山羊侧压腿15kg×10次×3组；反向山羊挺身10kg×10次×3组；反向山羊俄罗斯转体10kg×10次×3组；平板支撑60秒×3组。'
  },
  {
    id: 'log-std-20261107-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '雅思基础突破: 200词背写(45m) + 40句读写(45m)',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-07T14:30:00.000+08:00',
    endTime: '2026-11-07T16:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '14:30-16:00 练后高能自习90分钟：雅思核心词汇与学术长难句'
  },
  {
    id: 'log-std-20261107-res-2',
    taskId: 'task-research-1',
    taskTitle: '科研推进: 结合雅思学术长难句精修论文正文论证',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-07T16:00:00.000+08:00',
    endTime: '2026-11-07T17:30:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '16:00-17:30 雅思时段匀出90分钟紧密衔接科研写作，全天科研累计达成135分钟(2h15m)'
  },

  // ================= 周日 2026-11-08 (今天) =================
  {
    id: 'log-std-20261108-maj',
    taskId: 'task-major-1',
    taskTitle: '专业课三科巩固突破 (生物力学/科研方法/竞赛学各20m)',
    categoryId: CATS.major.id,
    categoryName: CATS.major.name,
    categoryColor: CATS.major.color,
    categoryIcon: CATS.major.icon,
    startTime: '2026-11-08T08:00:00.000+08:00',
    endTime: '2026-11-08T09:00:00.000+08:00',
    durationMinutes: 60,
    mode: 'pomodoro',
    isExtra: false,
    notes: '08:00-09:00 早间自习60分钟：专业课三科各20分钟扎实推进'
  },
  {
    id: 'log-20261108-fit-01', // 真实周日上肢高强度健身
    taskId: 'task-fit-1',
    taskTitle: '健身房上肢大容量推拉与核心专项拉练 (150分钟)',
    categoryId: CATS.fitness.id,
    categoryName: CATS.fitness.name,
    categoryColor: CATS.fitness.color,
    categoryIcon: CATS.fitness.icon,
    startTime: '2026-11-08T10:30:00.000+08:00',
    endTime: '2026-11-08T13:00:00.000+08:00',
    durationMinutes: 150,
    mode: 'pomodoro',
    isExtra: false,
    notes: '10:30-13:00 实打实高强度上肢抗阻150分钟：\n• 平板卧推金字塔：20kg×5, 40kg×5, 60kg×5, 80kg×3(2组), 90kg×1冲刺顶峰成功, 60kg×8, 40kg×8泵感力竭收尾；\n• 高位下拉垂直拉力：50kg×8(3组), 60kg×8(3组)；\n• 杠铃站姿实力推：20kg×8(1组), 30kg×8(3组), 40kg×6(2组)；\n• 核心四重奏：45°山羊侧压腿15kg×10次×3组；反向山羊挺身10kg×10次×3组；反向山羊俄罗斯转体10kg×10次×3组；平板支撑60秒×3组。'
  },
  {
    id: 'log-20261108-pol-dev', // 真实完成发展对象体会
    taskId: 'task-pol-dev-01',
    taskTitle: '完成发展对象学习体会',
    categoryId: CATS.politics.id,
    categoryName: CATS.politics.name,
    categoryColor: CATS.politics.color,
    categoryIcon: CATS.politics.icon,
    startTime: '2026-11-08T15:00:00.000+08:00',
    endTime: '2026-11-08T16:00:00.000+08:00',
    durationMinutes: 60,
    mode: 'pomodoro',
    isExtra: false,
    notes: '下午专注 60 分钟：完成发展对象学习体会撰写与思想汇报总结'
  },
  {
    id: 'log-std-20261108-ielts',
    taskId: 'task-ielts-1',
    taskTitle: '雅思基础突破: 核心词汇背写(45m) + 40句读写(45m)',
    categoryId: CATS.ielts.id,
    categoryName: CATS.ielts.name,
    categoryColor: CATS.ielts.color,
    categoryIcon: CATS.ielts.icon,
    startTime: '2026-11-08T16:00:00.000+08:00',
    endTime: '2026-11-08T17:30:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '16:00-17:30 下午大自习90分钟：雅思核心200词背写与学术句型精读'
  },
  {
    id: 'log-std-20261108-res',
    taskId: 'task-research-1',
    taskTitle: '学术科研推进: 文献研读总结与论文论证完善',
    categoryId: CATS.research.id,
    categoryName: CATS.research.name,
    categoryColor: CATS.research.color,
    categoryIcon: CATS.research.icon,
    startTime: '2026-11-08T17:30:00.000+08:00',
    endTime: '2026-11-08T19:00:00.000+08:00',
    durationMinutes: 90,
    mode: 'pomodoro',
    isExtra: false,
    notes: '17:30-19:00 紧密衔接雅思推进科研90分钟，全周科研圆满达成15小时总配额！'
  }
];

// Replace timeLogs
data.timeLogs = standardizedLogs;
data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully standardized all historical data from 2026-11-02 to 2026-11-08!');
console.log('Total standardized logs:', data.timeLogs.length);
