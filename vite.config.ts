import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import os from 'os'

function getLocalIp(): string {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // 优先匹配 192.168 或 10. 或 WLAN
        if (name.toLowerCase().includes('wlan') || name.toLowerCase().includes('wi-fi') || iface.address.startsWith('192.168.')) {
          return iface.address
        }
      }
    }
  }
  // fallback
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal && !iface.address.startsWith('169.254.')) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

function syncStoragePlugin() {
  const dataDir = path.resolve(__dirname, './data')
  const storageFile = path.resolve(dataDir, 'storage.json')

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  function registerMiddleware(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const cleanUrl = req.url ? req.url.split('?')[0] : ''

      // CORS & Cache headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')

      if (req.method === 'OPTIONS') {
        res.statusCode = 200
        res.end()
        return
      }

      // API: 获取本机局域网 IP
      if (cleanUrl === '/api/ip' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ip: getLocalIp(), port: 5173 }))
        return
      }

      // API: 获取受信任的云端同步 Token (从本地受保护文件 .sync-token 动态读取)
      if (cleanUrl === '/api/sync-token' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        const tokenFile = path.resolve(dataDir, '.sync-token')
        let token = ''
        if (fs.existsSync(tokenFile)) {
          token = fs.readFileSync(tokenFile, 'utf-8').trim()
        }
        res.end(JSON.stringify({ token }))
        return
      }

      // API: 获取全量共享数据 (手机与电脑多端同步)
      if (cleanUrl === '/api/storage' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        if (fs.existsSync(storageFile)) {
          const content = fs.readFileSync(storageFile, 'utf-8')
          res.end(content)
        } else {
          res.end(JSON.stringify({}))
        }
        return
      }

      // API: 保存全量共享数据（带服务端数据清洗与墓碑保护，防止陈旧客户端误复活已删除记录）
      if (cleanUrl === '/api/storage' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: any) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const incoming = JSON.parse(body)
            let existing: any = {}
            if (fs.existsSync(storageFile)) {
              try { existing = JSON.parse(fs.readFileSync(storageFile, 'utf-8')) } catch {}
            }

            // 合并并强制保留服务端墓碑已删除日志列表
            const deletedSet = new Set<string>([
              ...(existing.deletedLogIds || []),
              ...(incoming.deletedLogIds || []),
              'log-1793884227925',
              'log-20261105-02',
              'log-20261105-01',
              'log-1793928933900',
              'log-1793928966449',
              'log-1793928958725',
              'log-1793948907073',
              'log-1793974672111',
              'log-1793958183181',
              'log-1794018151207',
              'log-1794014603982',
              'log-1794014626633',
              'log-1793879655096',
              'log-1794034215079'
            ])

            if (incoming.timeLogs && Array.isArray(incoming.timeLogs)) {
              incoming.timeLogs = incoming.timeLogs.filter((l: any) => !deletedSet.has(l.id) && !(l.notes && l.notes.includes('系统自动同步计入')))
            }

            // 合并并强制保留打卡墓碑已撤销列表 (deletedCheckInIds)，防止未到达打卡被客户端缓存复活
            const deletedCheckInSet = new Set<string>([
              ...(existing.deletedCheckInIds || []),
              ...(incoming.deletedCheckInIds || []),
              'chk-1794018151206'
            ])

            if (incoming.checkIns && Array.isArray(incoming.checkIns)) {
              incoming.checkIns = incoming.checkIns.filter((c: any) => {
                const key = `${c.date}_${c.checkpointId || c.id}`
                return !deletedCheckInSet.has(c.id) && !deletedCheckInSet.has(key)
              })
            }

            // 严格保护未完成任务状态：用户未明确指示完成前，严禁私自标记完成
            if (incoming.tasks && Array.isArray(incoming.tasks)) {
              incoming.tasks.forEach((t: any) => {
                if (t.id === 'task-ielts-1' || t.id === 'task-ielts-2' || t.id === 'task-pol-1' || t.id === 'task-major-1' || t.id === 'task-research-1') {
                  t.completed = false
                  t.completedAt = undefined
                }
              })
            }

            // 确保服务端权威的科目配额分类不被旧客户端覆盖
            if (existing.categories && Array.isArray(existing.categories) && existing.categories.length > 0) {
              incoming.categories = existing.categories
            }

            incoming.deletedLogIds = Array.from(deletedSet)
            incoming.deletedCheckInIds = Array.from(deletedCheckInSet)

            fs.writeFileSync(storageFile, JSON.stringify(incoming, null, 2), 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, time: new Date().toISOString() }))
          } catch (err: any) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        })
        return
      }

      next()
    })
  }

  return {
    name: 'sync-storage-plugin',
    configureServer(server: any) {
      registerMiddleware(server)
    },
    configurePreviewServer(server: any) {
      registerMiddleware(server)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), syncStoragePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // 允许所有网络接口访问
    cors: true,
    allowedHosts: true // 允许所有穿透域名与外网 Host 访问
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts'],
          vendor: ['vue', 'vue-router', 'pinia', 'dayjs', 'lucide-vue-next']
        }
      }
    }
  }
})
