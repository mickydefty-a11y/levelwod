import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import VoiceModeToggle from '../components/VoiceModeToggle'
import { paramsToTimerConfig } from '../lib/timerUrl'
import { useSessionResultDraft } from '../lib/useSessionResultDraft'
import { useTimer } from '../lib/useTimer'
import { useTimerVoiceCues } from '../lib/useTimerVoiceCues'
import { useWakeLock } from '../lib/useWakeLock'
import type { TimerConfig, TimerType } from '../types/timer'

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const TYPE_LABELS: Record<TimerType, string> = {
  stopwatch: 'For Time',
  amrap: 'AMRAP',
  emom: 'EMOM',
  intervals: 'Intervals',
  rest: 'Rest',
}

const TYPE_ORDER: TimerType[] = ['intervals', 'amrap', 'emom', 'stopwatch', 'rest']

function Stepper({
  label,
  value,
  onChange,
  step = 5,
  min = 0,
  suffix = '',
}: {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  suffix?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-raised text-lg font-medium"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="w-14 text-center text-base font-semibold tabular-nums">
          {value}
          {suffix}
        </span>
        <button
          onClick={() => onChange(value + step)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-raised text-lg font-medium"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function TimerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initial = useMemo(() => paramsToTimerConfig(searchParams), [searchParams])
  const movementLabel = searchParams.get('label')
  // Present only when launched from the workout session flow (Start Now on
  // a Benchmark WOD or the WOD Generator) — everyday callers like
  // ProgramBlockRow's "Start Timer" never set these, so this whole session
  // affordance stays invisible to them.
  const sessionId = searchParams.get('sessionId')
  const returnTo = searchParams.get('returnTo')
  const isSession = !!(sessionId && returnTo)
  const { saveDraft } = useSessionResultDraft(sessionId ?? '')

  const [type, setType] = useState<TimerType>(initial?.type ?? 'intervals')
  const [workSeconds, setWorkSeconds] = useState(
    initial?.type === 'intervals' ? initial.workSeconds : 40,
  )
  const [restSeconds, setRestSeconds] = useState(
    initial?.type === 'intervals' ? initial.restSeconds : 20,
  )
  const [rounds, setRounds] = useState(
    initial?.type === 'intervals' || initial?.type === 'emom' ? initial.rounds : 6,
  )
  const [intervalSeconds, setIntervalSeconds] = useState(
    initial?.type === 'emom' ? initial.intervalSeconds : 60,
  )
  const [durationMinutes, setDurationMinutes] = useState(
    initial?.type === 'amrap'
      ? initial.durationSeconds / 60
      : initial?.type === 'rest'
        ? initial.durationSeconds / 60
        : 12,
  )
  const [capMinutes, setCapMinutes] = useState(
    initial?.type === 'stopwatch' && initial.capSeconds ? initial.capSeconds / 60 : 0,
  )

  const config: TimerConfig = useMemo(() => {
    switch (type) {
      case 'stopwatch':
        return { type: 'stopwatch', capSeconds: capMinutes > 0 ? capMinutes * 60 : undefined }
      case 'amrap':
        return { type: 'amrap', durationSeconds: Math.max(15, Math.round(durationMinutes * 60)) }
      case 'emom':
        return { type: 'emom', intervalSeconds, rounds }
      case 'intervals':
        return { type: 'intervals', workSeconds, restSeconds, rounds }
      case 'rest':
        return { type: 'rest', durationSeconds: Math.max(5, Math.round(durationMinutes * 60)) }
    }
  }, [type, workSeconds, restSeconds, rounds, intervalSeconds, durationMinutes, capMinutes])

  const timer = useTimer(config)
  useWakeLock(timer.status === 'countdown' || timer.status === 'running')
  useTimerVoiceCues(timer, config, movementLabel)

  const isEditing = timer.status === 'idle'

  function commitAndReturn() {
    if (!isSession) return
    saveDraft({
      elapsedSeconds: config.type === 'stopwatch' ? timer.secondsElapsed : undefined,
      amrapRounds: config.type === 'amrap' ? timer.amrapRounds : undefined,
    })
    navigate(returnTo!)
  }

  function handleMarkComplete() {
    timer.finish()
    commitAndReturn()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Timer</h1>
        <VoiceModeToggle />
      </div>

      {isEditing && (
        <div className="mt-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {TYPE_ORDER.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                  type === t ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                }`}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {type === 'intervals' && (
              <>
                <Stepper label="Work (seconds)" value={workSeconds} onChange={setWorkSeconds} />
                <Stepper label="Rest (seconds)" value={restSeconds} onChange={setRestSeconds} />
                <Stepper label="Rounds" value={rounds} onChange={setRounds} step={1} min={1} />
              </>
            )}
            {type === 'emom' && (
              <>
                <Stepper
                  label="Every (seconds)"
                  value={intervalSeconds}
                  onChange={setIntervalSeconds}
                />
                <Stepper label="Rounds" value={rounds} onChange={setRounds} step={1} min={1} />
              </>
            )}
            {type === 'amrap' && (
              <Stepper
                label="Duration (minutes)"
                value={durationMinutes}
                onChange={setDurationMinutes}
                step={1}
                min={1}
              />
            )}
            {type === 'rest' && (
              <Stepper
                label="Duration (minutes)"
                value={durationMinutes}
                onChange={setDurationMinutes}
                step={1}
                min={1}
              />
            )}
            {type === 'stopwatch' && (
              <Stepper
                label="Cap (minutes, 0 = none)"
                value={capMinutes}
                onChange={setCapMinutes}
                step={1}
                min={0}
              />
            )}
          </div>

          <button
            onClick={timer.start}
            className="mt-4 w-full rounded-lg bg-accent py-3 text-base font-semibold text-bg"
          >
            Start
          </button>
        </div>
      )}

      {!isEditing && (
        <div className="mt-6 flex flex-col items-center">
          {timer.status === 'countdown' && (
            <>
              <p className="text-sm font-medium uppercase tracking-wide text-ink-muted">
                Get ready
              </p>
              <p className="mt-4 text-8xl font-bold tabular-nums">{timer.countdownValue}</p>
            </>
          )}

          {(timer.status === 'running' || timer.status === 'paused') && (
            <>
              <p
                className={`text-sm font-semibold uppercase tracking-wide ${
                  timer.stepKind === 'rest' ? 'text-ink-muted' : 'text-accent'
                }`}
              >
                {timer.stepKind === 'rest'
                  ? 'Rest'
                  : timer.stepKind === 'work'
                    ? 'Work'
                    : TYPE_LABELS[type]}
                {timer.status === 'paused' && ' · Paused'}
              </p>

              <p className="mt-4 text-8xl font-bold tabular-nums">
                {formatTime(config.type === 'stopwatch' ? timer.secondsElapsed : (timer.secondsLeft ?? 0))}
              </p>

              {timer.round !== null && (
                <p className="mt-3 text-sm text-ink-muted">
                  Round {timer.round} of {timer.totalRounds}
                </p>
              )}

              {type === 'amrap' && (
                <button
                  onClick={timer.addRound}
                  className="mt-6 rounded-full bg-bg-surface px-6 py-3 text-sm font-medium"
                >
                  +1 Round <span className="text-accent-light">({timer.amrapRounds})</span>
                </button>
              )}

              <div className="mt-8 flex w-full gap-3">
                {timer.status === 'running' ? (
                  <button
                    onClick={timer.pause}
                    className="flex-1 rounded-lg bg-bg-surface py-3.5 text-base font-semibold"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={timer.resume}
                    className="flex-1 rounded-lg bg-accent py-3.5 text-base font-semibold text-bg"
                  >
                    Resume
                  </button>
                )}
                {isSession ? (
                  <button
                    onClick={handleMarkComplete}
                    className="flex-1 rounded-lg bg-accent py-3.5 text-base font-semibold text-bg"
                  >
                    Mark Complete
                  </button>
                ) : (
                  type === 'stopwatch' && (
                    <button
                      onClick={timer.finish}
                      className="flex-1 rounded-lg bg-accent py-3.5 text-base font-semibold text-bg"
                    >
                      Finish
                    </button>
                  )
                )}
                <button
                  onClick={timer.reset}
                  className="flex-1 rounded-lg bg-white/5 py-3.5 text-base font-medium text-ink-muted"
                >
                  Reset
                </button>
              </div>
            </>
          )}

          {timer.status === 'done' && (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">Done 🎉</p>
              <p className="mt-4 text-5xl font-bold tabular-nums">
                {config.type === 'stopwatch' ? formatTime(timer.secondsElapsed) : 'Time!'}
              </p>
              {type === 'amrap' && (
                <p className="mt-3 text-sm text-ink-muted">Rounds completed: {timer.amrapRounds}</p>
              )}
              <button
                onClick={isSession ? commitAndReturn : timer.reset}
                className="mt-8 w-full rounded-lg bg-accent py-3.5 text-base font-semibold text-bg"
              >
                {isSession ? 'Log Result →' : 'Done'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
