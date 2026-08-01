import { useState } from 'react'
import { Link } from 'react-router-dom'
import { generateWarmup } from '../lib/warmupGenerator'
import type { Movement } from '../types/movement'

// Used by the WOD Generator and Benchmark WOD Library only — the 9
// structured programs already have their own hand-authored warmup blocks
// and are untouched by this.
export default function WarmupSection({
  movements,
  movementIndex,
}: {
  movements: Movement[]
  movementIndex: Map<string, Movement>
}) {
  const [skipped, setSkipped] = useState(false)
  const warmup = generateWarmup(movements)

  if (warmup.length === 0) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-accent">Warm-up</h2>
        <button onClick={() => setSkipped((s) => !s)} className="text-xs text-ink-muted underline">
          {skipped ? 'Show warm-up' : 'Skip warm-up'}
        </button>
      </div>

      {!skipped && (
        <ul className="mt-1.5 space-y-1.5">
          {warmup.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2"
            >
              <Link to={`/library/${item.movementId}`} className="text-sm">
                {movementIndex.get(item.movementId)?.name ?? item.movementId}
              </Link>
              <span className="text-xs text-ink-muted">{item.prescription}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
