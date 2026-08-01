import { useState } from 'react'
import PRLogForm from './PRLogForm'
import { relativeTimeAgo } from '../lib/benchmarkDisplay'
import { bestEntry, formatSeconds } from '../lib/prFormat'
import { usePRHistory } from '../lib/usePRHistory'

// Reuses the existing PR log form/store exactly as built for movements —
// a benchmark is just logged under its own id ("fran") instead of a
// movement id, fixed to the "time" metric since that's the only one that
// makes sense for a for-time/AMRAP benchmark.
export default function BenchmarkResults({ benchmarkId }: { benchmarkId: string }) {
  const { historyFor, deleteEntry } = usePRHistory()
  const [showForm, setShowForm] = useState(false)

  const entries = historyFor(benchmarkId)
  const best = bestEntry(entries)

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-accent">Your times</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-xs text-accent-light underline">
            + Log a time
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-2">
          <PRLogForm
            movementId={benchmarkId}
            defaultMetricType="time"
            onSaved={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <p className="mt-1.5 text-sm text-ink-muted">No times logged yet — this is a good one to start.</p>
      )}

      {entries.length > 0 && (
        <div className="mt-2 rounded-lg bg-bg-surface p-3">
          {best && (
            <p className="text-sm">
              Best: <span className="font-medium text-accent-light">{formatSeconds(best.value)}</span>
            </p>
          )}
          <ul className="mt-2 space-y-1.5 border-t border-white/5 pt-2">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">
                  {e.date} · {relativeTimeAgo(e.date)}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{formatSeconds(e.value)}</span>
                  <button
                    onClick={() => deleteEntry(benchmarkId, e.id)}
                    className="text-ink-muted underline"
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
