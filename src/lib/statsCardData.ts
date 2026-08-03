import { formatSeconds, formatValue, isTimeMetric } from './prFormat'
import { getCurrentStreak, getMovementsAtOrAboveRX, getTotalSessions } from './streakStats'
import { METRIC_LOWER_IS_BETTER } from '../types/pr'
import type { PREntry } from '../types/pr'
import type { StatsCardOption } from '../types/statsCard'
import type { JourneyCardData, PRCardData, StreakCardData } from '../types/statsCard'
import type { Movement } from '../types/movement'
import type { ProgressMap } from './useProgress'
import type { CompletedProgram } from './useProgramHistory'
import type { WorkoutLogEntry } from './useWorkoutLog'

export function buildStreakCardData(log: WorkoutLogEntry[]): StreakCardData | null {
  const totalSessions = getTotalSessions(log)
  if (totalSessions === 0) return null
  return { type: 'streak', currentStreak: getCurrentStreak(log), totalSessions }
}

export function buildJourneyCardData(
  log: WorkoutLogEntry[],
  completed: CompletedProgram[],
  movements: Movement[],
  progress: ProgressMap,
): JourneyCardData | null {
  const totalSessions = getTotalSessions(log)
  if (totalSessions === 0) return null
  return {
    type: 'journey',
    programsCompleted: completed.length,
    totalSessions,
    skillsUnlocked: getMovementsAtOrAboveRX(movements, progress),
  }
}

// Improvement is only reported when the featured entry is a genuine
// improvement over the entry immediately before it for the same movement +
// metric (matching how the entry's own history is already sorted) — a
// regression, a first-ever log, or a unit mismatch (e.g. kg vs lb) all
// honestly show no comparison rather than a fabricated one.
export function buildPRCardData(
  entry: PREntry,
  historyForMovement: PREntry[],
  movementName: string,
): PRCardData {
  const sameMetric = historyForMovement
    .filter((e) => e.metricType === entry.metricType)
    .sort((a, b) => b.date.localeCompare(a.date))
  const idx = sameMetric.findIndex((e) => e.id === entry.id)
  const prior = idx >= 0 ? sameMetric[idx + 1] : undefined

  let improvementLabel: string | null = null
  if (prior && prior.unit === entry.unit) {
    const lowerIsBetter = METRIC_LOWER_IS_BETTER[entry.metricType]
    const improved = lowerIsBetter ? entry.value < prior.value : entry.value > prior.value
    if (improved) {
      if (isTimeMetric(entry.metricType)) {
        const priorFormatted = formatSeconds(prior.value)
        improvementLabel = lowerIsBetter ? `down from ${priorFormatted}` : `up from ${priorFormatted}`
      } else {
        const magnitude = Math.abs(entry.value - prior.value)
        improvementLabel = `+${magnitude}${entry.unit} since last`
      }
    }
  }

  return {
    type: 'pr',
    movementName,
    valueLabel: formatValue(entry.metricType, entry.value, entry.unit),
    date: entry.date,
    improvementLabel,
  }
}

const NO_SESSIONS_REASON = 'Complete at least one session to unlock this card.'

// Assembles all three template options in one place, each disabled with an
// honest explanation when there isn't real data to back it — never a broken
// or blank card. featuredPREntry defaults to the most recently logged PR
// across every movement; pass a different entry to feature a specific one.
export function buildStatsCardOptions({
  log,
  completed,
  movements,
  progress,
  prEntries,
  historyForMovement,
  movementName,
  featuredPREntry,
}: {
  log: WorkoutLogEntry[]
  completed: CompletedProgram[]
  movements: Movement[]
  progress: ProgressMap
  prEntries: PREntry[]
  historyForMovement: (movementId: string) => PREntry[]
  movementName: (movementId: string) => string
  featuredPREntry?: PREntry
}): StatsCardOption[] {
  const streakData = buildStreakCardData(log)
  const journeyData = buildJourneyCardData(log, completed, movements, progress)

  const prSource = featuredPREntry ?? prEntries[0]
  const prData = prSource
    ? buildPRCardData(prSource, historyForMovement(prSource.movementId), movementName(prSource.movementId))
    : null

  return [
    {
      type: 'streak',
      label: 'Streak',
      data: streakData,
      disabledReason: streakData ? null : NO_SESSIONS_REASON,
    },
    {
      type: 'pr',
      label: 'PR Highlight',
      data: prData,
      disabledReason: prData ? null : 'Log a PR to unlock this card.',
    },
    {
      type: 'journey',
      label: 'Journey Summary',
      data: journeyData,
      disabledReason: journeyData ? null : NO_SESSIONS_REASON,
    },
  ]
}
