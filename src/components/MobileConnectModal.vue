<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    @click.self="$emit('close')"
  >
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Smartphone class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              手机端受信任设备专属登入
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                免密私密绑定
              </span>
            </h2>
            <p class="text-xs text-slate-400">专为你手机生成的唯一授权链接，扫码即信任</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Mode Tabs -->
      <div class="flex border-b border-slate-800 bg-slate-950/20 px-6 pt-3 gap-2 overflow-x-auto">
        <button
          @click="activeTab = 'cloud'"
          class="pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0"
          :class="[
            activeTab === 'cloud'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          ]"
        >
          <Sparkles class="w-4 h-4 text-emerald-400" />
          永久云端互通直连 (推荐)
        </button>
        <button
          @click="activeTab = 'tunnel'"
          class="pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0"
          :class="[
            activeTab === 'tunnel'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          ]"
        >
          <Globe class="w-4 h-4" />
          备用公网隧道
        </button>
        <button
          @click="activeTab = 'wifi'"
          class="pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0"
          :class="[
            activeTab === 'wifi'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          ]"
        >
          <Wifi class="w-4 h-4" />
          同WiFi直连
        </button>
        <button
          @click="activeTab = 'offline'"
          class="pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0"
          :class="[
            activeTab === 'offline'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          ]"
        >
          <AppWindow class="w-4 h-4 text-purple-400" />
          独立离线App
        </button>
        <button
          @click="activeTab = 'secret'"
          class="pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0"
          :class="[
            activeTab === 'secret'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          ]"
        >
          <ShieldCheck class="w-4 h-4" />
          受信任密匙
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-5 overflow-y-auto">
        <!-- Tab 0: 永久云端互通直连 (Cloud - 强烈推荐) -->
        <div v-if="activeTab === 'cloud'" class="space-y-4">
          <div class="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-300 space-y-1.5">
            <div class="font-semibold text-emerald-300 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <Sparkles class="w-4 h-4 text-emerald-400" />
                全天候 24h 永久云端秒级互通通道（强烈推荐）
              </span>
              <span class="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 font-semibold">
                无需电脑开机·实时双向同步
              </span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              部署于全球加速 CDN，直连你的专属云端数据库。手机在任何地点（自习室、健身房、宿舍、移动4G/5G流量下）打开并打卡，电脑端打开后<b>自动秒级同步呈现</b>，绝不需要手动调整！
            </p>
          </div>

          <!-- QR Code Card -->
          <div class="text-center">
            <div class="inline-block p-3 rounded-2xl bg-white shadow-2xl shadow-emerald-950/40 border-4 border-slate-800">
              <img
                v-if="cloudQrDataUrl"
                :src="cloudQrDataUrl"
                alt="手机移动端专属扫码打卡"
                class="w-44 h-44 object-contain"
              />
              <div v-else class="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                正在生成专属二维码...
              </div>
            </div>

            <!-- URL Display and Copy -->
            <div class="mt-3 flex items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                readonly
                :value="cloudPrivateUrl"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono text-center select-all focus:outline-none"
              />
              <button
                @click="copyUrl(cloudPrivateUrl)"
                class="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-white" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copied ? '已复制' : '复制专属链接' }}</span>
              </button>
            </div>
            <p class="text-[11px] text-slate-400 mt-2">
              建议：手机微信扫描此二维码打开，并在 Safari / 浏览器中点击「添加到主屏幕」，即可秒变独立 App！
            </p>
          </div>
        </div>

        <!-- Tab 1: 备用公网临时隧道直连 (Tunnel) -->
        <div v-else-if="activeTab === 'tunnel'" class="space-y-4">
          <div class="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 space-y-1.5">
            <div class="font-semibold text-cyan-300 flex items-center justify-between">
              <span class="flex items-center gap-1.5">
                <Globe class="w-4 h-4 text-cyan-400" />
                电脑直穿公网临时隧道
              </span>
              <span class="text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                需电脑开机
              </span>
            </div>
            <p class="text-slate-400 leading-relaxed">
              基于 Cloudflare 临时穿透电脑本地开发端口。当电脑在宿舍开机时可通过此通道直连电脑本地调试。
            </p>
          </div>

          <!-- QR Code Card -->
          <div class="text-center">
            <div class="inline-block p-3 rounded-2xl bg-white shadow-2xl shadow-cyan-950/40 border-4 border-slate-800">
              <img
                v-if="tunnelQrDataUrl"
                :src="tunnelQrDataUrl"
                alt="手机移动端专属扫码打卡"
                class="w-44 h-44 object-contain"
              />
              <div v-else class="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                正在生成专属二维码...
              </div>
            </div>

            <!-- URL Display and Copy -->
            <div class="mt-3 flex items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                readonly
                :value="tunnelPrivateUrl"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono text-center select-all focus:outline-none"
              />
              <button
                @click="copyUrl(tunnelPrivateUrl)"
                class="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-white" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copied ? '已复制' : '复制专属链接' }}</span>
              </button>
            </div>
          </div>

          <!-- Tunnel Custom URL Input -->
          <div class="pt-2 border-t border-slate-800">
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>如需更换公网通道网址：</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model="tunnelBaseUrl"
                type="text"
                placeholder="https://xxxx.trycloudflare.com"
                class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                @input="updateTunnelQr"
              />
              <button
                @click="resetTunnelToActive"
                class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                重置为当前
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 2: 宿舍 Wi-Fi 直连 (LAN) -->
        <div v-else-if="activeTab === 'wifi'" class="space-y-4">
          <div class="text-center">
            <p class="text-xs text-slate-300 mb-3">
              同一 Wi-Fi 或电脑开热点，扫码直接绑定并开启：
            </p>

            <!-- QR Code Card -->
            <div class="inline-block p-3 rounded-2xl bg-white shadow-xl shadow-cyan-950/30 border-4 border-slate-800">
              <img
                v-if="wifiQrDataUrl"
                :src="wifiQrDataUrl"
                alt="Wi-Fi扫码打卡"
                class="w-44 h-44 object-contain"
              />
              <div v-else class="w-44 h-44 flex items-center justify-center text-slate-400 text-xs">
                正在生成二维码...
              </div>
            </div>

            <!-- URL Display and Copy -->
            <div class="mt-3 flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input
                type="text"
                readonly
                :value="wifiPrivateUrl"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono text-center select-all focus:outline-none"
              />
              <button
                @click="copyUrl(wifiPrivateUrl)"
                class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium shrink-0 flex items-center gap-1 border border-slate-700"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-green-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copied ? '已复制' : '复制' }}</span>
              </button>
            </div>
            <p class="text-[11px] text-slate-500 mt-2">
              * 注：若校园网开启了“AP客户端隔离”导致打不开，请直接使用「永久云端互通直连」！
            </p>
          </div>
        </div>

        <!-- Tab 3: 离开校园网/离线独立App指南 (PWA) -->
        <div v-else-if="activeTab === 'offline'" class="space-y-4">
          <div class="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-800/60 to-cyan-500/10 border border-amber-500/30 text-xs space-y-2">
            <div class="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-amber-400" />
              把番茄ToDo保存为「手机独立离线 App」
            </div>
            <p class="text-slate-300 leading-relaxed">
              现代 PWA 离线技术已全面注入！只要在手机自带浏览器中将本网站<b>添加到手机主屏幕</b>，系统会自动将所有界面、计时逻辑与打卡功能 100% 缓存在手机芯片中：
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-1">
                <span class="text-emerald-400 font-bold block">✨ 随时随地零延迟秒开</span>
                <span class="text-slate-400 text-[11px] block">哪怕离开校园网、地下室健身房没信号、手机拔卡飞行模式，点开桌面图标依然 0 秒启动！</span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-1">
                <span class="text-cyan-400 font-bold block">🛡️ 电脑关机也能正常记录</span>
                <span class="text-slate-400 text-[11px] block">打卡、番茄专注、健身记录实时保存在手机本地；一旦回到有网环境，自动双向回传同步！</span>
              </div>
            </div>
          </div>

          <!-- Step by Step Guides -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>📱 苹果 iPhone (iOS Safari) 操作步骤：</span>
            </h4>
            <div class="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5 text-xs text-slate-300">
              <p>1. 在手机 Safari 浏览器中打开专属私密链接；</p>
              <p>2. 点击屏幕底部正中间的 <b>「分享」图标</b>（方框带向上箭头）；</p>
              <p>3. 向上滑动菜单，点击 <b>「添加到主屏幕」</b>；</p>
              <p>4. 桌面将生成独立的 🍅 <b>番茄ToDo</b> 图标，之后直接从手机桌面点开即可！</p>
            </div>

            <h4 class="text-xs font-bold text-slate-300 flex items-center gap-1.5 pt-2">
              <span>🤖 安卓 Android (微信 / Chrome / 自带浏览器) 操作步骤：</span>
            </h4>
            <div class="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5 text-xs text-slate-300">
              <p>1. 微信点开链接后，点击右上角「···」选择 <b>在系统默认浏览器中打开</b>；</p>
              <p>2. 在浏览器菜单中点击 <b>「添加到主屏幕」</b> 或 <b>「安装应用」</b>；</p>
              <p>3. 桌面生成独立 App 快捷方式，全屏沉浸，告别网络限制！</p>
            </div>
          </div>
        </div>

        <!-- Tab 4: 受信任设备密匙管理 (Secret Key Management) -->
        <div v-else-if="activeTab === 'secret'" class="space-y-4">
          <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h3 class="text-xs font-bold text-slate-200 flex items-center gap-2">
              <KeyRound class="w-4 h-4 text-amber-400" />
              当前主控端专属私密密匙
            </h3>
            <p class="text-xs text-slate-400">
              只有持有该密匙的设备或通过私密链接打开的手机，才允许查看并提交自习室打卡记录。
            </p>

            <div class="flex gap-2">
              <input
                v-model="editSecret"
                type="text"
                class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono focus:border-tomato-500 focus:outline-none"
              />
              <button
                @click="saveCustomSecret"
                class="px-4 py-2 rounded-lg bg-tomato-500 hover:bg-tomato-600 text-white text-xs font-semibold shrink-0"
              >
                保存新密匙
              </button>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck class="w-4 h-4 text-emerald-400" />
              受信任设备状态：
            </div>
            <div class="text-xs text-slate-400 space-y-1 pl-1">
              <p>💻 <b>电脑主控端</b>：已认证（本机拥有最高管理权限）</p>
              <p>📱 <b>手机移动端</b>：{{ currentDeviceStatus }}</p>
            </div>
          </div>
        </div>

        <!-- Real-time Sync Status Widget -->
        <div class="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <span class="text-cyan-200 font-semibold">数据双向云同步服务：实时在线</span>
              <p class="text-[11px] text-slate-400">手机端打卡后，电脑端统计报表无缝秒级同步</p>
            </div>
          </div>
          <button
            @click="triggerManualSync"
            class="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-all flex items-center gap-1"
          >
            <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': isSyncing }" />
            <span>{{ isSyncing ? '同步中' : '立即核验' }}</span>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-between items-center">
        <span class="text-[11px] text-slate-500">
          受信任设备凭据已加密保存在本地
        </span>
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          完成并关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import {
  Smartphone,
  X,
  Wifi,
  Globe,
  Check,
  Copy,
  RefreshCw,
  AppWindow,
  ShieldCheck,
  KeyRound,
  Sparkles
} from 'lucide-vue-next'
import { StorageService } from '@/utils/storage'
import { TrustedDeviceService } from '@/utils/trustedDevice'

const props = defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'cloud' | 'tunnel' | 'wifi' | 'offline' | 'secret'>('cloud')
const masterSecret = ref(TrustedDeviceService.getMasterSecret())
const editSecret = ref(masterSecret.value)

// 永久云端互通直连 (24小时不间断·GitHub Pages + 专属云端数据库)
const cloudBaseUrl = 'https://18033933660zjn-ship-it.github.io/pomodoro-csu'
const cloudPrivateUrl = computed(() => {
  const syncTok = StorageService.getGithubToken()
  return `${cloudBaseUrl}/?token=${encodeURIComponent(masterSecret.value)}&syncToken=${encodeURIComponent(syncTok)}`
})
const cloudQrDataUrl = ref('')

// 备用公网隧道直连
const activeTunnelDomain = 'https://memorial-convicted-corporations-install.trycloudflare.com'
const tunnelBaseUrl = ref(activeTunnelDomain)
const tunnelQrDataUrl = ref('')

// 本地局域网链接
const wifiIp = ref('192.168.110.47')
const wifiPort = ref(5173)
const wifiQrDataUrl = ref('')

const copied = ref(false)
const isSyncing = ref(false)

// 专属私密免密链接
const tunnelPrivateUrl = computed(() => {
  const base = tunnelBaseUrl.value.replace(/\/$/, '')
  const syncTok = StorageService.getGithubToken()
  return `${base}/?token=${encodeURIComponent(masterSecret.value)}&syncToken=${encodeURIComponent(syncTok)}`
})

const wifiPrivateUrl = computed(() => {
  return `http://${wifiIp.value}:${wifiPort.value}/?token=${encodeURIComponent(masterSecret.value)}`
})

const currentDeviceStatus = computed(() => {
  const dev = TrustedDeviceService.getTrustedDevice()
  if (dev && dev.isTrusted) {
    return `已绑定 (${dev.deviceName})`
  }
  return '未在当前页面绑定，扫码后将自动信任'
})

async function fetchLocalIp() {
  try {
    const res = await fetch('/api/ip')
    if (res.ok) {
      const data = await res.json()
      if (data.ip && data.ip !== 'localhost') {
        wifiIp.value = data.ip
        wifiPort.value = data.port || 5173
      }
    }
  } catch {
    // fallback
  }

  generateAllQr()
}

async function generateAllQr() {
  // 1. 生成永久云端专属私密二维码
  try {
    cloudQrDataUrl.value = await QRCode.toDataURL(cloudPrivateUrl.value, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('Cloud QR failed:', err)
  }

  // 2. 生成公网隧道直连二维码 (内嵌免密 token)
  try {
    tunnelQrDataUrl.value = await QRCode.toDataURL(tunnelPrivateUrl.value, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('Tunnel QR failed:', err)
  }

  // 3. 生成局域网 Wi-Fi 直连二维码
  try {
    wifiQrDataUrl.value = await QRCode.toDataURL(wifiPrivateUrl.value, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('WiFi QR failed:', err)
  }
}

function updateTunnelQr() {
  generateAllQr()
}

function resetTunnelToActive() {
  tunnelBaseUrl.value = activeTunnelDomain
  generateAllQr()
}

function saveCustomSecret() {
  if (!editSecret.value.trim()) return
  TrustedDeviceService.setMasterSecret(editSecret.value.trim())
  masterSecret.value = TrustedDeviceService.getMasterSecret()
  generateAllQr()
  alert('🎉 专属私密密匙更新成功！专属私密链接与二维码已实时更新！')
}

async function copyUrl(text: string) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.warn('Copy failed:', err)
  }
}

async function triggerManualSync() {
  isSyncing.value = true
  try {
    await StorageService.pushToServer()
    await StorageService.syncWithServer(true)
  } catch (e) {
    console.error('Manual sync failed:', e)
  } finally {
    setTimeout(() => {
      isSyncing.value = false
    }, 600)
  }
}

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      masterSecret.value = TrustedDeviceService.getMasterSecret()
      editSecret.value = masterSecret.value
      fetchLocalIp()
    }
  }
)

onMounted(() => {
  fetchLocalIp()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>
