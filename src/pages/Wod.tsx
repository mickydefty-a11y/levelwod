import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink'
import CoachsBriefBanner from '../components/CoachsBriefBanner'
import WarmupSection from '../components/WarmupSection'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import { useCoachsBrief } from '../lib/useCoachsBrief'
import { useTodaysWod } from '../lib/useTodaysWod'
import { tierFillLabel, wodFormatLabel } from '../lib/wodDisplay'
import type { Movement } from '../types/movement'
import type { WodTier } from '../types/wod'

const TIERS: { id: WodTier; label: string }[] = [
  { id: 'rx', label: 'RX' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'scaled', label: 'Scaled' },
]

export default function Wod() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [tier, setTier] = useState<WodTier>('rx')
  const wod = useTodaysWod()

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = movements ? buildMovementIndex(movements) : null
  const sessionMovementIds = [...new Set(wod.slots.map((slot) => slot.tiers[tier].movementId))]
  const briefLines = useCoachsBrief({
    sessionName: "Today's WOD",
    sessionMovementIds,
    movementIndex: movementIndex ?? new Map(),
  })

  return (
    <div>
      <BackLink to="/" label="Home" />

      <h1 className="mt-2 text-2xl font-semibold">Today's WOD</h1>
      <p className="mt-1 text-xs text-ink-muted">
        Completely optional — an extra if you feel like it, not a replacement for your program.
      </p>

      {movementIndex && (
        <div className="mt-3">
          <CoachsBriefBanner lines={briefLines} />
        </div>
      )}

      <p className="mt-3 text-sm font-medium text-accent-light">{wodFormatLabel(wod)}</p>

      <div className="mt-3 flex gap-1.5">
        {TIERS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTier(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              tier === t.id ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!movementIndex ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : (
        <>
          <WarmupSection
            movements={wod.slots
              .map((slot) => movementIndex.get(slot.tiers[tier].movementId))
              .filter((m): m is Movement => !!m)}
            movementIndex={movementIndex}
          />

          <ul className="mt-4 space-y-2">
            {wod.slots.map((slot, i) => {
              const fill = slot.tiers[tier]
              const movement = movementIndex.get(fill.movementId)
              return (
                <li key={i} className="rounded-xl bg-bg-surface p-4">
                  <p className="text-xs text-ink-muted">{slot.subcategory}</p>
                  <Link
                    to={`/library/${fill.movementId}`}
                    className="mt-0.5 block text-base font-medium"
                  >
                    {tierFillLabel(fill, movement)}
                  </Link>
                  <p className="mt-1 text-sm text-accent-light">{fill.amount}</p>
                  {fill.loadNote && <p className="mt-0.5 text-xs text-ink-muted">{fill.loadNote}</p>}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
