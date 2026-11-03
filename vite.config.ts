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

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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

      // API: 保存全量共享数据
      if (cleanUrl === '/api/storage' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: any) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            fs.writeFileSync(storageFile, body, 'utf-8')
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
