import { useState } from 'react'
import { useTrainingMax } from '../lib/useTrainingMax'
import type { Movement } from '../types/movement'
import type { WeightUnit } from '../types/program'

export default function OneRepMaxForm({
  programId,
  movementIds,
  movementIndex,
  onDone,
  onCancel,
}: {
  programId: string
  movementIds: string[]
  movementIndex: Map<string, Movement>
  onDone: () => void
  onCancel: () => void
}) {
  const { dataFor, setOneRepMaxes } = useTrainingMax()
  const existing = dataFor(programId)
  const [unit, setUnit] = useState<WeightUnit>(existing?.unit ?? 'kg')
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const id of movementIds) initial[id] = existing?.oneRepMax[id]?.toString() ?? ''
    return initial
  })
  const [error, setError] = useState<string | null>(null)

  function save() {
    const parsed: Record<string, number> = {}
    for (const id of movementIds) {
      const n = Number(values[id])
      if (!values[id] || Number.isNaN(n) || n <= 0) {
        setError(`Enter a valid 1-rep max for ${movementIndex.get(id)?.name ?? id}`)
        return
      }
      parsed[id] = n
    }
    setOneRepMaxes(programId, unit, parsed)
    onDone()
  }

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <h2 className="text-sm font-semibold text-accent">Enter your current 1-rep maxes</h2>
      <p className="mt-1 text-xs text-ink-muted">
        This program calculates every working weight from a 90% Training Max based on the numbers
        below. Enter your best true 1RM for each lift.
      </p>

      <div className="mt-3 flex gap-1.5">
        {(['kg', 'lb'] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              unit === u ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {movementIds.map((id) => (
          <div key={id} className="flex items-center justify-between gap-2">
            <label htmlFor={`orm-${id}`} className="text-sm">
              {movementIndex.get(id)?.name ?? id}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id={`orm-${id}`}
                type="number"
                inputMode="decimal"
                value={values[id]}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, [id]: e.target.value }))
                  setError(null)
                }}
                placeholder="0"
                className="w-20 rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <span className="text-xs text-ink-muted">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button onClick={save} className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium text-bg">
          Start program
        </button>
        <button onClick={onCancel} className="flex-1 rounded-lg bg-bg-raised py-2 text-sm text-ink-muted">
          Cancel
        </button>
      </div>
    </div>
  )
}
