const localtunnel = require('localtunnel')

async function startTunnel() {
  try {
    const tunnel = await localtunnel({
      port: 5173,
      subdomain: 'csu-pomodoro-pro'
    })
    console.log('[TUNNEL ACTIVE]', tunnel.url)

    tunnel.on('close', () => {
      console.log('[TUNNEL CLOSED] Reconnecting in 3s...')
      setTimeout(startTunnel, 3000)
    })

    tunnel.on('error', (err) => {
      console.error('[TUNNEL ERROR]', err ? err.message : 'unknown')
      try { tunnel.close() } catch {}
    })
  } catch (err) {
    console.error('[TUNNEL INIT FAILED]', err ? err.message : 'unknown', '- retrying in 3s...')
    setTimeout(startTunnel, 3000)
  }
}

startTunnel()
