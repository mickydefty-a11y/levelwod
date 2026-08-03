import { useState } from 'react'
import PRLogForm from './PRLogForm'
import { relativeTimeAgo } from '../lib/benchmarkDisplay'
import { bestEntry, formatValue } from '../lib/prFormat'
import { usePRHistory } from '../lib/usePRHistory'
import type { ScoreType } from '../types/scoreType'

// Reuses the existing PR log form/store exactly as built for movements — a
// benchmark is just logged under its own id ("fran") instead of a movement
// id. Display formats each entry via its own stored metricType (via
// formatValue) rather than assuming "time", since AMRAP benchmarks
// (Cindy/Mary/Nate) log rounds_and_reps instead.
export default function BenchmarkResults({
  benchmarkId,
  scoreType,
}: {
  benchmarkId: string
  scoreType: ScoreType
}) {
  const { historyFor, deleteEntry } = usePRHistory()
  const [showForm, setShowForm] = useState(false)

  const entries = historyFor(benchmarkId)
  const best = bestEntry(entries)
  const isRoundsAndReps = scoreType === 'rounds_and_reps'
  const heading = isRoundsAndReps ? 'Your scores' : 'Your times'
  const emptyLabel = isRoundsAndReps ? 'scores' : 'times'

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-accent">{heading}</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-xs text-accent-light underline">
            {isRoundsAndReps ? '+ Log a score' : '+ Log a time'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-2">
          <PRLogForm
            movementId={benchmarkId}
            defaultMetricType={isRoundsAndReps ? 'rounds_and_reps' : 'time'}
            onSaved={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {entries.length === 0 && !showForm && (
        <p className="mt-1.5 text-sm text-ink-muted">No {emptyLabel} logged yet — this is a good one to start.</p>
      )}

      {entries.length > 0 && (
        <div className="mt-2 rounded-lg bg-bg-surface p-3">
          {best && (
            <p className="text-sm">
              Best:{' '}
              <span className="font-medium text-accent-light">
                {formatValue(best.metricType, best.value, best.unit)}
              </span>
            </p>
          )}
          <ul className="mt-2 space-y-1.5 border-t border-white/5 pt-2">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">
                  {e.date} · {relativeTimeAgo(e.date)}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{formatValue(e.metricType, e.value, e.unit)}</span>
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
