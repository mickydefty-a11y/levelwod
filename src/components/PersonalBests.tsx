import { useState } from 'react'
import PRLogForm from './PRLogForm'
import { bestEntry, formatValue } from '../lib/prFormat'
import { usePRHistory } from '../lib/usePRHistory'
import { METRIC_LABELS, type MetricType, type PREntry } from '../types/pr'

function Sparkline({ entries }: { entries: PREntry[] }) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const values = sorted.map((e) => e.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = sorted
    .map((e, i) => {
      const x = sorted.length === 1 ? 50 : (i / (sorted.length - 1)) * 100
      const y = 100 - ((e.value - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-2 h-10 w-full text-accent">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

export default function PersonalBests({ movementId }: { movementId: string }) {
  const { historyFor, deleteEntry } = usePRHistory()
  const [showForm, setShowForm] = useState(false)
  const [expandedMetric, setExpandedMetric] = useState<MetricType | null>(null)

  const history = historyFor(movementId)
  const byMetric = new Map<MetricType, PREntry[]>()
  for (const e of history) {
    if (!byMetric.has(e.metricType)) byMetric.set(e.metricType, [])
    byMetric.get(e.metricType)!.push(e)
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-accent">Personal bests</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-xs text-accent-light underline">
            + Log a number
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-2">
          <PRLogForm
            movementId={movementId}
            onSaved={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {byMetric.size === 0 && !showForm && (
        <p className="mt-1.5 text-sm text-ink-muted">No numbers logged yet for this movement.</p>
      )}

      {byMetric.size > 0 && (
        <div className="mt-2 space-y-2">
          {[...byMetric.entries()].map(([metricType, entries]) => {
            const best = bestEntry(entries)
            const isExpanded = expandedMetric === metricType
            return (
              <div key={metricType} className="rounded-lg bg-bg-surface p-3">
                <button
                  onClick={() => setExpandedMetric(isExpanded ? null : metricType)}
                  className="flex w-full items-center justify-between"
                >
                  <span className="text-sm font-medium">{METRIC_LABELS[metricType]}</span>
                  <span className="text-sm text-accent-light">
                    {best && formatValue(metricType, best.value, best.unit)}
                  </span>
                </button>

                {entries.length >= 3 && <Sparkline entries={entries} />}

                {isExpanded && (
                  <ul className="mt-2 space-y-1.5 border-t border-white/5 pt-2">
                    {entries.map((e) => (
                      <li key={e.id} className="flex items-center justify-between text-xs">
                        <span className="text-ink-muted">
                          {e.date}
                          {e.programContext ? ` · ${e.programContext}` : ''}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{formatValue(e.metricType, e.value, e.unit)}</span>
                          <button
                            onClick={() => deleteEntry(movementId, e.id)}
                            className="text-ink-muted underline"
                          >
                            Delete
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
