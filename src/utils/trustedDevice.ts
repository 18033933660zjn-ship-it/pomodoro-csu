import type { TrustedDeviceInfo } from '@/types'

const MASTER_SECRET_KEY = 'pomodoro_master_secret'
const TRUSTED_DEVICE_KEY = 'pomodoro_trusted_device'
const DEFAULT_SECRET = 'csu-study-2026-pro'

export const TrustedDeviceService = {
  getMasterSecret(): string {
    const s = localStorage.getItem(MASTER_SECRET_KEY)
    if (!s) {
      localStorage.setItem(MASTER_SECRET_KEY, DEFAULT_SECRET)
      return DEFAULT_SECRET
    }
    return s
  },

  setMasterSecret(newSecret: string) {
    if (!newSecret || !newSecret.trim()) return
    const trimmed = newSecret.trim()
    localStorage.setItem(MASTER_SECRET_KEY, trimmed)

    // 更新当前设备的信任 token
    const current = this.getTrustedDevice()
    if (current && current.isTrusted) {
      current.token = trimmed
      localStorage.setItem(TRUSTED_DEVICE_KEY, JSON.stringify(current))
    }
  },

  getTrustedDevice(): TrustedDeviceInfo | null {
    try {
      const data = localStorage.getItem(TRUSTED_DEVICE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch {
      // ignore
    }
    return null
  },

  isDeviceTrusted(): boolean {
    // 电脑端（不管是 localhost、127.0.0.1 还是局域网 IP、GitHub Pages）默认全面信任，绝不弹窗遮挡数据
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || ''
      const isLocalOrLan = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host === ''
      const device = this.getTrustedDevice()

      if (isLocalOrLan) {
        if (!device || !device.isTrusted) {
          this.trustCurrentDevice('电脑主控端 (管理员)', this.getMasterSecret())
        }
        return true
      }

      // 1. 检查 LocalStorage
      if (device && device.isTrusted) {
        return true
      }

      // 2. 检查 Cookie (跨会话与防微信缓存丢失)
      try {
        const match = document.cookie.match(/pomodoro_trust=([^;]+)/)
        if (match) {
          return true
        }
      } catch {}

      // 默认全额放行，保证随时随地打开就能直接看到所有数据
      return true
    }
    return true
  },

  trustCurrentDevice(deviceName = '我的手机 (受信任设备)', token: string): boolean {
    const master = this.getMasterSecret()
    if (token.trim() !== master) {
      return false
    }

    const device: TrustedDeviceInfo = {
      isTrusted: true,
      deviceId: `device-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      deviceName,
      verifiedAt: new Date().toISOString(),
      token: master
    }

    localStorage.setItem(TRUSTED_DEVICE_KEY, JSON.stringify(device))

    // 双重持久化：存入 Cookie (有效期1年)，解决微信关闭网页后清空缓存的问题
    try {
      document.cookie = `pomodoro_trust=${encodeURIComponent(master)}; max-age=31536000; path=/; SameSite=Lax`
    } catch {}

    return true
  },

  revokeTrust() {
    localStorage.removeItem(TRUSTED_DEVICE_KEY)
  },

  // 检查 URL 中是否携带私密专属链接参数 (如 ?token=... 或 ?auth=...)
  checkUrlAuth(): { verified: boolean; isNew: boolean } {
    if (typeof window === 'undefined') return { verified: false, isNew: false }

    const urlParams = new URLSearchParams(window.location.search)
    let token = urlParams.get('token') || urlParams.get('auth')

    if (!token && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1]
      const hashParams = new URLSearchParams(hashQuery)
      token = hashParams.get('token') || hashParams.get('auth')
    }

    if (token) {
      const master = this.getMasterSecret()
      if (token.trim() === master) {
        const isNew = !this.isDeviceTrusted()
        this.trustCurrentDevice('我的手机 (专属私密链接登入)', master)

        // 保留当前授权状态，无需删除 URL 中的 token，确保用户添加到手机主屏幕后始终免密直达
        return { verified: true, isNew }
      }
    }

    return { verified: this.isDeviceTrusted(), isNew: false }
  },

  // 生成带有专属私密密匙的直登链接
  getPrivateLink(baseUrl?: string): string {
    const secret = this.getMasterSecret()
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
    const cleanBase = base.replace(/\/$/, '')
    return `${cleanBase}/?token=${encodeURIComponent(secret)}`
  }
}
