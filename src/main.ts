import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

// 注册离线 PWA Service Worker，实现手机断网/离校/在健身房 0 秒离线可用
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('🍅 番茄ToDo PRO PWA ServiceWorker 离线服务已就绪:', reg.scope)
    }).catch((err) => {
      console.warn('PWA ServiceWorker 注册提示:', err)
    })
  })
}
