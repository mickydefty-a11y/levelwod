// A thin, explicit queue over window.speechSynthesis so cues never talk
// over each other. The browser's native queue already serializes multiple
// .speak() calls, but gives no way to clear only the *pending* ones without
// also cutting off whatever's currently being read — clearQueue() below
// does both deliberately, used whenever a session resets/pauses/unmounts
// so a stale cue never fires late after the person has moved on.

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  return window.speechSynthesis.getVoices()
}

// Voice lists often populate asynchronously after page load — call from
// settings UI to be notified when they're ready/change.
export function onVoicesChanged(callback: () => void): () => void {
  if (!isSpeechSupported()) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', callback)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback)
}

let queue: string[] = []
let speaking = false
let currentRate = 1.0
let currentVoiceURI: string | null = null

function processQueue() {
  if (speaking || queue.length === 0 || !isSpeechSupported()) return
  const text = queue.shift()!
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = currentRate
  if (currentVoiceURI) {
    const voice = getAvailableVoices().find((v) => v.voiceURI === currentVoiceURI)
    if (voice) utterance.voice = voice
  }
  speaking = true
  utterance.onend = () => {
    speaking = false
    processQueue()
  }
  utterance.onerror = () => {
    speaking = false
    processQueue()
  }
  window.speechSynthesis.speak(utterance)
}

export function configureSpeech(rate: number, voiceURI: string | null) {
  currentRate = rate
  currentVoiceURI = voiceURI
}

export function speak(text: string) {
  if (!isSpeechSupported()) return
  queue.push(text)
  processQueue()
}

export function clearQueue() {
  queue = []
  speaking = false
  if (isSpeechSupported()) window.speechSynthesis.cancel()
}
