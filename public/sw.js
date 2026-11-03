// 番茄ToDo PRO - 离线优先 Service Worker
const CACHE_NAME = 'pomodoro-pro-cache-v2'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/tomato-icon.svg'
]

// 安装并预缓存核心应用资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// 激活并清理历史旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 智能拦截网络请求 (离线优先 + 动态资源自动缓存)
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // 1. 如果是 API 数据同步请求 (/api/...)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // 离线时优雅降级：返回空 JSON 或离线标记，前端 LocalStorage 会无缝接管
        return new Response(JSON.stringify({ offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    return
  }

  // 2. 如果是单页应用页面导航 (例如刷新或直接打开任意子路由)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(async () => {
          // 离线时直接返回缓存的 index.html，单页路由无缝启动！
          const cached = await caches.match('/index.html')
          return cached || caches.match('/')
        })
    )
    return
  }

  // 3. 静态静态资源 (JS, CSS, 图标, 字体等): Stale-While-Revalidate 极速响应策略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => cachedResponse)

      return cachedResponse || fetchPromise
    })
  )
})
