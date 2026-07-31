import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadMovements } from '../lib/loadData'
import { useProgress } from '../lib/useProgress'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { Movement } from '../types/movement'

export default function Progress() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { progress, clearMovementProgress } = useProgress()
  const { log } = useWorkoutLog()

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const entries = useMemo(() => {
    if (!movements) return []
    const byId = new Map(movements.map((m) => [m.id, m]))
    return Object.entries(progress)
      .map(([movementId, entry]) => {
        const movement = byId.get(movementId)
        const label =
          movement?.type === 'progression'
            ? (movement.stages?.find((s) => s.id === entry.value)?.name ?? entry.value)
            : entry.value
        return { movement, ...entry, movementId, label }
      })
      .filter((e) => e.movement)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [movements, progress])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Progress</h1>

      {!movements ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          No progress saved yet. Open any movement in the{' '}
          <Link to="/library" className="text-coral-light underline">
            Library
          </Link>{' '}
          and tap a stage or level to mark where you're at.
        </p>
      ) : (
        <ul className="mt-4 space-y-1.5">
          {entries.map((e) => (
            <li
              key={e.movementId}
              className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2"
            >
              <Link to={`/library/${e.movementId}`} className="text-sm">
                {e.movement!.name}
                <span className="ml-2 text-xs text-coral-light">{e.label}</span>
              </Link>
              <button
                onClick={() => clearMovementProgress(e.movementId)}
                className="text-xs text-ink-muted underline"
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-coral">Workout history</h2>
        {log.length === 0 ? (
          <p className="mt-1.5 text-sm text-ink-muted">
            Completed days will show up here once you mark a session done.
          </p>
        ) : (
          <ul className="mt-1.5 space-y-2">
            {log.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-bg-surface px-3 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{entry.dayName}</span>
                  <span className="text-xs text-ink-muted">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  {entry.programName} · Week {entry.weekNumber}
                </p>
                {entry.results.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5">
                    {entry.results.map((r) => (
                      <li key={r.blockIndex} className="text-xs">
                        <Link to={`/library/${r.movementId}`} className="text-coral-light">
                          {r.movementName}
                        </Link>
                        <span className="text-ink-muted"> — {r.result}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs italic text-ink-muted">No results logged</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
