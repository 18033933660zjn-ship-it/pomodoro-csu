const fs = require('fs');
const path = require('path');

async function mergeAndSync() {
  const token = fs.readFileSync('data/.sync-token', 'utf8').trim();
  const gistId = '6106983a62444de777fccb2a7a958424';
  
  console.log('Fetching remote Gist data...');
  const res = await fetch(`https://api.github.com/gists/${gistId}?_t=${Date.now()}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CSU-Pomodoro-Agent'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Gist: ${res.status} ${await res.text()}`);
  }

  const gistRes = await res.json();
  const gistData = JSON.parse(gistRes.files['storage.json'].content);
  const localData = JSON.parse(fs.readFileSync('data/storage.json', 'utf8'));

  // 1. Merge timeLogs without dropping any log
  const logMap = new Map();

  // Load gist logs
  (gistData.timeLogs || []).forEach(l => {
    logMap.set(l.id, l);
  });

  // Load local logs (overriding with rich local details if present)
  (localData.timeLogs || []).forEach(l => {
    if (!logMap.has(l.id)) {
      logMap.set(l.id, l);
    } else {
      const existing = logMap.get(l.id);
      // Prefer the one with richer notes or title
      if ((l.notes && l.notes.length > (existing.notes || '').length) || l.taskTitle.length > existing.taskTitle.length) {
        logMap.set(l.id, { ...existing, ...l });
      }
    }
  });

  const mergedLogs = Array.from(logMap.values()).sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  console.log(`Merged ${mergedLogs.length} total timeLogs!`);

  // 2. Merge tasks
  const taskMap = new Map();
  (gistData.tasks || []).forEach(t => taskMap.set(t.id, t));
  (localData.tasks || []).forEach(t => {
    const existing = taskMap.get(t.id);
    if (!existing) {
      taskMap.set(t.id, t);
    } else {
      taskMap.set(t.id, { ...existing, ...t, completed: t.completed || existing.completed });
    }
  });
  const mergedTasks = Array.from(taskMap.values());

  // 3. Merge reflections
  const mergedReflections = {
    ...(gistData.reflections || {}),
    ...(localData.reflections || {})
  };

  // 4. Merge athleteRecords
  const mergedAthleteRecords = {
    ...(gistData.athleteRecords || {}),
    ...(localData.athleteRecords || {})
  };

  // 5. Final merged data structure
  const merged = {
    version: '2.0.0',
    exportTime: new Date().toISOString(),
    categories: localData.categories || gistData.categories,
    tasks: mergedTasks,
    timeLogs: mergedLogs,
    reflections: mergedReflections,
    settings: { ...(gistData.settings || {}), ...(localData.settings || {}) },
    checkIns: gistData.checkIns || localData.checkIns || [],
    athleteRecords: mergedAthleteRecords,
    deletedLogIds: Array.from(new Set([...(localData.deletedLogIds || []), ...(gistData.deletedLogIds || [])])),
    deletedCheckInIds: Array.from(new Set([...(localData.deletedCheckInIds || []), ...(gistData.deletedCheckInIds || [])]))
  };

  // Save to data/storage.json
  fs.writeFileSync('data/storage.json', JSON.stringify(merged, null, 2), 'utf8');
  console.log('Saved to data/storage.json!');

  // Ensure public directory exists and copy storage.json there
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  fs.writeFileSync('public/storage.json', JSON.stringify(merged, null, 2), 'utf8');
  console.log('Saved to public/storage.json for static bundle fallback!');

  // Push to Gist
  console.log('Pushing merged dataset to Gist...');
  const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CSU-Pomodoro-Agent',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'CSU Pomodoro Cloud Storage Backup (Comprehensive Merged 55+ Logs)',
      files: {
        'storage.json': { content: JSON.stringify(merged, null, 2) }
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

mergeAndSync().catch(console.error);
