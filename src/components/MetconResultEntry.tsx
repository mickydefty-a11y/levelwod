import { useState } from 'react'
import { encodeRoundsAndReps, formatSeconds, formatValue, parseSeconds } from '../lib/prFormat'
import type { SessionResultDraft } from '../lib/useSessionResultDraft'
import type { ScoreType } from '../types/scoreType'

// The result-entry half of the workout session flow, scoped to a single
// program block rather than a whole session — RPE is deliberately left out
// here since ActiveDayCard already captures it once at "Mark day complete"
// for the whole day, not per block.
export default function MetconResultEntry({
  scoreType,
  draft,
  onSave,
}: {
  scoreType: Extract<ScoreType, 'time' | 'rounds_and_reps'>
  draft: SessionResultDraft
  onSave: (text: string) => void
}) {
  const [timeInput, setTimeInput] = useState(
    draft.elapsedSeconds != null ? formatSeconds(draft.elapsedSeconds) : '',
  )
  const [rounds, setRounds] = useState(draft.amrapRounds ?? 0)
  const [reps, setReps] = useState(0)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    if (scoreType === 'time') {
      const seconds = parseSeconds(timeInput)
      if (seconds == null || seconds <= 0) {
        setError('Enter a time like 8:42')
        return
      }
      onSave(formatValue('time', seconds, 'sec'))
    } else {
      if (rounds <= 0 && reps <= 0) {
        setError('Enter rounds and/or reps completed')
        return
      }
      onSave(formatValue('rounds_and_reps', encodeRoundsAndReps(rounds, reps), 'rounds'))
    }
  }

  return (
    <div className="mt-2 rounded-md bg-bg-raised p-2.5">
      <p className="text-xs font-medium text-ink">Log your result</p>

      {scoreType === 'time' && (
        <div className="mt-1.5">
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
            className="block w-28 rounded-md bg-bg-surface px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      )}

      {scoreType === 'rounds_and_reps' && (
        <div className="mt-1.5 flex items-center gap-3">
          <div>
            <label className="text-[10px] text-ink-muted">Rounds</label>
            <input
              type="number"
              inputMode="numeric"
              value={rounds}
              onChange={(e) => {
                setRounds(Number(e.target.value))
                setError(null)
              }}
              autoFocus
              className="mt-0.5 block w-16 rounded-md bg-bg-surface px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-[10px] text-ink-muted">+ Reps</label>
            <input
              type="number"
              inputMode="numeric"
              value={reps}
              onChange={(e) => {
                setReps(Number(e.target.value))
                setError(null)
              }}
              className="mt-0.5 block w-16 rounded-md bg-bg-surface px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        className="mt-2 w-full rounded-md bg-accent py-1.5 text-xs font-medium text-bg"
      >
        Save
      </button>
    </div>
  )
}
