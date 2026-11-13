const fs = require('fs');
const path = require('path');

async function cleanFriday() {
  const storageFile = path.resolve(__dirname, '../data/storage.json');
  const data = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

  const purgedIds = ['log-1794576225298', 'log-1794570807161', 'log-20261113-gym-upperbody'];
  const purgedSet = new Set(purgedIds);

  // 1. Filter timeLogs
  data.timeLogs = data.timeLogs.filter(l => !purgedSet.has(l.id));

  // 2. Filter tasks
  data.tasks = data.tasks.filter(t => t.id !== 'task-fit-20261113-upper');

  // 3. Add to deletedLogIds
  if (!data.deletedLogIds) data.deletedLogIds = [];
  purgedIds.forEach(id => {
    if (!data.deletedLogIds.includes(id)) {
      data.deletedLogIds.push(id);
    }
  });

  // 4. Update Reflection for 2026-11-13 strictly based on what was done
  if (!data.reflections) data.reflections = {};
  data.reflections['2026-11-13'] = {
    date: '2026-11-13',
    score: 5,
    mood: '🎯 专注攻坚 · 习概理论突破',
    summary: '周五晚间 18:00-20:00 纯沉浸专注 2 小时（120分钟）深入研习习概导论与第一章核心理论体系，构建理论四梁八柱框架，并高质量完成选择题与多选题刷题演练与重点考点辨析！任务二（习概日标45m）达成率达 267%（超额多学 75 分钟），今日总计有效专注 120 分钟（2 小时）！',
    achievements: [
      '任务二 (习概理论与刷题): 18:00-20:00 深入研习导论与第一章 + 选择题专项刷题 (120m，日标达成率 267% 超额完成)'
    ]
  };

  data.exportTime = new Date().toISOString();

  // Save to data/storage.json and public/storage.json
  fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(path.resolve(__dirname, '../public/storage.json'), JSON.stringify(data, null, 2), 'utf8');

  console.log('Cleaned local and public storage.json successfully!');
  console.log('Today remaining logs:', data.timeLogs.filter(l => l.startTime && l.startTime.startsWith('2026-11-13')).map(l => ({ id: l.id, title: l.taskTitle, start: l.startTime, dur: l.durationMinutes })));

  // 5. Push to Gist
  const token = fs.readFileSync('data/.sync-token', 'utf8').trim();
  const gistId = '6106983a62444de777fccb2a7a958424';

  console.log('Syncing cleaned dataset to GitHub Gist...');
  const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CSU-Pomodoro-Agent',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'CSU Pomodoro Cloud Storage Backup (Strict Sanitized - Today only 18:00-20:00 Xi Gai)',
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

cleanFriday().catch(console.error);
