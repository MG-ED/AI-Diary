import type { TFn } from '../i18n'

export const uid = () => crypto.randomUUID()

export const isoDaysAgo = (days: number, hour = 9) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export function timeAgo(iso: string, t: TFn) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return t('time.now')
  if (mins < 60) return t('time.min', { n: mins })
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return t('time.hour', { n: hrs })
  const days = Math.round(hrs / 24)
  return days === 1 ? t('time.yesterday') : t('time.days', { n: days })
}

export const greeting = (t: TFn) => {
  const h = new Date().getHours()
  return t(h < 12 ? 'greeting.morning' : h < 18 ? 'greeting.afternoon' : 'greeting.evening')
}

let ctx: AudioContext | undefined

/**
 * Short, soft two-note chime. `volume` is 0 to 1 (the Settings slider).
 * The slider is mapped on a curve so low and high settings sound clearly different.
 */
export function playTick(volume: number) {
  if (!(volume > 0)) return
  try {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtor) return
    ctx ??= new AudioCtor()
    // Browsers keep audio paused until the user interacts. Resume it when we need to play.
    if (ctx.state === 'suspended') void ctx.resume()

    const peak = Math.min(1, volume) ** 2 * 0.5
    const now = ctx.currentTime
    ;[660, 880].forEach((freq, i) => {
      const osc = ctx!.createOscillator()
      const gain = ctx!.createGain()
      const start = now + i * 0.09
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28)
      osc.connect(gain).connect(ctx!.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  } catch {
    /* audio not available */
  }
}