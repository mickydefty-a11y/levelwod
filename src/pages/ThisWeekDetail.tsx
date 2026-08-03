import { useMemo } from 'react'
import BackLink from '../components/BackLink'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { WorkoutLogEntry } from '../lib/useWorkoutLog'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// Monday-start week boundary, matching streakStats.ts's getThisWeekSessionCount.
function mondayOf(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const offset = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - offset)
  return d.toISOString().slice(0, 10)
}

function addDays(dateStr: string, delta: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

export default function ThisWeekDetail() {
  const { log } = useWorkoutLog()
  const today = todayStr()

  const days = useMemo(() => {
    const start = mondayOf(today)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [today])

  const entriesByDate = useMemo(() => {
    const map = new Map<string, WorkoutLogEntry[]>()
    for (const entry of log) {
      const date = entry.completedAt.slice(0, 10)
      if (!map.has(date)) map.set(date, [])
      map.get(date)!.push(entry)
    }
    return map
  }, [log])

  const sessionsThisWeek = days.reduce((sum, d) => sum + (entriesByDate.get(d)?.length ?? 0), 0)
  const thisWeeksEntries = days
    .flatMap((d) => entriesByDate.get(d) ?? [])
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))

  return (
    <div>
      <BackLink to="/progress" label="Progress" />

      <h1 className="mt-2 text-2xl font-semibold">This Week</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {sessionsThisWeek} session{sessionsThisWeek === 1 ? '' : 's'} logged this week.
      </p>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map((date, i) => {
          const hasSession = (entriesByDate.get(date)?.length ?? 0) > 0
          const isToday = date === today
          const isFuture = date > today
          return (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-ink-muted">{DAY_LABELS[i]}</span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium ${
                  hasSession
                    ? 'bg-accent text-bg'
                    : isFuture
                      ? 'bg-bg-surface text-ink-muted/40'
                      : isToday
                        ? 'border border-accent text-accent-light'
                        : 'bg-bg-surface text-ink-muted'
                }`}
              >
                {hasSession ? '✓' : new Date(`${date}T00:00:00Z`).getUTCDate()}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-accent">Sessions this week</h2>
        {thisWeeksEntries.length === 0 ? (
          <p className="mt-1.5 text-sm text-ink-muted">Nothing logged yet this week.</p>
        ) : (
          <ul className="mt-1.5 space-y-2">
            {thisWeeksEntries.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-bg-surface px-3 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{entry.dayName}</span>
                  <span className="text-xs text-ink-muted">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  {entry.programName}
                  {entry.weekNumber != null ? ` · Week ${entry.weekNumber}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
