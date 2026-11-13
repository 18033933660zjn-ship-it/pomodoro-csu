const fs = require('fs');
const path = require('path');

async function restoreFriday() {
  const storageFile = path.resolve(__dirname, '../data/storage.json');
  const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

  const fitLog = {
    id: 'log-20261113-gym-upperbody',
    taskId: 'task-fit-20261113-upper',
    taskTitle: '健身房上肢大重量推拉与核心强化 (150分钟)',
    categoryId: 'cat-fitness-workout',
    categoryName: '周末专项: 健身房高强度锻炼',
    categoryColor: '#10b981',
    categoryIcon: 'Dumbbell',
    startTime: '2026-11-13T10:10:00.000+08:00',
    endTime: '2026-11-13T12:40:00.000+08:00',
    durationMinutes: 150,
    mode: 'pomodoro',
    isExtra: false,
    notes: '10:10-12:40 上肢力量与核心4组攻坚（150m）：平板卧推前段80kg×4×2+90kg×1突破后，尾段执行【零间歇六阶超级递减组：70×5→60×7→50×7→40×7→30×8→20×10】+ 引体向上5×3 + 杠铃实力推(最高40kg×6×2) + 哑铃站姿飞鸟(左右各5组10kg×8) + 单臂哑铃划船(3×17.5kg×10 + 1×22.5kg×8) + 核心三件套各4组。练后补充白切鸡烧腊+满碗米饭+生菜+无糖可乐+2粒鱼油+5g肌酸。'
  };

  const fitTask = {
    id: 'task-fit-20261113-upper',
    categoryId: 'cat-fitness-workout',
    title: '上肢大重量推拉与核心4组（卧推90kg/80kg×4 + 引体5×3 + 实力推 + 飞鸟 + 哑铃划船）',
    completed: true,
    targetMinutes: 150,
    actualMinutes: 150,
    estimatedPomodoros: 6,
    completedPomodoros: 6,
    notes: '10:10-12:40 实打实执行150分钟上肢力量，卧推80kg次数突破，核心升级至4组',
    createdAt: '2026-11-13T10:10:00.000+08:00',
    completedAt: '2026-11-13T12:40:00.000+08:00'
  };

  // 1. Remove fitLog from deletedLogIds
  data.deletedLogIds = (data.deletedLogIds || []).filter(id => id !== 'log-20261113-gym-upperbody');
  // Make sure 90m stray Xi Gai is in deletedLogIds
  if (!data.deletedLogIds.includes('log-1794570807161')) {
    data.deletedLogIds.push('log-1794570807161');
  }

  // 2. Add fitLog if not present
  if (!data.timeLogs.some(l => l.id === fitLog.id)) {
    data.timeLogs.push(fitLog);
  }

  // 3. Make sure only the 18:00-20:00 Xi Gai study remains for today's theory
  data.timeLogs = data.timeLogs.filter(l => l.id !== 'log-1794570807161' && l.id !== 'log-1794576225298');

  // 4. Add fitTask if not present
  if (!data.tasks.some(t => t.id === fitTask.id)) {
    data.tasks.push(fitTask);
  }

  // Sort timeLogs by startTime descending
  data.timeLogs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  // 5. Update reflection for 2026-11-13
  if (!data.reflections) data.reflections = {};
  data.reflections['2026-11-13'] = {
    date: '2026-11-13',
    score: 5,
    mood: '🔥 上肢力量巅峰 · 理论考点狂飙',
    summary: '周五全天训练与理论扎实推进！上午 10:10-12:40 进驻健身房完成 150 分钟上肢大重量推拉与核心专项攻坚（平板卧推冲刺90kg突破 + 零间歇六阶超级递减组70→20kg + 引体向上 + 实力推 + 划船 + 核心三件套），练后足量补充高蛋白营养与补剂；晚间 18:00-20:00 纯沉浸专注 2 小时（120分钟）深入研习习概导论与第一章核心理论体系，并高质量完成选择题刷题实操，任务二日标达成率高达 267%！全天累计有效专注与训练时长共计 270 分钟（4.5 小时）！',
    achievements: [
      '健身房上肢大重量抗阻: 10:10-12:40 卧推90kg突破+六阶超级递减组+引体向上+实力推+划船+核心 (150m，达成度 100%)',
      '任务二 (习概理论与刷题): 18:00-20:00 深入研习导论与第一章 + 选择题专项刷题 (120m，日标达成率 267% 超额突破)',
      '高阶运动营养与恢复: 练后补充白切鸡烧腊+满碗米饭+生菜+无糖可乐+2粒鱼油+5g肌酸'
    ]
  };

  data.exportTime = new Date().toISOString();

  // Save to local and public
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(path.resolve(__dirname, '../public/storage.json'), JSON.stringify(data, null, 2), 'utf8');

  console.log('Successfully restored Friday morning workout and kept only 18:00-20:00 Xi Gai study!');
  const todayLogs = data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-13'));
  console.log('Today final verified logs:', todayLogs.map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));

  // 6. Push to Gist
  const token = fs.readFileSync('data/.sync-token', 'utf8').trim();
  const gistId = '6106983a62444de777fccb2a7a958424';

  console.log('Syncing restored dataset to GitHub Gist...');
  const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CSU-Pomodoro-Agent',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'CSU Pomodoro Cloud Storage Backup (Accurate: Friday Morning Gym 150m + Evening Xi Gai 120m)',
      files: {
        'storage.json': { content: JSON.stringify(data, null, 2) }
      }
    })
  });

  if (patchRes.ok) {
    const updated = await patchRes.json();
    console.log('Gist updated successfully! Updated at:', updated.updated_at);
  } else {
    console.error('Failed to update Gist:', patchRes.status, await patchRes.text());
  }
}

restoreFriday().catch(console.error);
