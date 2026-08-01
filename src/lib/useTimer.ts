import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TimerConfig } from '../types/timer'
import { buildSteps, type TimerStep } from './timerSteps'
import { playDone, playPhaseChange, playTick, vibrate } from './timerAudio'

export type TimerStatus = 'idle' | 'countdown' | 'running' | 'paused' | 'done'

const PRE_START_SECONDS = 3
const TICK_MS = 200

export function useTimer(config: TimerConfig) {
  const steps = useMemo(() => buildSteps(config), [config])

  const [status, setStatus] = useState<TimerStatus>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [countdownValue, setCountdownValue] = useState(PRE_START_SECONDS)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(steps ? steps[0].seconds : null)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [amrapRounds, setAmrapRounds] = useState(0)

  // Wall-clock timestamps rather than decrementing counters, so brief JS
  // delays never cause drift over a long AMRAP/EMOM.
  const segmentEndRef = useRef(0)
  const remainingAtPauseRef = useRef(0)
  const startTimestampRef = useRef(0)
  const elapsedAtPauseRef = useRef(0)

  // Main run loop — reads/writes via functional updates and refs only, so
  // it never captures a stale stepIndex/secondsElapsed closure.
  useEffect(() => {
    if (status !== 'running') return

    const id = setInterval(() => {
      if (config.type === 'stopwatch') {
        const elapsed = Math.floor((Date.now() - startTimestampRef.current) / 1000)
        setSecondsElapsed(elapsed)
        if (config.capSeconds && elapsed >= config.capSeconds) {
          setStatus('done')
          playDone()
          vibrate([200, 100, 200, 100, 300])
        }
        return
      }

      if (!steps) return
      const remainingMs = segmentEndRef.current - Date.now()
      if (remainingMs <= 0) {
        setStepIndex((prevIndex) => {
          const next = prevIndex + 1
          if (next >= steps.length) {
            setStatus('done')
            playDone()
            vibrate([200, 100, 200, 100, 300])
            return prevIndex
          }
          segmentEndRef.current = Date.now() + steps[next].seconds * 1000
          setSecondsLeft(steps[next].seconds)
          playPhaseChange()
          vibrate(150)
          return next
        })
      } else {
        setSecondsLeft(Math.ceil(remainingMs / 1000))
      }
    }, TICK_MS)

    return () => clearInterval(id)
  }, [status, config, steps])

  // Pre-start 3-2-1 countdown.
  useEffect(() => {
    if (status !== 'countdown') return
    const id = setInterval(() => {
      setCountdownValue((v) => {
        const next = v - 1
        if (next > 0) playTick()
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [status])

  // Countdown finished -> start the real timer.
  useEffect(() => {
    if (status !== 'countdown' || countdownValue > 0) return

    if (config.type === 'stopwatch') {
      startTimestampRef.current = Date.now() - elapsedAtPauseRef.current * 1000
    } else if (steps) {
      segmentEndRef.current = Date.now() + steps[stepIndex].seconds * 1000
    }
    setStatus('running')
    playPhaseChange()
    vibrate(150)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, countdownValue])

  const start = useCallback(() => {
    setCountdownValue(PRE_START_SECONDS)
    playTick()
    setStatus('countdown')
  }, [])

  const pause = useCallback(() => {
    setStatus((prev) => {
      if (prev !== 'running') return prev
      if (config.type === 'stopwatch') {
        elapsedAtPauseRef.current = Math.floor((Date.now() - startTimestampRef.current) / 1000)
      } else {
        remainingAtPauseRef.current = Math.max(0, segmentEndRef.current - Date.now())
      }
      return 'paused'
    })
  }, [config])

  const resume = useCallback(() => {
    setStatus((prev) => {
      if (prev !== 'paused') return prev
      if (config.type === 'stopwatch') {
        startTimestampRef.current = Date.now() - elapsedAtPauseRef.current * 1000
      } else {
        segmentEndRef.current = Date.now() + remainingAtPauseRef.current
      }
      return 'running'
    })
  }, [config])

  const finish = useCallback(() => {
    setStatus('done')
    playDone()
    vibrate([200, 100, 200, 100, 300])
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setStepIndex(0)
    setSecondsLeft(steps ? steps[0].seconds : null)
    setSecondsElapsed(0)
    setCountdownValue(PRE_START_SECONDS)
    setAmrapRounds(0)
    segmentEndRef.current = 0
    remainingAtPauseRef.current = 0
    startTimestampRef.current = 0
    elapsedAtPauseRef.current = 0
  }, [steps])

  const addRound = useCallback(() => setAmrapRounds((r) => r + 1), [])

  const currentStep: TimerStep | null = steps ? steps[stepIndex] : null
  const totalRounds =
    config.type === 'intervals' ? config.rounds : config.type === 'emom' ? config.rounds : null
  const round =
    config.type === 'intervals'
      ? Math.floor(stepIndex / 2) + 1
      : config.type === 'emom'
        ? stepIndex + 1
        : null

  return {
    status,
    stepKind: currentStep?.kind ?? 'active',
    secondsLeft,
    secondsElapsed,
    round,
    totalRounds,
    amrapRounds,
    countdownValue,
    totalSteps: steps?.length ?? null,
    start,
    pause,
    resume,
    reset,
    finish,
    addRound,
  }
}
