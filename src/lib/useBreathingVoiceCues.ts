import { useEffect, useRef } from 'react'
import { clearQueue, configureSpeech, speak } from './speechQueue'
import { useVoiceSettings } from './useVoiceSettings'
import type { useBreathingSession } from './useBreathingSession'

type BreathingState = ReturnType<typeof useBreathingSession>

const PHASE_SPEECH: Record<string, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
}

// Pure observer over useBreathingSession's own return value — never touches
// that hook, so a bug here structurally cannot affect the breathing session
// itself. Spoken cues accompany (not replace) the existing gentle chime.
export function useBreathingVoiceCues(session: BreathingState) {
  const { settings } = useVoiceSettings()
  const prevStatusRef = useRef(session.status)
  const prevPhaseIndexRef = useRef(session.phaseIndex)

  useEffect(() => {
    configureSpeech(settings.speechRate, settings.preferredVoice)
  }, [settings.speechRate, settings.preferredVoice])

  useEffect(() => {
    if (!settings.voiceModeEnabled) return
    const prevStatus = prevStatusRef.current

    if (
      session.status === 'running' &&
      (prevStatus !== 'running' || prevPhaseIndexRef.current !== session.phaseIndex)
    ) {
      speak(PHASE_SPEECH[session.phaseName] ?? session.phaseName)
    }

    if (session.status === 'idle' && prevStatus !== 'idle') {
      clearQueue()
    }

    prevStatusRef.current = session.status
    prevPhaseIndexRef.current = session.phaseIndex
  }, [settings.voiceModeEnabled, session.status, session.phaseIndex, session.phaseName])

  // Never leave a stale cue queued if the page unmounts mid-session.
  useEffect(() => {
    return () => clearQueue()
  }, [])
}
