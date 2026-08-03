import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink'
import { BENCHMARK_WODS } from '../lib/benchmarkWods'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import { bestEntry, formatValue } from '../lib/prFormat'
import { usePRHistory } from '../lib/usePRHistory'
import type { Movement } from '../types/movement'
import type { PREntry } from '../types/pr'

// A consolidated "browse everything I've logged" view — PR entries are
// shared storage across three different contexts (real movements, Benchmark
// WODs, and WOD Generator sessions, per the workout session flow), so each
// row here figures out which kind it is and links to wherever that content
// actually still exists to view (a WOD Generator session's original content
// isn't re-viewable after the day it happened, so those rows don't link
// anywhere — same underlying entry, no page left to send them to).
export default function PRHistoryOverview() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { allEntries } = usePRHistory()

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = useMemo(
    () => (movements ? buildMovementIndex(movements) : null),
    [movements],
  )
  const benchmarkIndex = useMemo(() => new Map(BENCHMARK_WODS.map((b) => [b.id, b])), [])

  const rows = useMemo(() => {
    const byId = new Map<string, PREntry[]>()
    for (const entry of allEntries()) {
      if (!byId.has(entry.movementId)) byId.set(entry.movementId, [])
      byId.get(entry.movementId)!.push(entry)
    }

    return [...byId.entries()]
      .map(([id, entries]) => {
        const best = bestEntry(entries)
        const mostRecent = entries[0]
        const movement = movementIndex?.get(id)
        const benchmark = benchmarkIndex.get(id)
        const to = movement ? `/library/${id}` : benchmark ? `/benchmarks/${id}` : null
        const name = movement?.name ?? benchmark?.name ?? 'WOD Generator session'
        return { id, name, to, count: entries.length, best, mostRecentDate: mostRecent?.date ?? '' }
      })
      .sort((a, b) => b.mostRecentDate.localeCompare(a.mostRecentDate))
  }, [allEntries, movementIndex, benchmarkIndex])

  return (
    <div>
      <BackLink to="/progress" label="Progress" />

      <h1 className="mt-2 text-2xl font-semibold">PR History</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Every number you've logged, across movements, benchmarks, and workouts.
      </p>

      {!movementIndex ? (
        <p className="mt-6 text-ink-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">
          No numbers logged yet. Log a PR from any movement, benchmark, or workout to see it here.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((row) => {
            const inner = (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-medium">{row.name}</h2>
                  {row.best && (
                    <span className="shrink-0 text-sm font-medium text-accent-light">
                      {formatValue(row.best.metricType, row.best.value, row.best.unit)}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {row.count} entr{row.count === 1 ? 'y' : 'ies'} logged
                </p>
              </>
            )
            return (
              <li key={row.id}>
                {row.to ? (
                  <Link to={row.to} className="block rounded-xl bg-bg-surface p-4 hover:bg-bg-raised">
                    {inner}
                  </Link>
                ) : (
                  <div className="rounded-xl bg-bg-surface p-4">{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
