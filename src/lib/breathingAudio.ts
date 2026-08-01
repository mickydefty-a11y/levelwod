// Soft, slow-attack tones for the breathing session — deliberately distinct
// in character from the workout timer's sharp beeps (timerAudio.ts):
// lower pitches, a gentle fade in/out instead of a hard decay, quieter.
// Kept as its own module/AudioContext so the two features stay fully
// independent of each other.
let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioCtx) return null
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function chime(frequency: number, durationMs: number, volume = 0.16) {
  const audioCtx = getContext()
  if (!audioCtx) return
  const oscillator = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  oscillator.connect(gain)
  gain.connect(audioCtx.destination)

  const now = audioCtx.currentTime
  const durationSec = durationMs / 1000
  const attack = Math.min(0.5, durationSec * 0.35)
  const release = durationSec - attack

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + attack)
  gain.gain.linearRampToValueAtTime(0, now + attack + release)

  oscillator.start(now)
  oscillator.stop(now + durationSec)
}

export function primeBreathingAudio() {
  getContext()
}

// A soft, gently-rising or -falling tone as each new phase begins.
export function playBreathingPhaseChange(phaseName: 'inhale' | 'hold' | 'exhale') {
  const frequency = phaseName === 'inhale' ? 330 : phaseName === 'exhale' ? 262 : 294
  chime(frequency, 900)
}

// Two soft descending notes — a quiet close, not a triumphant "done" beep.
export function playBreathingDone() {
  chime(392, 1100)
  setTimeout(() => chime(262, 1400), 500)
}
