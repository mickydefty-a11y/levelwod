import { useMemo } from 'react'
import { generateCoachsBrief } from './coachsBrief'
import { formatValue } from './prFormat'
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
}: {
  sessionName: string
  isRetestDay?: boolean
  retestMovementName?: string | null
  sessionMovementIds: string[]
  weekFocus?: string | null
  movementIndex: Map<string, Movement>
}): string[] {
  const { historyFor } = usePRHistory()
  const { progress } = useProgress()
  const { log } = useWorkoutLog()
  const currentStreak = getCurrentStreak(log)

  return useMemo(() => {
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
      isRetestDay,
      retestMovementName,
      recentResult,
      recentUnlock,
      weekFocus,
      currentStreak,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionMovementIds, movementIndex, historyFor, progress, weekFocus, isRetestDay, retestMovementName, currentStreak, sessionName])
}
