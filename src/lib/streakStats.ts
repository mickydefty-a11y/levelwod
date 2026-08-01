import type { Movement } from '../types/movement'
import type { ProgressMap } from './useProgress'
import type { WorkoutLogEntry } from './useWorkoutLog'

// How many calendar days can pass with no session before a streak resets.
// A normal rest day or two shouldn't count against someone.
export const STREAK_GRACE_DAYS = 3

function toDateStr(iso: string): string {
  return iso.slice(0, 10)
}

function parseDateStr(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`)
}

function daysBetween(a: string, b: string): number {
  return Math.round((parseDateStr(b).getTime() - parseDateStr(a).getTime()) / 86_400_000)
}

function addDays(dateStr: string, delta: number): string {
  const d = parseDateStr(dateStr)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// Unique calendar dates a session was completed on, ascending.
export function getSessionDates(log: WorkoutLogEntry[]): string[] {
  return [...new Set(log.map((e) => toDateStr(e.completedAt)))].sort()
}

export function getCurrentStreak(
  log: WorkoutLogEntry[],
  today: string = todayStr(),
  graceDays: number = STREAK_GRACE_DAYS,
): number {
  const dates = getSessionDates(log)
  if (dates.length === 0) return 0

  const last = dates[dates.length - 1]
  if (daysBetween(last, today) > graceDays + 1) return 0

  let streak = 1
  for (let i = dates.length - 1; i > 0; i--) {
    if (daysBetween(dates[i - 1], dates[i]) <= graceDays + 1) streak++
    else break
  }
  return streak
}

export function getLongestStreak(
  log: WorkoutLogEntry[],
  graceDays: number = STREAK_GRACE_DAYS,
): number {
  const dates = getSessionDates(log)
  if (dates.length === 0) return 0

  let longest = 1
  let current = 1
  for (let i = 1; i < dates.length; i++) {
    current = daysBetween(dates[i - 1], dates[i]) <= graceDays + 1 ? current + 1 : 1
    longest = Math.max(longest, current)
  }
  return longest
}

export function getTotalSessions(log: WorkoutLogEntry[]): number {
  return log.length
}

// Distinct days trained since the most recent Monday, inclusive of today.
export function getThisWeekSessionCount(log: WorkoutLogEntry[], today: string = todayStr()): number {
  const dow = parseDateStr(today).getUTCDay()
  const mondayOffset = (dow + 6) % 7
  const weekStart = addDays(today, -mondayOffset)
  return getSessionDates(log).filter((d) => d >= weekStart && d <= today).length
}

export function getMovementsAtOrAboveRX(movements: Movement[], progress: ProgressMap): number {
  let count = 0
  for (const movement of movements) {
    const entry = progress[movement.id]
    if (!entry) continue

    const level =
      movement.type === 'progression'
        ? movement.stages?.find((s) => s.id === entry.value)?.level
        : movement.type === 'tutorial'
          ? entry.value
          : undefined

    if (level === 'RX' || level === 'Elite') count++
  }
  return count
}
