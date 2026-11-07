const fs = require('fs');
const path = require('path');

async function syncGist() {
  const content = fs.readFileSync('data/storage.json', 'utf8');
  const gistId = '6106983a62444de777fccb2a7a958424';
  
  let token = process.env.GITHUB_TOKEN;
  if (!token && fs.existsSync('data/.sync-token')) {
    token = fs.readFileSync('data/.sync-token', 'utf8').trim();
  }

  if (!token) {
    console.error('No GitHub token provided in env or data/.sync-token');
    process.exit(1);
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CSU-Pomodoro-Agent',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'CSU Pomodoro Cloud Storage Backup (Strict Sanitized)',
          files: {
            'storage.json': { content }
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Gist updated successfully! Updated at:', data.updated_at);
        return;
      } else {
        const errText = await res.text();
        console.error(`Gist update status ${res.status}:`, errText);
        retries--;
        if (retries > 0) {
          console.log('Retrying in 2 seconds...');
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      retries--;
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  process.exit(1);
}

syncGist();
