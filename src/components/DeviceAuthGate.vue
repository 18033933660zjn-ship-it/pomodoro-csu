<template>
  <div
    v-if="!isTrusted"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
  >
    <div class="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 text-center">
      <!-- Icon & Header -->
      <div class="space-y-3">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tomato-600 via-tomato-500 to-amber-500 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-tomato-500/25">
          🛡️
        </div>
        <h2 class="text-xl font-bold text-white tracking-tight">
          绑定为受信任设备
        </h2>
        <p class="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          中南大学时间统筹与自习防作弊打卡中枢已开启安全防护。请验证专属私密密匙以信任当前手机设备。
        </p>
      </div>

      <!-- Secret Key Form -->
      <form @submit.prevent="handleVerify" class="space-y-4 text-left">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>专属私密密匙 (Secret Token)</span>
            <span class="text-[11px] text-slate-500 font-normal">默认: csu-study-2026-pro</span>
          </label>
          <div class="relative">
            <input
              v-model="inputToken"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入专属私密密匙"
              class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 font-mono focus:border-tomato-500 focus:outline-none"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
          <p v-if="errorMessage" class="text-xs text-red-400 mt-1.5 flex items-center gap-1">
            <span>⚠️</span>
            <span>{{ errorMessage }}</span>
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1.5">
            设备识别备注名称
          </label>
          <input
            v-model="inputDeviceName"
            type="text"
            placeholder="例如：我的 iPhone 15 Pro / 自习打卡专用机"
            class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-tomato-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-tomato-500 to-amber-500 hover:from-tomato-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-tomato-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>立即验证并信任此设备</span>
          <span>➔</span>
        </button>
      </form>

      <!-- Tip info -->
      <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 text-left">
        <div class="font-semibold text-slate-300 flex items-center gap-1.5">
          <span>💡</span>
          <span>便捷免密技巧：</span>
        </div>
        <p>1. 如果你在电脑端打开了系统，在电脑上点击 <b>「手机扫码打卡」</b>；</p>
        <p>2. 直接用手机相机或微信扫码，二维码已内嵌专属私密参数，手机扫码即可<b>自动秒绑，无需手动输密</b>！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrustedDeviceService } from '@/utils/trustedDevice'
import confetti from 'canvas-confetti'

const emit = defineEmits<{
  (e: 'trusted'): void
}>()

const isTrusted = ref(true)
const inputToken = ref('')
const inputDeviceName = ref('我的手机 (移动打卡设备)')
const errorMessage = ref('')
const showPassword = ref(false)

function checkTrust() {
  const result = TrustedDeviceService.checkUrlAuth()
  if (result.verified) {
    isTrusted.value = true
    if (result.isNew) {
      celebrate()
    }
    emit('trusted')
  } else {
    // 默认信任放行，不遮挡主界面
    isTrusted.value = true
  }
}

function handleVerify() {
  if (!inputToken.value.trim()) {
    errorMessage.value = '请输入专属私密密匙'
    return
  }

  const success = TrustedDeviceService.trustCurrentDevice(
    inputDeviceName.value.trim() || '我的手机 (受信任设备)',
    inputToken.value.trim()
  )

  if (success) {
    isTrusted.value = true
    errorMessage.value = ''
    celebrate()
    emit('trusted')
  } else {
    errorMessage.value = '密匙不正确，请在电脑端设置中查看或重置私密密匙！'
  }
}

function celebrate() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
  } catch {
    // ignore
  }
}

onMounted(() => {
  checkTrust()
})
</script>
