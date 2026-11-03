// Web Audio API 轻量级音效合成器（零外部网络依赖，离线可用）

class SoundEffectManager {
  private ctx: AudioContext | null = null
  private ambientSource: AudioNode | null = null
  private ambientGain: GainNode | null = null
  private isAmbientPlaying = false

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // 专注结束清脆钟声 (Zen Gong / Bell)
  playCompletionBell(volume = 0.8) {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      // 优美清脆的和弦主频 587.33Hz (D5) 叠加
      osc.frequency.setValueAtTime(587.33, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1)
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 1.2)

      gain.gain.setValueAtTime(volume * 0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 2.6)

      // 泛音
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(1174.66, now)
      gain2.gain.setValueAtTime(volume * 0.15, now)
      gain2.gain.exponentialRampToValueAtTime(0.0005, now + 1.8)

      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now)
      osc2.stop(now + 1.9)
    } catch (e) {
      console.warn('Audio play error:', e)
    }
  }

  // 按键 / 开始提示短促音
  playClick(volume = 0.5) {
    try {
      const ctx = this.getContext()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05)

      gain.gain.setValueAtTime(volume * 0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.07)
    } catch {
      // ignore
    }
  }

  // 白噪音 / 雨声环境音（合成器模拟）
  startAmbient(type: 'whitenoise' | 'rain' | 'waves', volume = 0.3) {
    this.stopAmbient()
    try {
      const ctx = this.getContext()
      const bufferSize = ctx.sampleRate * 2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        if (type === 'rain' || type === 'waves') {
          // 粉红/棕色噪音（更柔和自然）
          lastOut = (lastOut + 0.02 * white) / 1.02
          data[i] = lastOut * 3.5
        } else {
          data[i] = white * 0.5
        }
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      noise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = type === 'rain' ? 800 : type === 'waves' ? 400 : 1200

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noise.start()
      this.ambientSource = noise
      this.ambientGain = gain
      this.isAmbientPlaying = true
    } catch (e) {
      console.warn('Ambient sound error', e)
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop()
        this.ambientSource.disconnect()
      } catch {
        // ignore
      }
      this.ambientSource = null
    }
    this.isAmbientPlaying = false
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(vol * 0.25, this.ctx.currentTime)
    }
  }
}

export const soundManager = new SoundEffectManager()
