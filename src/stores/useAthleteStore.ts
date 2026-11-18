import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import type {
  AthleteDailyRecord,
  SportsScienceDiagnosis,
  BasketballWorkload,
  StrengthConditioningWorkload,
  BiomechanicsJointCheck,
  NutritionHydrationLog,
  RecoverySleepLog
} from '@/types'
import { StorageService } from '@/utils/storage'
import { useTimeLogStore } from './useTimeLogStore'
import { useReflectionStore } from './useReflectionStore'

export const useAthleteStore = defineStore('athlete', () => {
  const records = ref<Record<string, AthleteDailyRecord>>(StorageService.getAthleteRecords())
  const selectedDate = ref<string>(dayjs().format('YYYY-MM-DD'))

  function createEmptyRecord(date: string): AthleteDailyRecord {
    return {
      id: `ath-${date}`,
      date,
      basketball: {
        modules: ['投篮专项', '运球脚步'],
        durationMinutes: 0,
        rpe: 6,
        highIntensityJumps: 0,
        decelerations: '轻度急停变向，侧重投篮手感与脚步平稳',
        contactIntensity: 'low',
        notes: ''
      },
      strength: {
        phase: '最大力量',
        primaryLifts: '',
        plyometricsVolume: '无专项跳跃 / 靠墙静蹲与基础激活',
        durationMinutes: 0,
        notes: ''
      },
      biomechanics: {
        ankleFootFeel: 'optimal',
        patellarTendonPain: 0,
        hipSpineMobility: 'optimal',
        ankleFootNotes: '踝关节活动度良好，无足底筋膜紧绷',
        patellarTendonNotes: '无晨僵，无髌下极局部压痛',
        hipSpineNotes: '骨盆中立，无后侧链代偿'
      },
      nutrition: {
        periWorkoutSupplements: '美式咖啡因 / 练后优质碳水+高蛋白',
        proteinGPerKg: 1.8,
        carbEnergyFeel: 'optimal',
        urineColorLevel: 2,
        waterIntakeMl: 2500,
        supplementsDetail: '97%高纯鱼油2粒 + 5g一水肌酸',
        mealsDetail: ''
      },
      recovery: {
        bedTime: '23:30',
        wakeTime: '07:30',
        sleepDurationHours: 8.0,
        deepSleepPerception: 'good',
        restingHeartRate: 58,
        morningReadinessScore: 8,
        cnsExcitement: 'normal',
        sleepNotes: '晨起神经兴奋性适中，无深度疲惫'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // 初始化预置数据（如果为空，自动注入过去真实的 11-03、11-07、11-08 及今天的真实记录）
  function seedInitialRecordsIfEmpty() {
    let changed = false

    // 11-03 记录
    if (!records.value['2026-11-03']) {
      records.value['2026-11-03'] = {
        id: 'ath-2026-11-03',
        date: '2026-11-03',
        basketball: {
          modules: ['球场专项体能'],
          durationMinutes: 0,
          rpe: 5,
          highIntensityJumps: 0,
          decelerations: '以健身房大重量为主，未安排全场对抗',
          contactIntensity: 'low',
          notes: '专项储备日，能量向力量攻坚倾斜'
        },
        strength: {
          phase: '最大力量',
          primaryLifts: '深蹲顶峰140kg突破 + 罗马尼亚硬拉(RDL) 60-80kg 5组 + 坐姿髋内收47-64kg 6组 + 核心五重奏',
          plyometricsVolume: '悬垂举腿10次×5组 + 山羊挺身侧压10kg',
          durationMinutes: 120,
          notes: '深蹲冲刺140kg成功，后侧链机械张力充沛'
        },
        biomechanics: {
          ankleFootFeel: 'optimal',
          patellarTendonPain: 1,
          hipSpineMobility: 'optimal',
          ankleFootNotes: '足底稳定',
          patellarTendonNotes: '140kg深蹲后髌腱轻微应力感，无急性痛感',
          hipSpineNotes: 'RDL动作髋铰链主导，腰椎稳定无代偿'
        },
        nutrition: {
          periWorkoutSupplements: '练前中枢兴奋补给 + 练后高蛋白碳水',
          proteinGPerKg: 1.8,
          carbEnergyFeel: 'optimal',
          urineColorLevel: 2,
          waterIntakeMl: 2800,
          supplementsDetail: '肌酸5g + 复合维生素',
          mealsDetail: '足量碳水回补肌糖原'
        },
        recovery: {
          bedTime: '23:20',
          wakeTime: '07:15',
          sleepDurationHours: 7.9,
          deepSleepPerception: 'good',
          restingHeartRate: 59,
          morningReadinessScore: 8,
          cnsExcitement: 'normal',
          sleepNotes: '中枢恢复良好'
        },
        createdAt: '2026-11-03T12:30:00.000Z',
        updatedAt: '2026-11-03T12:30:00.000Z'
      }
      changed = true
    }

    // 11-07 记录
    if (!records.value['2026-11-07']) {
      records.value['2026-11-07'] = {
        id: 'ath-2026-11-07',
        date: '2026-11-07',
        basketball: {
          modules: ['投篮专项'],
          durationMinutes: 0,
          rpe: 6,
          highIntensityJumps: 0,
          decelerations: '下肢绝对力量峰值日，避免高频连续冲击',
          contactIntensity: 'low',
          notes: '保留中枢神经以供深蹲极量'
        },
        strength: {
          phase: '最大力量',
          primaryLifts: '5组西班牙蹲热身 + 深蹲突破150kg顶峰 + 保加利亚分腿蹲30kg×5×5 + 坐姿髋内收64kg + 核心四重奏',
          plyometricsVolume: '西班牙蹲等长肌腱预载荷',
          durationMinutes: 140,
          notes: '150kg深蹲单次成功，保加利亚蹲强化单侧支撑与稳定'
        },
        biomechanics: {
          ankleFootFeel: 'optimal',
          patellarTendonPain: 2,
          hipSpineMobility: 'optimal',
          ankleFootNotes: '西班牙蹲充分润滑髌下脂肪垫与滑膜',
          patellarTendonNotes: '西班牙蹲等长收缩有效抑制了髌腱痛感，150kg负荷下无刺痛',
          hipSpineNotes: '单腿深蹲骨盆水平，核心四重奏锁死躯干'
        },
        nutrition: {
          periWorkoutSupplements: '高纯鱼油 + 5g肌酸 + 充分电解质',
          proteinGPerKg: 2.0,
          carbEnergyFeel: 'optimal',
          urineColorLevel: 2,
          waterIntakeMl: 3000,
          supplementsDetail: '97%高纯鱼油2粒 + 5g一水肌酸',
          mealsDetail: '极高蛋白摄入与高糖原回补'
        },
        recovery: {
          bedTime: '23:30',
          wakeTime: '07:30',
          sleepDurationHours: 8.0,
          deepSleepPerception: 'deep',
          restingHeartRate: 57,
          morningReadinessScore: 9,
          cnsExcitement: 'relaxed',
          sleepNotes: '极深睡眠，生长激素脉冲修复'
        },
        createdAt: '2026-11-07T13:00:00.000Z',
        updatedAt: '2026-11-07T13:00:00.000Z'
      }
      changed = true
    }

    // 11-08 记录 (上肢大容量推拉)
    if (!records.value['2026-11-08']) {
      records.value['2026-11-08'] = {
        id: 'ath-2026-11-08',
        date: '2026-11-08',
        basketball: {
          modules: ['投篮专项'],
          durationMinutes: 0,
          rpe: 5,
          highIntensityJumps: 0,
          decelerations: '上肢与核心抗阻',
          contactIntensity: 'low',
          notes: '上肢推拉平衡与躯干抗旋'
        },
        strength: {
          phase: '最大力量',
          primaryLifts: '平板卧推冲刺90kg顶峰 + 高位下拉60kg + 杠铃站姿实力推40kg + 核心四重奏',
          plyometricsVolume: '无下肢冲击，下肢积极恢复',
          durationMinutes: 150,
          notes: '90kg卧推单次成功，站姿实力推提升胸椎与肩袖稳定性'
        },
        biomechanics: {
          ankleFootFeel: 'optimal',
          patellarTendonPain: 1,
          hipSpineMobility: 'optimal',
          ankleFootNotes: '下肢充分休整',
          patellarTendonNotes: '较昨日150kg深蹲后明显回落至1分，胶原修护良好',
          hipSpineNotes: '胸椎旋转与伸展度充足，利于投篮出手动力链'
        },
        nutrition: {
          periWorkoutSupplements: '高蛋白正餐 + 充分水合',
          proteinGPerKg: 1.9,
          carbEnergyFeel: 'optimal',
          urineColorLevel: 2,
          waterIntakeMl: 2600,
          supplementsDetail: '鱼油2粒 + 肌酸5g',
          mealsDetail: '规律优质膳食'
        },
        recovery: {
          bedTime: '23:40',
          wakeTime: '07:20',
          sleepDurationHours: 7.6,
          deepSleepPerception: 'good',
          restingHeartRate: 59,
          morningReadinessScore: 8,
          cnsExcitement: 'normal',
          sleepNotes: '上肢轻度酸胀，中枢无疲劳积累'
        },
        createdAt: '2026-11-08T13:00:00.000Z',
        updatedAt: '2026-11-08T13:00:00.000Z'
      }
      changed = true
    }

    // 11-11 记录 (今天)
    if (!records.value['2026-11-11']) {
      records.value['2026-11-11'] = {
        id: 'ath-2026-11-11',
        date: '2026-11-11',
        basketball: {
          modules: ['运球脚步', '投篮专项', '半场技战术', '球场专项体能'],
          durationMinutes: 50,
          rpe: 8,
          highIntensityJumps: 45,
          decelerations: '急停跳投高频制动，运球变向突破跨步急停，大重量深蹲后强行抗疲劳手感建立',
          contactIntensity: 'medium',
          notes: '力量训练后无缝进驻球场50分钟，下肢深蹲大力量向球场爆发力高效迁移转化，第四节抗疲劳手感极佳'
        },
        strength: {
          phase: '最大力量',
          primaryLifts: '靠墙静蹲5组×30s + 深蹲金字塔(60/80/100kg各5, 4组120kg×4大机械张力攻坚, 2组100kg退减) + 保加利亚分腿蹲左右各5组(负重30kg哑铃) + 核心四重奏',
          plyometricsVolume: '靠墙静蹲VMO等长激活 + 球场变向快速SSC',
          durationMinutes: 150,
          notes: '150分钟高密度抗阻，保加利亚蹲单腿制动与侧向稳定深层轰炸，瑞幸美式全程中枢神经支持'
        },
        biomechanics: {
          ankleFootFeel: 'mild_tight',
          patellarTendonPain: 2,
          hipSpineMobility: 'optimal',
          ankleFootNotes: '高强度急停变向后足底筋膜与足跟稍紧，需赛后筋膜球踩踏',
          patellarTendonNotes: '靠墙静蹲等长收缩有效减痛，120kg深蹲后跳投膝关节无急性压痛，晨僵指数2分',
          hipSpineNotes: '保加利亚分腿蹲充分拉伸并强化了屈髋肌群与臀大肌，骨盆稳定无侧倾'
        },
        nutrition: {
          periWorkoutSupplements: '瑞幸标准美式1杯（中枢神经兴奋与抗疲劳） + 练后白切鸡烧腊高蛋白高碳水 + 饭后2粒97%高纯鱼油 + 5g一水肌酸 + 15:00坚果25g',
          proteinGPerKg: 1.55,
          carbEnergyFeel: 'optimal',
          urineColorLevel: 2,
          waterIntakeMl: 3200,
          supplementsDetail: '97%高纯鱼油2粒 + 5g一水肌酸 + 瑞幸黑咖啡',
          mealsDetail: '白切鸡烧腊+大份生菜+足量米饭糖原重载，15:00加餐25g抗氧化坚果稳态供能'
        },
        recovery: {
          bedTime: '23:30',
          wakeTime: '07:30',
          sleepDurationHours: 8.0,
          deepSleepPerception: 'deep',
          restingHeartRate: 58,
          morningReadinessScore: 9,
          cnsExcitement: 'normal',
          sleepNotes: '晨起专注力极高，白天完成雅思英语vlog、党课笔记、习概导论与第一章刷题超额达标'
        },
        createdAt: '2026-11-11T13:40:00.000Z',
        updatedAt: '2026-11-11T13:40:00.000Z'
      }
      changed = true
    }

    if (changed) {
      // 自动给各记录生成诊断
      Object.keys(records.value).forEach(d => {
        if (!records.value[d].diagnosis) {
          records.value[d].diagnosis = runScientificDiagnosis(records.value[d])
        }
      })
      StorageService.saveAthleteRecords(records.value)
    }
  }

  seedInitialRecordsIfEmpty()

  const currentRecord = computed<AthleteDailyRecord>(() => {
    if (!records.value[selectedDate.value]) {
      return createEmptyRecord(selectedDate.value)
    }
    return records.value[selectedDate.value]
  })

  function saveRecord(record: AthleteDailyRecord) {
    record.updatedAt = new Date().toISOString()
    // 自动触发科学诊断
    record.diagnosis = runScientificDiagnosis(record)
    records.value[record.date] = JSON.parse(JSON.stringify(record))
    StorageService.saveAthleteRecords(records.value)
  }

  // 科学算法引擎：生成符合提示词标准架构的五大模块诊断报告 (190cm / 95kg 2号位减脂增肌适配版)
  function runScientificDiagnosis(record: AthleteDailyRecord): SportsScienceDiagnosis {
    const liftsText = `${record.strength.primaryLifts} ${record.strength.notes || ''}`
    const bballText = `${record.basketball.modules.join(' ')} ${record.basketball.notes || ''} ${record.basketball.decelerations}`
    const isLowerDay = /深蹲|保加利亚|硬拉|RDL|下肢/i.test(liftsText)
    const isUpperDay = /卧推|引体|实力推|划船|飞鸟|侧平举|上肢/i.test(liftsText)
    const isHeavyDay = record.strength.durationMinutes >= 90 || /120kg|140kg|150kg|90kg/i.test(liftsText)
    const hasBasketball = record.basketball.durationMinutes > 0 && !/羽毛球|恢复/i.test(bballText)
    const isActiveRecovery = /羽毛球|恢复|减载/i.test(bballText) || (record.strength.durationMinutes === 0 && record.basketball.durationMinutes <= 60)
    const tendonScore = record.biomechanics.patellarTendonPain
    const proteinGPerKg = record.nutrition.proteinGPerKg

    let score = 88
    let status = '高转化窗口'

    if (isHeavyDay && hasBasketball) {
      score = 96
      status = '功能性超负荷·高迁移窗口'
    } else if (tendonScore >= 4) {
      score = 75
      status = '需主动防伤·肌腱减载'
    } else if (record.recovery.cnsExcitement === 'wired_tired' || record.recovery.cnsExcitement === 'heavy_fatigue') {
      score = 80
      status = '中枢神经疲劳·需深度恢复'
    } else if (isUpperDay && record.strength.durationMinutes >= 120) {
      score = 92
      status = '上肢推拉容量超负荷·95kg重装巩固'
    } else if (isActiveRecovery) {
      score = 89
      status = '主动恢复与代谢冲刷窗口'
    }

    const cnsAcwr = `• 负荷总量分析（190cm/95kg 2号位基准）：力量抗阻 ${record.strength.durationMinutes} 分钟，专项活动 ${record.basketball.durationMinutes} 分钟，主观疲劳 RPE: ${record.basketball.rpe}/10。
• 神经系统状态：${
      isHeavyDay && hasBasketball
        ? '今日力量与球场专项背靠背推进，中枢神经系统（CNS）与高阈值运动单位（HTMU）高度募集，ACWR 处于 1.15-1.25 的最佳功能性超负荷甜蜜区间。'
        : isUpperDay && record.strength.durationMinutes > 110
        ? '今日上肢大容量推拉（含金字塔卧推与95kg自重引体）耗时超110分钟，局部外周疲劳与训练后期皮质醇升高明显；建议后续将大力量单次时长压缩至 75-95 分钟内以提升神经效率。'
        : isActiveRecovery
        ? '今日属于低冲击主动恢复日，有效避免了下肢膝踝关节的连续高强度地面反作用力（GRF 600-750kg），中枢神经副交感恢复良好。'
        : '今日负荷平稳受控，ACWR 指数安全。'
    }`

    const kineticChain = `• 动力链传导：${
      isLowerDay
        ? '下肢大重量与单侧保加利亚蹲夯实了闭链支撑刚度，直接增益95kg体重下急停制动（Deceleration）与单双脚起跳动力链。'
        : isUpperDay
        ? '卧推水平推+实力推垂直推与自重引体/哑铃划船的推拉组合，构建了优异的肩胛稳定性（Scapular Stability）与胸椎抗弯刚性，直接支撑2号位高对抗上篮终结与急停跳投时出手肩袖的稳定下沉。'
        : '轻度横向移动与跨步保持了踝髋关节本体感觉与筋膜滑动度，为下一轮大负荷蓄能。'
    }
• 核心与抗旋转化：${/山羊|俄罗斯转体/i.test(liftsText) ? '4组核心侧压+反向挺身+俄罗斯转体强化了多平面抗侧屈与旋转爆发力，保障变向突破与空中折叠时的躯干刚性。' : '核心基础稳定，注意保持投篮与落地时的骨盆中立位。'}`

    const prehab = `• 关节与肌腱状态监控：当前髌腱自评压痛为 ${tendonScore}/10 分。${
      tendonScore <= 2 ? '下肢肌腱胶原适应性良好，未见明显退行性风险。' : '髌腱存在反应性微损伤信号，需立即执行等长镇痛与减载。'
    }
• 主动防护方案（Prehab Protocol）：
  1. ${isUpperDay ? '【肩袖外旋与胸大肌松解】：上肢高容量卧推后，用弹力带做 3组×15次 外旋激活（冈下肌/小圆肌）+ 胸小肌墙角拉伸，防止圆肩内扣影响三分投篮出手轨迹。' : '【髌腱等长镇痛加载】：靠墙静蹲或西班牙蹲，屈膝 60°，5组 × 30-45秒（机制：皮层脊髓抑制镇痛并提升肌腱刚度）。'}
  2. 【95kg 下肢底盘维护】：每日睡前坚持 3 分钟足底筋膜球踩踏 + 比目鱼肌拉伸，缓冲重型后卫急停剪切力。`

    const nutritionPrescription = `• 能量与蛋白质（减脂增肌重塑基准 1.8-2.2g/kg）：当前预估蛋白 ${proteinGPerKg} g/kg。${
      proteinGPerKg < 1.6 ? '⚠️ 当前蛋白略低于95kg减脂期防分解安全线，建议晚间补充20-30g纯乳清/酪蛋白或0脂高蛋白牛奶以锁死肌肉。' : '✅ 蛋白质充足跨越亮氨酸阈值，强力支撑肌纤维超量恢复并抵御热量缺口期的肌肉流失。'
    }
• 补剂与抗炎处方：${record.nutrition.supplementsDetail || '高纯鱼油 + 5g一水肌酸'}。Omega-3 下调训后 IL-6 炎症因子；5g 一水肌酸持续维持磷酸原储备（95kg 肌肉含水量与爆发力支撑）。
• 水合与睡眠神经调控：保持尿液颜色 1-2 级，睡前 60 分钟避蓝光与保持 18-20℃ 室温，最大化慢波深睡眠（SWS）脉冲分泌生长激素。`

    const nextDay = `1. 【训练统筹建议】：${
      isUpperDay ? '上肢大肌群已充分轰炸，次日可将重心转回下肢爆发力/球场专项投篮手感（注意投篮初期受肩三角肌酸痛影响可能短暂发紧，充分绕环热身即可）。' : isLowerDay ? '次日下肢坚决卸载，禁止连续大重量深蹲或高频全场对抗，可切换上肢推拉或纯技术手感打磨。' : '身体已完成超量恢复蓄能，次日可正常切入高强度力量或球场实战对抗。'
    }
2. 【饮食碳水循环提示】：有大力量/全场球场日执行中高碳水靶向围训练期；纯自习休息日果断切换“极低碳水+高蛋白+绿叶菜”模式收割纯脂。
3. 【运动心理学激励】：“190cm/95kg 的重装身躯加上精细到克与毫秒的科学自律，你在赛场上就是不可阻挡的错位毁灭者。”`

    return {
      generatedAt: new Date().toISOString(),
      overallScore: score,
      statusTag: status,
      cnsAcwrEvaluation: cnsAcwr,
      kineticChainTransfer: kineticChain,
      prehabProtocol: prehab,
      biochemNutritionPrescription: nutritionPrescription,
      nextDayPrescription: nextDay
    }
  }

  // 智能从当天番茄ToDo现有记录中提取并预填
  function syncFromDailyLogs(date: string) {
    const timeLogStore = useTimeLogStore()
    const reflectionStore = useReflectionStore()

    const targetRecord = records.value[date] ? JSON.parse(JSON.stringify(records.value[date])) : createEmptyRecord(date)

    // 查找当天的锻炼与练球流水
    const dayLogs = timeLogStore.timeLogs.filter(l => l.startTime.startsWith(date))
    let gymDuration = 0
    let bballDuration = 0
    let gymNotes = ''
    let bballNotes = ''

    dayLogs.forEach(l => {
      const text = `${l.taskTitle} ${l.notes || ''}`
      if (/深蹲|健身|下肢|力量|卧推|抗阻/i.test(text)) {
        gymDuration += l.durationMinutes
        if (l.notes) gymNotes += (gymNotes ? '\n' : '') + l.notes
      }
      if (/篮球|投篮|运球|球场/i.test(text)) {
        bballDuration += l.durationMinutes
        if (l.notes) bballNotes += (bballNotes ? '\n' : '') + l.notes
      }
    })

    if (gymDuration > 0) {
      targetRecord.strength.durationMinutes = gymDuration
      if (gymNotes) {
        targetRecord.strength.primaryLifts = gymNotes.slice(0, 300)
        targetRecord.strength.notes = gymNotes
      }
    }

    if (bballDuration > 0) {
      targetRecord.basketball.durationMinutes = bballDuration
      if (bballNotes) {
        targetRecord.basketball.notes = bballNotes
      }
    }

    // 提取反思日记里的营养信息
    const refl = reflectionStore.getReflection(date)
    if (refl) {
      if (refl.summary) {
        targetRecord.nutrition.mealsDetail = refl.summary
      }
      if (refl.achievements && refl.achievements.length > 0) {
        const nutAch = refl.achievements.find(a => /营养|补剂|鱼油|肌酸|美式|白切鸡/i.test(a))
        if (nutAch) {
          targetRecord.nutrition.supplementsDetail = nutAch
        }
      }
    }

    saveRecord(targetRecord)
    return targetRecord
  }

  // 生成符合提示词标准汇报格式的纯文本（一键复制发给AI）
  function generatePromptText(date?: string): string {
    const d = date || selectedDate.value
    const r = records.value[d] || createEmptyRecord(d)

    return `【日期】：${r.date}
【晨起静息心率/晨起状态自评（1-10分）】：${r.recovery.restingHeartRate ? r.recovery.restingHeartRate + ' bpm / ' : ''}${r.recovery.morningReadinessScore}分（${r.recovery.sleepNotes || '状态充沛'}）

1. 篮球专项训练 (On-Court Workload)：
   - 训练模块：${r.basketball.modules.join(' / ') || '基础投篮'}
   - 训练时长与主观疲劳度（RPE 1-10）：${r.basketball.durationMinutes} 分钟，RPE ${r.basketball.rpe}分
   - 高负荷动作预估（起跳次数、急停变向、对抗强度）：高强度起跳约 ${r.basketball.highIntensityJumps} 次，急停变向：${r.basketball.decelerations}，对抗等级：${r.basketball.contactIntensity === 'match' ? '实战对抗' : r.basketball.contactIntensity === 'high' ? '高对抗' : r.basketball.contactIntensity === 'medium' ? '中等对抗' : '低强度技术'}
   - 球场体感与细节备注：${r.basketball.notes || '手感稳定，动力链传导良好'}

2. 力量与体能训练 (S&C Session)：
   - 训练阶段/目标：${r.strength.phase}
   - 主要复合动作、负荷（重量/组数/RIR保留次数）：${r.strength.primaryLifts || '无大负荷力量'}
   - 弹跳/跳跃训练（Plyometrics）容量与接触地面类型：${r.strength.plyometricsVolume}
   - 力量训练总时长：${r.strength.durationMinutes} 分钟
   - 动作生物力学细节：${r.strength.notes || '动作规范，无代偿'}

3. 骨骼肌与关节生物力学状态 (Biomechanics & Joint Check)：
   - 踝/足底筋膜体感：${r.biomechanics.ankleFootFeel === 'optimal' ? '正常无异常' : r.biomechanics.ankleFootFeel === 'mild_tight' ? '轻微紧绷' : '明显酸痛'}（${r.biomechanics.ankleFootNotes || '足部健康'}）
   - 髌腱/股四头肌肌腱是否有压痛或晨起僵硬（0-10）：${r.biomechanics.patellarTendonPain}分（${r.biomechanics.patellarTendonNotes || '无晨僵刺痛'}）
   - 腰椎/骨盆/髋关节灵活性或紧张感：${r.biomechanics.hipSpineNotes || '骨盆中立，胸椎灵活'}

4. 围训练期营养与水合 (Nutrition & Hydration)：
   - 训练前后补给（碳水/蛋白质/电解质/肌酸）：${r.nutrition.periWorkoutSupplements}
   - 全天优质蛋白总量（预估g/kg体重）及总碳水供能感受：约 ${r.nutrition.proteinGPerKg} g/kg，碳水感受：${r.nutrition.carbEnergyFeel === 'optimal' ? '供能充沛稳定' : r.nutrition.carbEnergyFeel === 'low' ? '碳水偏空乏' : '适中'}
   - 全天水合状态（尿液颜色等级 1-5 / 饮水量ml）：尿液等级 ${r.nutrition.urineColorLevel} 级 / 全天饮水 ${r.nutrition.waterIntakeMl} ml
   - 补剂与正餐明细：${r.nutrition.supplementsDetail || ''} ${r.nutrition.mealsDetail || ''}

5. 睡眠架构与神经恢复 (Recovery & Sleep)：
   - 入睡时间 / 晨起时间 / 深度睡眠感知：${r.recovery.bedTime} 就寝 - ${r.recovery.wakeTime} 醒来（共 ${r.recovery.sleepDurationHours} 小时），深睡感知：${r.recovery.deepSleepPerception === 'deep' ? '极佳深睡' : r.recovery.deepSleepPerception === 'good' ? '良好' : '较浅'}
   - 神经兴奋度（是否存在身心疲惫但入睡困难的情况）：${r.recovery.cnsExcitement === 'normal' ? '神经状态平稳平衡' : r.recovery.cnsExcitement === 'relaxed' ? '身心放松' : r.recovery.cnsExcitement === 'wired_tired' ? '身体疲劳但中枢神经兴奋度偏高' : '重度神经疲劳'}`
  }

  function reload() {
    records.value = StorageService.getAthleteRecords()
    seedInitialRecordsIfEmpty()
  }

  return {
    records,
    selectedDate,
    currentRecord,
    createEmptyRecord,
    saveRecord,
    syncFromDailyLogs,
    generatePromptText,
    runScientificDiagnosis,
    reload
  }
})
