import { useEffect, useMemo, useState } from 'react'
import BackLink from '../components/BackLink'
import RowingStandardsTool from '../components/RowingStandardsTool'
import RunningStandardsTool from '../components/RunningStandardsTool'
import StrengthStandardsTool from '../components/StrengthStandardsTool'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import type { Movement } from '../types/movement'

type Tab = 'strength' | 'rowing' | 'running'

const TABS: { id: Tab; label: string }[] = [
  { id: 'strength', label: 'Strength' },
  { id: 'rowing', label: 'Rowing' },
  { id: 'running', label: 'Running' },
]

export default function StandardsHub() {
  const [tab, setTab] = useState<Tab>('strength')
  const [movements, setMovements] = useState<Movement[] | null>(null)

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = useMemo(
    () => (movements ? buildMovementIndex(movements) : null),
    [movements],
  )

  return (
    <div>
      <BackLink to="/progress" label="Progress" />

      <h1 className="mt-2 text-2xl font-semibold">Standards &amp; Percentiles</h1>
      <p className="mt-1 text-sm text-ink-muted">
        See how a number you've logged compares to a reference population.
      </p>

      <div className="mt-4 flex gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium ${
              tab === t.id ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {tab === 'strength' && (movementIndex ? <StrengthStandardsTool movementIndex={movementIndex} /> : <p className="text-ink-muted">Loading…</p>)}
        {tab === 'rowing' && <RowingStandardsTool />}
        {tab === 'running' && <RunningStandardsTool />}
      </div>
    </div>
  )
}
