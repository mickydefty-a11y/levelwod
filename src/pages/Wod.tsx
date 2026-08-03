import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink'
import CoachsBriefBanner from '../components/CoachsBriefBanner'
import WarmupSection from '../components/WarmupSection'
import WorkoutSessionComplete, { type SessionResult } from '../components/WorkoutSessionComplete'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import { formatValue } from '../lib/prFormat'
import { sessionTimerConfigToPath } from '../lib/timerUrl'
import { useCoachsBrief } from '../lib/useCoachsBrief'
import { useMovementNoteToggle } from '../lib/useMovementNoteToggle'
import { usePRHistory } from '../lib/usePRHistory'
import { useSessionResultDraft } from '../lib/useSessionResultDraft'
import { useTodaysWod } from '../lib/useTodaysWod'
import { todayDateStr } from '../lib/wodGenerator'
import { scoreTypeForFormat, tierFillLabel, timerConfigForWod, wodFormatLabel } from '../lib/wodDisplay'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { Movement } from '../types/movement'
import type { WodSlot, WodTier } from '../types/wod'

const TIERS: { id: WodTier; label: string }[] = [
  { id: 'rx', label: 'RX' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'scaled', label: 'Scaled' },
]

function WodSlotRow({ slot, tier, movement }: { slot: WodSlot; tier: WodTier; movement?: Movement }) {
  const fill = slot.tiers[tier]
  const { note, show: showNote, toggle: toggleNote } = useMovementNoteToggle(fill.movementId)

  return (
    <li className="rounded-xl bg-bg-surface p-4">
      <p className="text-xs text-ink-muted">{slot.subcategory}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <Link to={`/library/${fill.movementId}`} className="text-base font-medium">
          {tierFillLabel(fill, movement)}
        </Link>
        {note && (
          <button
            onClick={toggleNote}
            aria-label={showNote ? 'Hide note' : 'Show note'}
            className="shrink-0 text-xs text-ink-muted"
          >
            📝
          </button>
        )}
      </div>
      {showNote && note && (
        <p className="mt-1 rounded-md bg-bg-raised px-2 py-1.5 text-xs italic text-ink-muted">
          {note.note}
        </p>
      )}
      <p className="mt-1 text-sm text-accent-light">{fill.amount}</p>
      {fill.loadNote && <p className="mt-0.5 text-xs text-ink-muted">{fill.loadNote}</p>}
    </li>
  )
}

export default function Wod() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [tier, setTier] = useState<WodTier>('rx')
  const wod = useTodaysWod()
  const sessionId = `wod-${todayDateStr()}`
  const scoreType = scoreTypeForFormat(wod.format)
  const { draft } = useSessionResultDraft(sessionId)
  const { addEntry: addPREntry } = usePRHistory()
  const { addEntry: addWorkoutLogEntry } = useWorkoutLog()

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

  function handleSessionCommit(result: SessionResult | null, rpe?: number) {
    if (result) {
      addPREntry({
        movementId: sessionId,
        metricType: result.metricType,
        value: result.value,
        unit: result.unit,
        date: new Date().toISOString().slice(0, 10),
        programContext: null,
        notes: null,
      })
    }
    addWorkoutLogEntry({
      programId: sessionId,
      programName: 'WOD Generator',
      dayName: wodFormatLabel(wod),
      completedAt: new Date().toISOString(),
      results: result
        ? [
            {
              blockIndex: 0,
              movementId: sessionId,
              movementName: wodFormatLabel(wod),
              prescription: wodFormatLabel(wod),
              result: formatValue(result.metricType, result.value, result.unit),
            },
          ]
        : [],
      rpe,
    })
  }

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

      {draft ? (
        <div className="mt-3">
          <WorkoutSessionComplete sessionId={sessionId} scoreType={scoreType} onCommit={handleSessionCommit} />
        </div>
      ) : (
        <Link
          to={sessionTimerConfigToPath(timerConfigForWod(wod), {
            sessionId,
            returnTo: '/wod',
            label: wodFormatLabel(wod),
          })}
          className="mt-3 block w-full rounded-lg bg-accent py-3 text-center text-base font-semibold text-bg"
        >
          Start Now
        </Link>
      )}

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
            {wod.slots.map((slot, i) => (
              <WodSlotRow
                key={i}
                slot={slot}
                tier={tier}
                movement={movementIndex.get(slot.tiers[tier].movementId)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
