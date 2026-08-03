import { useState } from 'react'
import RpeGrid from './RpeGrid'
import { encodeRoundsAndReps, formatSeconds, parseSeconds } from '../lib/prFormat'
import { useSessionResultDraft } from '../lib/useSessionResultDraft'
import type { MetricType } from '../types/pr'
import type { ScoreType } from '../types/scoreType'

export interface SessionResult {
  metricType: MetricType
  value: number
  unit: string
}

// The shared back half of the workout session flow — pre-filled, editable
// result entry (skipped entirely for scoreType 'none', e.g. EMOM) followed
// by the existing RpeGrid, exactly mirroring ActiveDayCard's "rate, then
// commit" sequencing. The caller owns what actually saving means (PR entry
// + workout log shape differ between a Benchmark WOD and a WOD Generator
// session), so this only calls back once with the final result + rpe.
export default function WorkoutSessionComplete({
  sessionId,
  scoreType,
  onCommit,
}: {
  sessionId: string
  scoreType: ScoreType
  onCommit: (result: SessionResult | null, rpe?: number) => void
}) {
  const { draft, clearDraft } = useSessionResultDraft(sessionId)
  const [step, setStep] = useState<'result' | 'rpe'>(scoreType === 'none' ? 'rpe' : 'result')
  const [timeInput, setTimeInput] = useState(
    draft?.elapsedSeconds != null ? formatSeconds(draft.elapsedSeconds) : '',
  )
  const [rounds, setRounds] = useState(draft?.amrapRounds ?? 0)
  const [reps, setReps] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [pendingResult, setPendingResult] = useState<SessionResult | null>(null)

  function handleSaveResult() {
    if (scoreType === 'time') {
      const seconds = parseSeconds(timeInput)
      if (seconds == null || seconds <= 0) {
        setError('Enter a time like 8:42')
        return
      }
      setPendingResult({ metricType: 'time', value: seconds, unit: 'sec' })
    } else if (scoreType === 'rounds_and_reps') {
      if (rounds <= 0 && reps <= 0) {
        setError('Enter rounds and/or reps completed')
        return
      }
      setPendingResult({
        metricType: 'rounds_and_reps',
        value: encodeRoundsAndReps(rounds, reps),
        unit: 'rounds',
      })
    }
    setStep('rpe')
  }

  function commit(rpe?: number) {
    clearDraft()
    onCommit(scoreType === 'none' ? null : pendingResult, rpe)
  }

  return (
    <div className="rounded-lg bg-bg-surface p-4">
      {step === 'result' && (
        <>
          <p className="text-sm font-medium text-ink">Log your result</p>

          {scoreType === 'time' && (
            <div className="mt-2">
              <label className="text-xs text-ink-muted">Time</label>
              <input
                type="text"
                inputMode="text"
                value={timeInput}
                onChange={(e) => {
                  setTimeInput(e.target.value)
                  setError(null)
                }}
                placeholder="mm:ss"
                autoFocus
                className="mt-1 block w-28 rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          )}

          {scoreType === 'rounds_and_reps' && (
            <div className="mt-2 flex items-center gap-3">
              <div>
                <label className="text-xs text-ink-muted">Rounds</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={rounds}
                  onChange={(e) => {
                    setRounds(Number(e.target.value))
                    setError(null)
                  }}
                  autoFocus
                  className="mt-1 block w-16 rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted">+ Reps</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={reps}
                  onChange={(e) => {
                    setReps(Number(e.target.value))
                    setError(null)
                  }}
                  className="mt-1 block w-16 rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

          <button
            onClick={handleSaveResult}
            className="mt-3 w-full rounded-md bg-accent py-2 text-sm font-medium text-bg"
          >
            Save
          </button>
        </>
      )}

      {step === 'rpe' && <RpeGrid onSelect={(rpe) => commit(rpe)} onSkip={() => commit(undefined)} />}
    </div>
  )
}
