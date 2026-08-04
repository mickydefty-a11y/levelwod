import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import BenchmarkResults from '../components/BenchmarkResults'
import CoachsBriefBanner from '../components/CoachsBriefBanner'
import InlineSessionTimer from '../components/InlineSessionTimer'
import WarmupSection from '../components/WarmupSection'
import WorkoutSessionComplete, { type SessionResult } from '../components/WorkoutSessionComplete'
import { movementFillLabel, timerConfigForBenchmark } from '../lib/benchmarkDisplay'
import { getBenchmarkWod } from '../lib/benchmarkWods'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import { formatValue } from '../lib/prFormat'
import { useCoachsBrief } from '../lib/useCoachsBrief'
import { useMovementNoteToggle } from '../lib/useMovementNoteToggle'
import { usePRHistory } from '../lib/usePRHistory'
import { useSessionResultDraft } from '../lib/useSessionResultDraft'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { BenchmarkMovementFill } from '../types/benchmark'
import type { Movement } from '../types/movement'
import type { TimerConfig } from '../types/timer'
import type { WodTier } from '../types/wod'

const TIERS: { id: WodTier; label: string }[] = [
  { id: 'rx', label: 'RX' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'scaled', label: 'Scaled' },
]

function BenchmarkMovementRow({
  fill,
  movement,
}: {
  fill: BenchmarkMovementFill
  movement?: Movement
}) {
  const { note, show: showNote, toggle: toggleNote } = useMovementNoteToggle(fill.movementId)

  return (
    <li className="rounded-xl bg-bg-surface p-4">
      <div className="flex items-center gap-2">
        <Link to={`/library/${fill.movementId}`} className="text-base font-medium">
          {movementFillLabel(fill, movement)}
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
      {fill.loadNote && <p className="mt-1 text-sm text-accent-light">{fill.loadNote}</p>}
    </li>
  )
}

export default function BenchmarkDetail() {
  const { id } = useParams<{ id: string }>()
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [tier, setTier] = useState<WodTier>('rx')
  const [sessionConfig, setSessionConfig] = useState<TimerConfig | null>(null)

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const benchmark = id ? getBenchmarkWod(id) : undefined
  const movementIndex = movements ? buildMovementIndex(movements) : null
  const sessionMovementIds = [
    ...new Set((benchmark?.tiers[tier].movements ?? []).map((fill) => fill.movementId)),
  ]
  const briefLines = useCoachsBrief({
    sessionName: benchmark?.name ?? 'this benchmark',
    sessionMovementIds,
    movementIndex: movementIndex ?? new Map(),
  })
  const { draft } = useSessionResultDraft(benchmark?.id ?? '')
  const { addEntry: addPREntry } = usePRHistory()
  const { addEntry: addWorkoutLogEntry } = useWorkoutLog()

  if (!benchmark) {
    return (
      <div>
        <p className="text-ink-muted">Benchmark not found.</p>
        <Link to="/programs" className="mt-2 inline-block text-accent-light underline">
          Back to Programs
        </Link>
      </div>
    )
  }

  const tierData = benchmark.tiers[tier]

  function handleSessionCommit(result: SessionResult | null, rpe?: number) {
    setSessionConfig(null)
    if (result) {
      addPREntry({
        movementId: benchmark!.id,
        metricType: result.metricType,
        value: result.value,
        unit: result.unit,
        date: new Date().toISOString().slice(0, 10),
        programContext: null,
        notes: null,
      })
    }
    addWorkoutLogEntry({
      programId: benchmark!.id,
      programName: 'Benchmark WOD',
      dayName: benchmark!.name,
      completedAt: new Date().toISOString(),
      results: result
        ? [
            {
              blockIndex: 0,
              movementId: benchmark!.id,
              movementName: benchmark!.name,
              prescription: benchmark!.format,
              result: formatValue(result.metricType, result.value, result.unit),
            },
          ]
        : [],
      rpe,
    })
  }

  return (
    <div>
      <BackLink to="/benchmarks" label="Benchmark WODs" />

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">{benchmark.name}</h1>
        <span className="shrink-0 text-xs text-accent-light">{benchmark.wodCategory} WOD</span>
      </div>
      <p className="mt-1 text-sm font-medium text-accent-light">
        {benchmark.format}
        {benchmark.repScheme ? ` — ${benchmark.repScheme}` : ''}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{benchmark.description}</p>

      {benchmark.memorialTribute && benchmark.originNote && (
        <div className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">In memoriam</p>
          <p className="mt-1.5 text-sm italic leading-relaxed text-ink">{benchmark.originNote}</p>
        </div>
      )}
      {!benchmark.memorialTribute && benchmark.originNote && (
        <p className="mt-2 text-xs italic leading-relaxed text-ink-muted">{benchmark.originNote}</p>
      )}

      {draft ? (
        <div className="mt-4">
          <WorkoutSessionComplete
            sessionId={benchmark.id}
            scoreType={benchmark.scoreType}
            onCommit={handleSessionCommit}
          />
        </div>
      ) : sessionConfig ? (
        <div className="mt-4">
          <InlineSessionTimer config={sessionConfig} sessionId={benchmark.id} label={benchmark.name} />
        </div>
      ) : (
        <button
          onClick={() => setSessionConfig(timerConfigForBenchmark(benchmark))}
          className="mt-4 block w-full rounded-lg bg-accent py-3 text-center text-base font-semibold text-bg"
        >
          Start Now
        </button>
      )}

      {movementIndex && (
        <div className="mt-3">
          <CoachsBriefBanner lines={briefLines} />
        </div>
      )}

      <div className="mt-4 flex gap-1.5">
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
        <div className="mt-3">
          <WarmupSection
            movements={tierData.movements
              .map((fill) => movementIndex.get(fill.movementId))
              .filter((m): m is Movement => !!m)}
            movementIndex={movementIndex}
          />

          <ul className="mt-4 space-y-2">
            {tierData.movements.map((fill, i) => (
              <BenchmarkMovementRow key={i} fill={fill} movement={movementIndex.get(fill.movementId)} />
            ))}
          </ul>
          {tierData.note && <p className="mt-2 text-xs italic text-ink-muted">{tierData.note}</p>}
        </div>
      )}

      <BenchmarkResults benchmarkId={benchmark.id} scoreType={benchmark.scoreType} />
    </div>
  )
}
