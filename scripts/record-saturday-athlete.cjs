const fs = require('fs');
const path = require('path');

const storageFile = path.resolve(__dirname, '../data/storage.json');
const publicStorageFile = path.resolve(__dirname, '../public/storage.json');
const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

// 1. Gym Lower Body + Drop Set + Adductors + Core (11:20 - 13:00, 100m)
const gymLog = {
  id: 'log-20261114-gym-lowerbody',
  taskId: 'task-fit-20261114-leg',
  taskTitle: '健身房下肢大重量深蹲130kg+五阶无间歇递减组+内收肌与平板支撑 (100分钟)',
  categoryId: 'cat-fitness-workout',
  categoryName: '周末专项: 健身房高强度锻炼',
  categoryColor: '#10b981',
  categoryIcon: 'Dumbbell',
  startTime: '2026-11-14T11:20:00.000+08:00',
  endTime: '2026-11-14T13:00:00.000+08:00',
  durationMinutes: 100,
  mode: 'pomodoro',
  isExtra: false,
  notes: '11:20-13:00 周六下肢极致负荷拉练（训前10:25饮用库迪[冰]铂金精品美式加浓450ml无糖无奶）：\n• 靠墙静蹲：5组×30秒（VMO激活与髌腱等长镇痛）；\n• 杠铃深蹲递增+五阶无间歇递减组（52次/4,620kg总容量）：60kg×5, 80kg×5, 100kg×5, 2组120kg×5, 1组130kg×4顶峰，紧接着无间歇递减组 110kg×4→90kg×4→80kg×5→60kg×5→40kg×5；\n• 坐姿髋内收肌训练（34次/1,992kg）：2组54kg×8, 1组60kg×6, 2组64kg×6；\n• 平板支撑：60秒×5组（累计5分钟腹横肌静态稳固）。'
};

const gymTask = {
  id: 'task-fit-20261114-leg',
  categoryId: 'cat-fitness-workout',
  title: '周六健身房下肢深蹲130kg + 五阶无间歇递减组 + 髋内收 + 平板支撑',
  completed: true,
  targetMinutes: 100,
  actualMinutes: 100,
  estimatedPomodoros: 4,
  completedPomodoros: 4,
  notes: '11:20-13:00 下肢高机械张力+极限代谢压力轰炸（深蹲总容量4,620kg），库迪加浓冰美式精准激活中枢',
  createdAt: '2026-11-14T11:20:00.000+08:00',
  completedAt: '2026-11-14T13:00:00.000+08:00'
};

// 2. Indoor Basketball Moving Shooting (13:10 - 14:40, 90m)
const bballLog = {
  id: 'log-20261114-basketball-shooting',
  taskId: 'task-fit-20261114-bball',
  taskTitle: '室内球馆行进间投篮练习（结合运球） (90分钟)',
  categoryId: 'cat-fitness-workout',
  categoryName: '周末专项: 健身房高强度锻炼',
  categoryColor: '#10b981',
  categoryIcon: 'Dumbbell',
  startTime: '2026-11-14T13:10:00.000+08:00',
  endTime: '2026-11-14T14:40:00.000+08:00',
  durationMinutes: 90,
  mode: 'pomodoro',
  isExtra: false,
  notes: '13:10-14:40 室内篮球馆高强度行进间投篮练习90分钟（结合运球衔接、急停跳投、运球变向后脚步制动出手），在下肢深蹲五阶递减组高乳酸耗竭后强行磨砺动态投篮稳定性与2号位神经肌肉控制。'
};

const bballTask = {
  id: 'task-fit-20261114-bball',
  categoryId: 'cat-fitness-workout',
  title: '室内球馆行进间运球投篮专项练习',
  completed: true,
  targetMinutes: 90,
  actualMinutes: 90,
  estimatedPomodoros: 3,
  completedPomodoros: 3,
  notes: '13:10-14:40 深蹲大消耗后无缝衔接90分钟运球+行进间投篮专项转换',
  createdAt: '2026-11-14T13:10:00.000+08:00',
  completedAt: '2026-11-14T14:40:00.000+08:00'
};

// Merge logs
[bballLog, gymLog].forEach(newLog => {
  const idx = data.timeLogs.findIndex(l => l.id === newLog.id);
  if (idx >= 0) data.timeLogs[idx] = newLog;
  else data.timeLogs.unshift(newLog);
});

// Merge tasks
[bballTask, gymTask].forEach(newTask => {
  const idx = data.tasks.findIndex(t => t.id === newTask.id);
  if (idx >= 0) data.tasks[idx] = newTask;
  else data.tasks.unshift(newTask);
});

// Sort timeLogs descending
data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

// 3. Reflection for 2026-11-14
if (!data.reflections) data.reflections = {};
data.reflections['2026-11-14'] = {
  date: '2026-11-14',
  score: 5,
  mood: '🔥 130kg深蹲递减+90m投篮 · 超量铜锅羊肉恢复',
  summary: '周六体能与专项双核强悍拉满（合计190分钟，达成周六基准150m的127%）！早餐纯瘦白吉馍+10:25库迪加浓冰美式；11:20进健身房完成靠墙静蹲5×30s+深蹲递增至130kg×4并无缝接110→40kg五阶无间歇递减组（总容量4,620kg）+坐姿内收肌（最高64kg×6×2）+平板支撑1m×5组；13:10转战室内球馆完成90分钟结合运球的行进间投篮练习；15:40铜锅清水涮羊肉自助摄入双倍以上图二足量鲜羊肉+部分碳水，回宿舍补充2粒高品质鱼油+5g肌酸后严格断食消化！',
  achievements: [
    '下肢极限力量与代谢冲击: 11:20-13:00 深蹲130kg×4 + 五阶无间歇递减组(110→40kg) + 内收肌64kg + 平板支撑5分钟 (100m)',
    '室内球馆专项转换: 13:10-14:40 结合运球行进间投篮练习90分钟，极限抗疲劳手感建立 (90m)',
    '运动营养超量恢复: 早纯瘦白吉馍+库迪加浓冰美式；15:40双倍+铜锅鲜羊肉与部分碳水+2粒高纯鱼油+5g肌酸，晚间零进食轻断'
  ]
};

// 4. AthleteDailyRecord for 2026-11-14
if (!data.athleteRecords) data.athleteRecords = {};
data.athleteRecords['2026-11-14'] = {
  id: 'ath-2026-11-14',
  date: '2026-11-14',
  basketball: {
    modules: ['投篮专项', '运球脚步', '球场专项体能'],
    durationMinutes: 90,
    rpe: 9,
    highIntensityJumps: 75,
    decelerations: '深蹲五阶无间歇递减组后仅隔10分钟切入90分钟行进间运球投篮，高频单双脚起跳急停制动，极其考验下肢乳酸堆积下的动力链发力与出手稳定性',
    contactIntensity: 'low',
    notes: '13:10-14:40 室内球馆行进间投篮专项90分钟：把下肢快肌募集后遗效应（PAP）转化为动态运球急停手感与末节抗疲劳投篮定型'
  },
  strength: {
    phase: '最大力量',
    primaryLifts: '靠墙静蹲5×30s + 深蹲金字塔(60×5, 80×5, 100×5, 120×5×2组, 130kg×4×1组顶峰) + 【五阶无间歇递减组：110×4→90×4→80×5→60×5→40×5】(52次/4,620kg) + 坐姿髋内收肌(54kg×8×2, 60kg×6×1, 64kg×6×2 / 1,992kg) + 平板支撑60s×5组',
    plyometricsVolume: '靠墙静蹲5组等长预激活 + 随后90分钟球场高密度行进间起跳落地SSC',
    durationMinutes: 100,
    notes: '11:20进健身房：130kg×4大重量突破机械张力天花板后，零间歇连卸五片深蹲递减（连续23次）引爆极高代谢压力；5组1分钟平板支撑建立超强核心腹压。'
  },
  biomechanics: {
    ankleFootFeel: 'mild_tight',
    patellarTendonPain: 2,
    hipSpineMobility: 'optimal',
    ankleFootNotes: '100m深蹲递减+90m球场行进间急停起跳后足踝微紧，次日需小腿三头肌及足底筋膜滚压松解',
    patellarTendonNotes: '靠墙静蹲5×30s发挥显著等长镇痛保护；130kg+递减组未触发急性髌腱刺痛，晨僵控制良好',
    hipSpineNotes: '坐姿髋内收肌渐进递增至64kg×6×2强化了变向切入时骨盆内侧稳定性，5组平板支撑护腰刚性充足'
  },
  nutrition: {
    periWorkoutSupplements: '早：纯瘦白吉馍 + 10:25 库迪[冰]铂金精品美式(加浓450ml, 0糖0奶, ~220-260mg咖啡因)；15:40 清水铜锅涮羊肉自助双倍+肉量与部分碳水；回宿舍：2粒高品质鱼油 + 5g肌酸，此后晚间严格不再进食',
    proteinGPerKg: 3.4,
    carbEnergyFeel: 'optimal',
    urineColorLevel: 2,
    waterIntakeMl: 3400,
    supplementsDetail: '库迪加浓冰美式(训前55m黄金咖啡因峰值) + 2粒高品质鱼油(EPA/DHA抗炎) + 5g一水肌酸',
    mealsDetail: '早：纯瘦白吉馍(~28g蛋白,~52g碳水,~395kcal) + 库迪加浓冰美式；15:40 清水老北京铜锅羊肉自助：双倍以上图二鲜羊肉片/卷/肉丸(~1.6-1.9kg生肉，约290-320g优质蛋白+铁锌+内源肌酸，清水锅底无牛油负担) + 部分碳水(~70-100g)；回宿舍2粒高纯鱼油+5g肌酸后晚间不再进食。全天累计：~318-348g蛋白(~3.4g/kg)，~3,150-3,550kcal，完美承接190分钟高强度深蹲递减+篮球巨额耗竭！'
  },
  recovery: {
    bedTime: '23:30',
    wakeTime: '07:30',
    sleepDurationHours: 8,
    deepSleepPerception: 'good',
    restingHeartRate: 59,
    morningReadinessScore: 8,
    cnsExcitement: 'normal',
    sleepNotes: '15:40进食后晚间断食给了肠胃充分排空高蛋白肉食的时间，避免睡前饱胀干扰深睡眠'
  },
  diagnosis: {
    generatedAt: '2026-11-15T15:28:00.000+08:00',
    overallScore: 95,
    statusTag: '130kg下肢超级递减 · 巨量鲜肉超量恢复',
    cnsAcwrEvaluation: '周六完成了极具冲击力的【重训+专项双核】：130kg×4机械张力+110→40kg五阶无间歇递减组（4,620kg总吨位）叠加90分钟行进间运球投篮。库迪加浓冰美式（10:25饮用，11:20开练）精准命中咖啡因血药浓度峰值，显著提升CNS驱动与抗疲劳表现。',
    kineticChainTransfer: '坐姿内收肌递增至64kg强化了急停变向内侧股收肌剪力防护；5组60s平板支撑巩固躯干刚性；下肢重负荷后立即进行90m行进间投篮，强化了乳酸阈值下的空间感知与节奏稳定性。',
    prehabProtocol: '五阶深蹲递减组会产生较高EIMD延迟性酸痛，今日（周日）必须严格执行下肢主动恢复/减载（可做上肢轻循环或泡沫轴放松髋屈肌、内收肌与股四头肌），避免连续两日下肢高冲击跳跃。',
    biochemNutritionPrescription: '15:40 清水铜锅涮羊肉方案极为高明：① 清水锅底大幅规避火锅牛油隐形脂肪；② 双倍+鲜羊肉提供~300g超高生物价蛋白、天然肌酸、左旋肉碱及高吸收血红素铁与锌（强力支撑内源睾酮恢复）；③ 回宿舍补充2粒高纯鱼油精准对冲红肉Omega-6比例并平抑肌肉微损伤炎症，5g肌酸借部分碳水胰岛素通道充实CP池；④ 晚间不再进食给予高蛋白长达15小时的消化窗口，避免多余脂肪囤积！',
    nextDayPrescription: '次日（周日11-15）：下肢进入48小时超量恢复窗口，白天重点推进学术/理论复习（如《习概》章节推进）并大量饮水（3500ml+）协助尿素氮与肌代谢产物排泄；若觉下肢紧绷，可安排20分钟轻度单车松解+髋踝灵活性拉伸。'
  },
  createdAt: '2026-11-15T15:28:00.000+08:00',
  updatedAt: '2026-11-15T15:28:00.000+08:00'
};

data.exportTime = new Date().toISOString();

fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(publicStorageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated storage.json and public/storage.json for Saturday 2026-11-14!');
