import { useMemo } from 'react'
import { generateCoachsBrief } from './coachsBrief'
import { formatValue } from './prFormat'
import { detectAutoregulationNudge } from './rpeAutoregulation'
import { getCurrentStreak } from './streakStats'
import { usePRHistory } from './usePRHistory'
import { useProgress } from './useProgress'
import { useWorkoutLog } from './useWorkoutLog'
import type { Movement } from '../types/movement'
import type { CoachsBriefInput } from '../types/coachsBrief'

// judgment calls, not specified exactly by the spec — easy to retune
const RECENT_PR_WINDOW_DAYS = 21
const RECENT_UNLOCK_WINDOW_DAYS = 7

function daysAgo(dateStr: string): number {
  const then = new Date(`${dateStr.slice(0, 10)}T00:00:00Z`).getTime()
  return Math.floor((Date.now() - then) / 86_400_000)
}

// Resolves the real data each priority rule needs (read-only — reuses the
// existing PR history, stage progress, and streak hooks exactly as built,
// never writes to any of them) and hands it to the pure generateCoachsBrief
// function. Works identically for a structured program day, a WOD
// Generator session, or a Benchmark WOD — the only thing that differs
// between them is which fields the caller has available to pass in.
export function useCoachsBrief({
  sessionName,
  isRetestDay = false,
  retestMovementName = null,
  sessionMovementIds,
  weekFocus = null,
  movementIndex,
  isFirstSession = false,
  startReason = null,
}: {
  sessionName: string
  isRetestDay?: boolean
  retestMovementName?: string | null
  sessionMovementIds: string[]
  weekFocus?: string | null
  movementIndex: Map<string, Movement>
  // only meaningful for structured-program sessions — the program-quiz's
  // reason for recommending the current program, shown once on week 1 day 1
  isFirstSession?: boolean
  startReason?: string | null
}): string[] {
  const { historyFor } = usePRHistory()
  const { progress } = useProgress()
  const { log } = useWorkoutLog()
  const currentStreak = getCurrentStreak(log)
  // Deload weeks are already handling recovery — a redundant nudge there
  // would just be noise. Reuses the same weekFocus text rule 4 already
  // reads, so this naturally only ever applies within structured-program
  // sessions (the WOD Generator and Benchmark pages don't pass a
  // weekFocus, so there's nothing to suppress against there).
  const isDeloadWeek = (weekFocus ?? '').toLowerCase().includes('deload')

  return useMemo(() => {
    // Rule 0: recent effort trend, regardless of which session this is —
    // "how have you been feeling lately" isn't scoped to today's program.
    const rpeHistory = log.map((e) => e.rpe).filter((rpe): rpe is number => rpe != null)
    const nudge = isDeloadWeek ? null : detectAutoregulationNudge(rpeHistory)


    // Rule 2: first session movement (in order) with a recent logged result
    let recentResult: CoachsBriefInput['recentResult'] = null
    for (const movementId of sessionMovementIds) {
      const entries = historyFor(movementId)
      const mostRecent = entries[0]
      if (!mostRecent || daysAgo(mostRecent.date) > RECENT_PR_WINDOW_DAYS) continue
      const movement = movementIndex.get(movementId)
      recentResult = {
        movementName: movement?.name ?? movementId,
        displayValue: formatValue(mostRecent.metricType, mostRecent.value, mostRecent.unit),
      }
      break
    }

    // Rule 3: first session movement (in order) unlocked to a new stage recently
    let recentUnlock: CoachsBriefInput['recentUnlock'] = null
    for (const movementId of sessionMovementIds) {
      const entry = progress[movementId]
      if (!entry || daysAgo(entry.updatedAt) > RECENT_UNLOCK_WINDOW_DAYS) continue
      const movement = movementIndex.get(movementId)
      if (!movement) continue
      const stageName =
        movement.type === 'progression'
          ? movement.stages?.find((s) => s.id === entry.value)?.name
          : entry.value
      if (!stageName) continue
      recentUnlock = { movementName: movement.name, stageName }
      break
    }

    return generateCoachsBrief({
      sessionName,
      autoregulationNudge: nudge?.message ?? null,
      isFirstSession,
      startReason,
      isRetestDay,
      retestMovementName,
      recentResult,
      recentUnlock,
      weekFocus,
      currentStreak,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionMovementIds,
    movementIndex,
    historyFor,
    progress,
    weekFocus,
    isRetestDay,
    retestMovementName,
    currentStreak,
    sessionName,
    log,
    isDeloadWeek,
    isFirstSession,
    startReason,
  ])
}
