// Generates short beeps with the Web Audio API instead of shipping audio
// files — keeps the PWA fully self-contained and works offline trivially.
let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  // iOS/Safari suspend the context until a user gesture resumes it — calling
  // this from a click handler (Start button) satisfies that requirement.
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function beep(frequency: number, durationMs: number, volume = 0.35) {
  const audioCtx = getContext()
  if (!audioCtx) return
  const oscillator = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.value = volume
  oscillator.connect(gain)
  gain.connect(audioCtx.destination)
  const now = audioCtx.currentTime
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000)
  oscillator.start(now)
  oscillator.stop(now + durationMs / 1000)
}

export function primeAudio() {
  getContext()
}

// Quiet tick during the 3-2-1 countdown before a timer starts.
export function playTick() {
  beep(880, 90)
}

// Higher, longer tone for "go" / phase changes worth noticing mid-set.
export function playPhaseChange() {
  beep(660, 220)
}

// Distinct triple-beep for "done".
export function playDone() {
  beep(523, 160)
  setTimeout(() => beep(659, 160), 180)
  setTimeout(() => beep(784, 260), 360)
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}
