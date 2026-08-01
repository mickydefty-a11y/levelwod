import { useEffect, useRef } from 'react'
import { clearQueue, configureSpeech, speak } from './speechQueue'
import { useVoiceSettings } from './useVoiceSettings'
import type { useTimer } from './useTimer'
import type { TimerConfig } from '../types/timer'

type TimerState = ReturnType<typeof useTimer>

function stepSignature(t: TimerState): string {
  return `${t.stepKind}:${t.round ?? ''}`
}

// Pure observer over useTimer's own return value — never touches useTimer
// itself, so a bug here structurally cannot affect the underlying timer.
export function useTimerVoiceCues(
  timer: TimerState,
  config: TimerConfig,
  movementLabel?: string | null,
) {
  const { settings } = useVoiceSettings()
  const prevStatusRef = useRef(timer.status)
  const spokenCountdownRef = useRef<number | null>(null)
  const stepSigRef = useRef<string | null>(null)
  const countedSecondsRef = useRef<Set<number>>(new Set())
  const halfwaySpokenRef = useRef(false)
  const oneMinSpokenRef = useRef(false)
  const doneSpokenRef = useRef(false)

  useEffect(() => {
    configureSpeech(settings.speechRate, settings.preferredVoice)
  }, [settings.speechRate, settings.preferredVoice])

  // Pre-start countdown, the round/rest transitions that follow it, and the
  // one-time movement-name + done cues.
  useEffect(() => {
    if (!settings.voiceModeEnabled) return
    const prevStatus = prevStatusRef.current

    if (timer.status === 'countdown' && spokenCountdownRef.current !== timer.countdownValue) {
      spokenCountdownRef.current = timer.countdownValue
      if (timer.countdownValue > 0) speak(String(timer.countdownValue))
    }

    if (prevStatus === 'countdown' && timer.status === 'running') {
      if (settings.announceMovementNames && movementLabel) speak(movementLabel)
      if (timer.round != null && timer.totalRounds != null) {
        speak(`Round ${timer.round} of ${timer.totalRounds}`)
      } else {
        speak('Go')
      }
      stepSigRef.current = stepSignature(timer)
      countedSecondsRef.current = new Set()
      halfwaySpokenRef.current = false
      oneMinSpokenRef.current = false
    } else if (timer.status === 'running' && prevStatus === 'running') {
      const sig = stepSignature(timer)
      if (stepSigRef.current !== null && stepSigRef.current !== sig) {
        if (timer.stepKind === 'rest') {
          speak('Rest')
        } else if (timer.round != null && timer.totalRounds != null) {
          speak(`Round ${timer.round} of ${timer.totalRounds}`)
        }
        countedSecondsRef.current = new Set()
        halfwaySpokenRef.current = false
      }
      stepSigRef.current = sig
    }

    if (timer.status === 'done' && !doneSpokenRef.current) {
      doneSpokenRef.current = true
      speak('Time. Workout complete.')
    }

    if (timer.status === 'idle' && prevStatus !== 'idle') {
      clearQueue()
      spokenCountdownRef.current = null
      stepSigRef.current = null
      countedSecondsRef.current = new Set()
      halfwaySpokenRef.current = false
      oneMinSpokenRef.current = false
      doneSpokenRef.current = false
    }

    prevStatusRef.current = timer.status
  }, [
    settings.voiceModeEnabled,
    settings.announceMovementNames,
    movementLabel,
    timer.status,
    timer.stepKind,
    timer.round,
    timer.totalRounds,
    timer.countdownValue,
  ])

  // Halfway / one-minute-left / final countdown — driven by the live
  // remaining-time values, checked every tick but guarded so each cue only
  // ever fires once per occurrence.
  useEffect(() => {
    if (!settings.voiceModeEnabled || timer.status !== 'running') return

    let remaining: number | null = null
    let totalForHalfway: number | null = null

    if (config.type === 'amrap') {
      remaining = timer.secondsLeft
      totalForHalfway = config.durationSeconds
    } else if (config.type === 'stopwatch' && config.capSeconds) {
      remaining = config.capSeconds - timer.secondsElapsed
      totalForHalfway = config.capSeconds
    }

    if (remaining != null && totalForHalfway != null) {
      if (!halfwaySpokenRef.current && totalForHalfway > 20 && remaining <= totalForHalfway / 2) {
        halfwaySpokenRef.current = true
        speak('Halfway')
      }
      if (!oneMinSpokenRef.current && totalForHalfway > 60 && remaining <= 60) {
        oneMinSpokenRef.current = true
        speak('One minute left')
      }
    }

    // Work-kind steps and AMRAP get the full ten-count; everything else
    // (rest, EMOM intervals, a plain rest-type timer) gets a lighter
    // three-count, matching the pre-start "three, two, one" cadence.
    const isWorkOrAmrap = timer.stepKind === 'work' || config.type === 'amrap'
    const countdownSource = config.type === 'stopwatch' ? remaining : timer.secondsLeft
    const ceiling = isWorkOrAmrap ? 10 : 3

    if (countdownSource != null && countdownSource > 0 && countdownSource <= ceiling) {
      const n = Math.ceil(countdownSource)
      if (!countedSecondsRef.current.has(n)) {
        countedSecondsRef.current.add(n)
        speak(String(n))
      }
    }
  }, [settings.voiceModeEnabled, timer.status, timer.secondsLeft, timer.secondsElapsed, timer.stepKind, config])

  // Never leave a stale cue queued if the page unmounts mid-session.
  useEffect(() => {
    return () => clearQueue()
  }, [])
}
