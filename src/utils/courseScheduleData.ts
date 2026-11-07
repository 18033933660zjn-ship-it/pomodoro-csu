import type { CourseItem, StudyCheckpoint } from '@/types'

// 用户大学课程表 (根据教务系统课表图片与描述深度定制)
export const weeklyCourses: CourseItem[] = [
  // 周一
  {
    id: 'course-mon-1',
    name: '足球 (一)',
    dayOfWeek: 1,
    time: '10:00-11:40',
    location: '新体育馆室内篮球场 (西二入口)',
    instructor: '结曼 [讲师]',
    weeks: '1-16周'
  },
  {
    id: 'course-mon-2',
    name: '创新创业导论',
    dayOfWeek: 1,
    time: '19:00-20:40',
    location: 'A座104',
    instructor: '邓湘 [副教授]',
    weeks: '3-18周'
  },

  // 周二
  {
    id: 'course-tue-1',
    name: '专业技能训练 (五)',
    dayOfWeek: 2,
    time: '16:00-17:40',
    location: '新体育馆',
    instructor: '齐滔 [副教授]',
    weeks: '1-16周'
  },

  // 周三
  {
    id: 'course-wed-1',
    name: '游泳 (一)',
    dayOfWeek: 3,
    time: '08:00-09:40',
    location: '游泳馆144',
    instructor: '李正俊 [教授]',
    weeks: '2-16周'
  },
  {
    id: 'course-wed-2',
    name: '每周学术科研组会',
    dayOfWeek: 3,
    time: '13:00-14:00',
    location: '学院学术会议室',
    instructor: '导师课题组',
    weeks: '全学期'
  },
  {
    id: 'course-wed-party',
    name: '专题党课与思想政治理论培训',
    dayOfWeek: 3,
    time: '14:00-16:00',
    location: '学院党校 / 教学报告厅',
    instructor: '组织部 / 理论导师',
    weeks: '今日专设'
  },
  {
    id: 'course-wed-3',
    name: '运动生物力学',
    dayOfWeek: 3,
    time: '19:00-20:40',
    location: '新体育馆A111',
    instructor: '邓力霆 [特聘副教授]',
    weeks: '1-3, 5-16周'
  },

  // 周四
  {
    id: 'course-thu-1',
    name: '体育科学研究方法',
    dayOfWeek: 4,
    time: '08:00-09:40',
    location: '新体育馆144',
    instructor: '陈天玉',
    weeks: '1-16周'
  },
  {
    id: 'course-thu-2',
    name: '羽毛球 (一)',
    dayOfWeek: 4,
    time: '10:00-11:40',
    location: '新体育馆',
    instructor: '周璐 [副教授]',
    weeks: '1-16周'
  },
  {
    id: 'course-thu-3',
    name: '专业技能训练 (五)',
    dayOfWeek: 4,
    time: '16:00-17:40',
    location: '新体育馆',
    instructor: '齐滔 [副教授]',
    weeks: '1-16周'
  },

  // 周五
  {
    id: 'course-fri-1',
    name: '习近平新时代中国特色社会主义思想概论 (习概)',
    dayOfWeek: 5,
    time: '10:00-11:40',
    location: 'D座207',
    instructor: '李贵丽 [讲师]',
    weeks: '3-18周'
  },
  {
    id: 'course-fri-2',
    name: '运动竞赛学',
    dayOfWeek: 5,
    time: '19:00-20:40',
    location: '新体育馆A111',
    instructor: '王的荣 [副教授]',
    weeks: '1-16周'
  }
]

// 预设严格的每日自习室 / 健身房打卡时间节点库
export const weeklyCheckpoints: StudyCheckpoint[] = [
  // 周一
  {
    id: 'cp-mon-1',
    dayOfWeek: 1,
    time: '08:00',
    target: '自习室',
    taskName: '任务2: 习概与创新创业导论 (90分钟)',
    durationMinutes: 90,
    description: '08:00前必须到达自习室打卡，学习至09:30，随后前往足球课'
  },
  {
    id: 'cp-mon-2',
    dayOfWeek: 1,
    time: '14:00',
    target: '自习室',
    taskName: '任务1 (雅思基础突破 200词背写+40句读写 · 180m) + 任务3 (专业课三科 60m)',
    durationMinutes: 240,
    description: '14:00前到达自习室打卡，下午无课连续攻坚4小时，18:00后去晚餐并准备19:00双创课'
  },

  // 周二
  {
    id: 'cp-tue-1',
    dayOfWeek: 2,
    time: '08:00',
    target: '自习室',
    taskName: '任务2 (习概双创 90m) + 任务3 (专业课 60m)',
    durationMinutes: 150,
    description: '08:00前到达自习室打卡，上午无课，专注至10:30后回宿舍午休'
  },
  {
    id: 'cp-tue-2',
    dayOfWeek: 2,
    time: '14:00',
    target: '自习室',
    taskName: '任务1前半段: 雅思核心词汇背写 (200词 · 90分钟)',
    durationMinutes: 90,
    description: '14:00前到达自习室打卡，专注90分钟完成200个核心词汇背写默写，准备16:00专业技能课'
  },
  {
    id: 'cp-tue-3',
    dayOfWeek: 2,
    time: '19:30',
    target: '自习室',
    taskName: '任务1后半段: 雅思核心句型读写 (40句 · 90分钟)',
    durationMinutes: 90,
    description: '19:30前到达自习室打卡，专注90分钟完成40个核心句型的精读与读写仿写，21:00完成全天所有任务'
  },

  // 周三
  {
    id: 'cp-wed-1',
    dayOfWeek: 3,
    time: '10:00',
    target: '自习室',
    taskName: '任务2: 习概与创新创业导论 (90分钟)',
    durationMinutes: 90,
    description: '游泳课下课后10:00前到达自习室打卡，专注至11:30后回宿舍午休，准备13:00组会'
  },
  {
    id: 'cp-wed-2',
    dayOfWeek: 3,
    time: '16:00',
    target: '自习室',
    taskName: '任务1前半段: 雅思核心词汇背写(200词) + 句型读写前半段 (150分钟)',
    durationMinutes: 150,
    description: '党课下课后 16:00 前到达自习室打卡，专注完成200词背写(90m)并推进句型读写(60m)'
  },
  {
    id: 'cp-wed-3',
    dayOfWeek: 3,
    time: '21:00',
    target: '自习室',
    taskName: '任务1句型收尾(30m · 补齐40句) + 任务3: 专业课巩固 (60m)',
    durationMinutes: 90,
    description: '晚课下课后 21:00 前到达自习室打卡，补齐今日雅思剩余句型并巩固专业课60分钟，全天200词+40句满贯达标！'
  },

  // 周四
  {
    id: 'cp-thu-1',
    dayOfWeek: 4,
    time: '14:00',
    target: '自习室',
    taskName: '任务2: 习概与创新创业导论 (90分钟)',
    durationMinutes: 90,
    description: '上午满课，下午14:00前到达自习室打卡，专注至15:30，准备16:00专业技能训练课'
  },
  {
    id: 'cp-thu-2',
    dayOfWeek: 4,
    time: '19:30',
    target: '自习室',
    taskName: '任务1: 雅思基础突破 (200词背写90m + 40句读写90m · 180分钟)',
    durationMinutes: 180,
    description: '19:30前到达自习室打卡，专注3小时：前1.5h背写200词，后1.5h读写40句至22:30'
  },

  // 周五
  {
    id: 'cp-fri-1',
    dayOfWeek: 5,
    time: '08:00',
    target: '自习室',
    taskName: '任务3: 专业课三科学习 (60分钟)',
    durationMinutes: 60,
    description: '08:00前到达自习室打卡，专注生物力学/科研方法/竞赛学，09:00完成后去10:00习概课(课上完成任务2)'
  },
  {
    id: 'cp-fri-2',
    dayOfWeek: 5,
    time: '14:30',
    target: '自习室',
    taskName: '任务1: 雅思基础突破 (200词背写90m + 40句读写90m · 180分钟)',
    durationMinutes: 180,
    description: '14:30前到达自习室打卡，专注3小时：前1.5h背写200词，后1.5h读写40句至17:30'
  },

  // 周六
  {
    id: 'cp-sat-1',
    dayOfWeek: 6,
    time: '08:00',
    target: '自习室',
    taskName: '任务2: 习概与创新创业导论 (90分钟)',
    durationMinutes: 90,
    description: '全天无课，08:00前到达自习室打卡，因早间晚到自主补时延后至10:30，随后前往健身房'
  },
  {
    id: 'cp-sat-2',
    dayOfWeek: 6,
    time: '10:30',
    target: '健身房',
    taskName: '健身房力量与心肺高强度锻炼 (120-150分钟)',
    durationMinutes: 150,
    description: '根据早间自习补学调整：推迟半小时至 10:30 开始，力量与心肺高强度训练至 13:00，随后午餐午休'
  },
  {
    id: 'cp-sat-3',
    dayOfWeek: 6,
    time: '14:30',
    target: '自习室',
    taskName: '任务1: 雅思基础突破 (200词背写90m + 40句读写90m · 180分钟)',
    durationMinutes: 180,
    description: '14:30前到达自习室打卡，专注3小时：前1.5h背写200词，后1.5h读写40句，周六不进行任务三'
  },

  // 周日
  {
    id: 'cp-sun-1',
    dayOfWeek: 7,
    time: '08:00',
    target: '自习室',
    taskName: '任务3: 专业课三科深度攻坚 (60分钟)',
    durationMinutes: 60,
    description: '全天无课，08:00前到达自习室打卡，完成专业三科各20分钟，周日不进行任务二'
  },
  {
    id: 'cp-sun-2',
    dayOfWeek: 7,
    time: '10:00',
    target: '健身房',
    taskName: '健身房体能雕刻与抗阻训练 (150分钟)',
    durationMinutes: 150,
    description: '10:00前到达健身房打卡，训练2.5小时至12:30，午休恢复精力'
  },
  {
    id: 'cp-sun-3',
    dayOfWeek: 7,
    time: '14:30',
    target: '自习室',
    taskName: '任务1: 雅思基础突破 (200词背写90m + 40句读写90m · 180分钟) + 周末全维复盘生成',
    durationMinutes: 180,
    description: '14:30前到达自习室打卡，专注3小时：前1.5h背写200词，后1.5h读写40句，完成后自动触发每周总复盘汇报！'
  }
]
