import { useCallback, useEffect, useRef, useState } from 'react'
import { playBreathingDone, playBreathingPhaseChange } from './breathingAudio'
import type { BreathingPhase } from '../types/breathing'

export type BreathingStatus = 'idle' | 'running' | 'paused' | 'done'

// Drives every technique's visual: wall-clock timestamps (not decrementing
// counters, same reasoning as the workout timer) so brief JS delays never
// cause drift, plus requestAnimationFrame for a smooth continuous progress
// value each frame — the circle/rectangle motion needs to be fluid, not
// stepped like the workout timer's per-second display.
export function useBreathingSession(phases: BreathingPhase[], durationMinutes: number) {
  const [status, setStatus] = useState<BreathingStatus>('idle')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(phases[0]?.seconds ?? 0)
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0)
  // increments every phase transition — used by the rectangle visual to
  // know which of the 4 edges it's currently tracing
  const [edgeCount, setEdgeCount] = useState(0)

  const phaseIndexRef = useRef(0)
  const phaseStartRef = useRef(0)
  const totalEndRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const remainingPhaseMsAtPauseRef = useRef(0)
  const remainingTotalMsAtPauseRef = useRef(0)

  useEffect(() => {
    if (status !== 'running') return

    function tick() {
      const now = Date.now()
      const phase = phases[phaseIndexRef.current]
      const phaseDurationMs = phase.seconds * 1000
      const elapsed = now - phaseStartRef.current
      const progress = Math.min(1, elapsed / phaseDurationMs)
      setPhaseProgress(progress)
      setPhaseSecondsLeft(Math.max(0, Math.ceil((phaseDurationMs - elapsed) / 1000)))
      setTotalSecondsLeft(Math.max(0, Math.ceil((totalEndRef.current - now) / 1000)))

      if (progress >= 1) {
        // Only decided at a phase boundary — a phase is never cut off mid-way.
        if (now >= totalEndRef.current) {
          setStatus('done')
          playBreathingDone()
          return
        }
        const nextIndex = (phaseIndexRef.current + 1) % phases.length
        phaseIndexRef.current = nextIndex
        phaseStartRef.current = now
        setPhaseIndex(nextIndex)
        setEdgeCount((c) => c + 1)
        playBreathingPhaseChange(phases[nextIndex].name)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [status, phases])

  const start = useCallback(() => {
    const now = Date.now()
    phaseIndexRef.current = 0
    phaseStartRef.current = now
    totalEndRef.current = now + durationMinutes * 60_000
    setPhaseIndex(0)
    setPhaseProgress(0)
    setEdgeCount(0)
    setStatus('running')
    playBreathingPhaseChange(phases[0].name)
  }, [durationMinutes, phases])

  const pause = useCallback(() => {
    setStatus((prev) => {
      if (prev !== 'running') return prev
      const now = Date.now()
      const phase = phases[phaseIndexRef.current]
      remainingPhaseMsAtPauseRef.current = Math.max(
        0,
        phaseStartRef.current + phase.seconds * 1000 - now,
      )
      remainingTotalMsAtPauseRef.current = Math.max(0, totalEndRef.current - now)
      return 'paused'
    })
  }, [phases])

  const resume = useCallback(() => {
    setStatus((prev) => {
      if (prev !== 'paused') return prev
      const now = Date.now()
      const phase = phases[phaseIndexRef.current]
      phaseStartRef.current = now - (phase.seconds * 1000 - remainingPhaseMsAtPauseRef.current)
      totalEndRef.current = now + remainingTotalMsAtPauseRef.current
      return 'running'
    })
  }, [phases])

  const reset = useCallback(() => {
    setStatus('idle')
    phaseIndexRef.current = 0
    setPhaseIndex(0)
    setPhaseProgress(0)
    setPhaseSecondsLeft(phases[0]?.seconds ?? 0)
    setTotalSecondsLeft(0)
    setEdgeCount(0)
    phaseStartRef.current = 0
    totalEndRef.current = 0
  }, [phases])

  const phaseName = phases[phaseIndex]?.name ?? 'inhale'
  // Resolved 0-1 value for the circle visual: grows during inhale, holds
  // wherever it reached during a hold, shrinks during exhale. A hold's
  // target follows whichever phase preceded it.
  const previousPhaseName = phases[(phaseIndex - 1 + phases.length) % phases.length]?.name
  const circleProgress =
    phaseName === 'inhale'
      ? phaseProgress
      : phaseName === 'exhale'
        ? 1 - phaseProgress
        : previousPhaseName === 'inhale'
          ? 1
          : 0

  return {
    status,
    phaseIndex,
    phaseName,
    phaseProgress,
    circleProgress,
    phaseSecondsLeft,
    totalSecondsLeft,
    edgeCount,
    start,
    pause,
    resume,
    reset,
  }
}
