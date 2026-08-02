import { useEffect, useState } from 'react'
import {
  LOADABLE_STRENGTH_MOVEMENT_IDS,
  MAX_REPS,
  estimateOneRepMax,
  generateRepMaxTable,
  isTechnicalLift,
  roundEstimate,
} from '../lib/oneRepMaxCalculator'
import { usePRHistory } from '../lib/usePRHistory'
import type { Movement } from '../types/movement'
import type { WeightUnit } from '../types/program'

export default function OneRepMaxCalculator({
  movementIndex,
  movementIds,
  initialMovementId,
  unit: controlledUnit,
  onUseEstimate,
}: {
  movementIndex: Map<string, Movement>
  // restricts the movement picker; defaults to the full curated strength-lift list
  movementIds?: string[]
  initialMovementId?: string
  // when provided, hides the internal unit toggle and uses this unit instead
  // (e.g. embedded in a form that already has its own kg/lb selection)
  unit?: WeightUnit
  onUseEstimate?: (movementId: string, oneRepMax: number) => void
}) {
  const { historyFor } = usePRHistory()
  const candidateIds = movementIds ?? LOADABLE_STRENGTH_MOVEMENT_IDS
  const [movementId, setMovementId] = useState(initialMovementId ?? candidateIds[0])
  const [internalUnit, setInternalUnit] = useState<WeightUnit>('kg')
  const unit = controlledUnit ?? internalUnit
  const [reps, setReps] = useState('1')
  const [weight, setWeight] = useState('')

  // Pre-fill from the most recent logged weight PR for this movement,
  // whenever one exists — a raw weight PR carries no rep count today, so a
  // logged number is treated as a straight 1-rep entry, which is also a
  // no-op for Brzycki (reps=1 always returns the input weight unchanged).
  useEffect(() => {
    const mostRecent = historyFor(movementId).find((e) => e.metricType === 'weight')
    if (mostRecent) {
      setReps('1')
      setWeight(mostRecent.value.toString())
      if (!controlledUnit) setInternalUnit(mostRecent.unit === 'lb' ? 'lb' : 'kg')
    } else {
      setReps('1')
      setWeight('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movementId])

  const repsNum = Number(reps)
  const weightNum = Number(weight)
  const isValid =
    weight.trim() !== '' && !Number.isNaN(weightNum) && weightNum > 0 && repsNum >= 1 && repsNum <= MAX_REPS

  const estimated1RM = isValid ? roundEstimate(estimateOneRepMax(weightNum, repsNum), unit) : null
  const table = isValid ? generateRepMaxTable(estimateOneRepMax(weightNum, repsNum), unit) : []

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      {candidateIds.length > 1 && (
        <div>
          <label htmlFor="orm-calc-movement" className="text-xs text-ink-muted">
            Movement
          </label>
          <select
            id="orm-calc-movement"
            value={movementId}
            onChange={(e) => setMovementId(e.target.value)}
            className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {candidateIds.map((id) => (
              <option key={id} value={id}>
                {movementIndex.get(id)?.name ?? id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-2 flex items-end gap-2">
        <div className="flex-1">
          <label htmlFor="orm-calc-reps" className="text-xs text-ink-muted">
            Reps performed
          </label>
          <input
            id="orm-calc-reps"
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_REPS}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="orm-calc-weight" className="text-xs text-ink-muted">
            Weight lifted
          </label>
          <input
            id="orm-calc-weight"
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        {!controlledUnit && (
          <div className="flex gap-1 pb-0.5">
            {(['kg', 'lb'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setInternalUnit(u)}
                className={`rounded-full px-2.5 py-1.5 text-xs font-medium ${
                  unit === u ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        )}
      </div>

      {repsNum > MAX_REPS && (
        <p className="mt-2 text-xs text-red-400">
          Capped at {MAX_REPS} reps — the formula gets unreliable beyond that range.
        </p>
      )}

      {isTechnicalLift(movementId) && (
        <p className="mt-2 text-xs italic text-ink-muted">
          Estimates are less reliable for technical lifts like this one — skill and bar speed under
          fatigue matter as much as raw strength, so treat this as a rough guide.
        </p>
      )}

      {estimated1RM != null && (
        <>
          <div className="mt-3 rounded-lg bg-accent/15 px-3 py-2">
            <p className="text-xs text-ink-muted">Estimated 1RM</p>
            <p className="text-xl font-semibold text-accent-light">
              {estimated1RM} {unit}
            </p>
          </div>

          {onUseEstimate && (
            <button
              onClick={() => onUseEstimate(movementId, estimated1RM)}
              className="mt-2 w-full rounded-lg bg-accent py-2 text-sm font-medium text-bg"
            >
              Use this estimate
            </button>
          )}

          <table className="mt-3 w-full text-sm">
            <tbody>
              {table.map((row) => (
                <tr
                  key={row.reps}
                  className={row.reps === repsNum ? 'bg-accent/10' : undefined}
                >
                  <td className="py-1 pl-2 text-ink-muted">{row.reps}RM</td>
                  <td className="py-1 pr-2 text-right font-medium">
                    {row.weight} {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-2 text-xs text-ink-muted">
            An estimate, not a measurement — individual fatigue profiles vary. Good for planning, not
            a substitute for an actual tested max.
          </p>
        </>
      )}
    </div>
  )
}
