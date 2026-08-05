import { useEffect } from 'react'
import { CheckCircleIcon } from './icons'
import VoiceModeToggle from './VoiceModeToggle'
import { formatSeconds } from '../lib/prFormat'
import { useSessionResultDraft } from '../lib/useSessionResultDraft'
import { useTimer } from '../lib/useTimer'
import { useTimerVoiceCues } from '../lib/useTimerVoiceCues'
import { useWakeLock } from '../lib/useWakeLock'
import type { TimerConfig, TimerType } from '../types/timer'

const TYPE_LABELS: Record<TimerType, string> = {
  stopwatch: 'For Time',
  amrap: 'AMRAP',
  emom: 'EMOM',
  intervals: 'Intervals',
  rest: 'Rest',
}

// Runs a workout session's timer directly on the workout's own page instead
// of navigating to the standalone Timer page — the movement list, warm-up,
// and coach's brief all stay visible/scrollable underneath the whole time,
// and there's nothing to "go back" from since the page never left. Starts
// itself immediately on mount (no separate idle/edit step) since a
// session's config is fixed by the workout, not user-adjustable here.
export default function InlineSessionTimer({
  config,
  sessionId,
  label,
}: {
  config: TimerConfig
  sessionId: string
  label?: string | null
}) {
  const timer = useTimer(config)
  const { saveDraft } = useSessionResultDraft(sessionId)
  useWakeLock(timer.status === 'countdown' || timer.status === 'running')
  useTimerVoiceCues(timer, config, label)

  useEffect(() => {
    timer.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logResult() {
    saveDraft({
      elapsedSeconds: config.type === 'stopwatch' ? timer.secondsElapsed : undefined,
      amrapRounds: config.type === 'amrap' ? timer.amrapRounds : undefined,
    })
  }

  function handleMarkComplete() {
    timer.finish()
    logResult()
  }

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {timer.status === 'countdown' ? 'Get ready' : TYPE_LABELS[config.type]}
        </p>
        <VoiceModeToggle />
      </div>

      {timer.status === 'countdown' && (
        <p className="mt-3 text-center text-7xl font-bold tabular-nums">{timer.countdownValue}</p>
      )}

      {(timer.status === 'running' || timer.status === 'paused') && (
        <>
          <p className="mt-3 text-center text-7xl font-bold tabular-nums">
            {formatSeconds(config.type === 'stopwatch' ? timer.secondsElapsed : (timer.secondsLeft ?? 0))}
          </p>
          {timer.round !== null && (
            <p className="mt-2 text-center text-sm text-ink-muted">
              Round {timer.round} of {timer.totalRounds}
            </p>
          )}
          {config.type === 'amrap' && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={timer.addRound}
                className="rounded-full bg-bg-raised px-5 py-2 text-sm font-medium"
              >
                +1 Round <span className="text-accent-light">({timer.amrapRounds})</span>
              </button>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            {timer.status === 'running' ? (
              <button
                onClick={timer.pause}
                className="flex-1 rounded-lg bg-bg-raised py-2.5 text-sm font-semibold"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={timer.resume}
                className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-bg"
              >
                Resume
              </button>
            )}
            <button
              onClick={handleMarkComplete}
              className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-bg"
            >
              Mark Complete
            </button>
          </div>
          <button
            onClick={timer.reset}
            className="mt-2 w-full rounded-lg bg-white/5 py-2 text-xs text-ink-muted"
          >
            Reset
          </button>
        </>
      )}

      {timer.status === 'done' && (
        <>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-accent">
            <CheckCircleIcon className="h-4 w-4" strokeWidth={2} /> Done
          </p>
          <p className="mt-2 text-center text-4xl font-bold tabular-nums">
            {config.type === 'stopwatch' ? formatSeconds(timer.secondsElapsed) : 'Time!'}
          </p>
          {config.type === 'amrap' && (
            <p className="mt-2 text-center text-sm text-ink-muted">
              Rounds completed: {timer.amrapRounds}
            </p>
          )}
          <button
            onClick={logResult}
            className="mt-4 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-bg"
          >
            Log Result →
          </button>
        </>
      )}
    </div>
  )
}
