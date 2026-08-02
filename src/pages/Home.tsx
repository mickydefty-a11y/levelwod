import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import ActiveDayCard from '../components/ActiveDayCard'
import { buildMovementIndex, loadMovements, loadPrograms } from '../lib/loadData'
import { isLastDayOf } from '../lib/programProgress'
import { getMovementsAtOrAboveRX, getCurrentStreak, getThisWeekSessionCount } from '../lib/streakStats'
import { getReadyToTry } from '../lib/suggestions'
import { useActiveProgram } from '../lib/useActiveProgram'
import { useBodyweightProfile } from '../lib/useBodyweightProfile'
import { useProgramHistory } from '../lib/useProgramHistory'
import { useProgress } from '../lib/useProgress'
import { useTodaysWod } from '../lib/useTodaysWod'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import { wodSummary } from '../lib/wodDisplay'
import type { Movement } from '../types/movement'
import type { Program } from '../types/program'

export default function Home() {
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { pointer } = useActiveProgram()
  const { progress } = useProgress()
  const { completed } = useProgramHistory()
  const { profile } = useBodyweightProfile()
  const { log } = useWorkoutLog()
  const [showBreathingOffer, setShowBreathingOffer] = useState(false)
  const todaysWod = useTodaysWod()

  useEffect(() => {
    loadPrograms().then(setPrograms)
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = useMemo(
    () => (movements ? buildMovementIndex(movements) : null),
    [movements],
  )

  const dayStreak = getCurrentStreak(log)
  const skillsUnlocked = movements ? getMovementsAtOrAboveRX(movements, progress) : 0
  const thisWeekCount = getThisWeekSessionCount(log)

  if (!profile.onboardingCompletedAt) {
    return <Navigate to="/onboarding" replace />
  }

  if (!programs || !movementIndex) {
    return <p className="mt-4 text-ink-muted">Loading…</p>
  }

  const program = pointer ? programs.find((p) => p.id === pointer.programId) : undefined
  const week = program?.weeks.find((w) => w.weekNumber === pointer?.weekNumber)
  const day = week?.days.find((d) => d.dayNumber === pointer?.dayNumber)
  const isFinalDay = !!(program && week && day && isLastDayOf(program, week.weekNumber, day.dayNumber))

  const recentlyCompleted = [...completed]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .map((c) => ({ ...c, program: programs.find((p) => p.id === c.programId) }))
    .filter((c) => c.program)

  const readyToTry = movements ? getReadyToTry(movements, progress) : []

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">LevelWOD</h1>
        <Link
          to="/welcome"
          aria-label="How this app works"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-surface text-sm text-ink-muted"
        >
          ?
        </Link>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-xl bg-bg-surface p-3">
          <p className="text-xs text-ink-muted">Day streak</p>
          <p className="mt-1 text-xl font-semibold">{dayStreak}</p>
        </div>
        <div className="flex-1 rounded-xl bg-bg-surface p-3">
          <p className="text-xs text-ink-muted">Skills unlocked</p>
          <p className="mt-1 text-xl font-semibold">{skillsUnlocked}</p>
        </div>
      </div>

      {!program || !week || !day ? (
        <div className="mt-4 rounded-xl bg-bg-surface p-4">
          <p className="text-sm text-ink-muted">
            You're not following a program yet. Pick one to see today's session here.
          </p>
          <Link
            to="/programs"
            className="mt-3 inline-block rounded-lg bg-accent px-3 py-2 text-sm font-medium text-bg"
          >
            Browse programs
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-accent">{program.name}</h2>
            <Link to={`/programs/${program.id}`} className="text-xs text-ink-muted underline">
              Full program
            </Link>
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">
            Week {week.weekNumber} · {day.name}
            {isFinalDay && ' · Final day 🏁'}
          </p>
          <p className="mt-0.5 text-xs text-ink-muted">
            This week: {thisWeekCount} of {program.daysPerWeek}
          </p>

          <div className="mt-3">
            <ActiveDayCard
              program={program}
              week={week}
              day={day}
              movementIndex={movementIndex}
              isFinalDay={isFinalDay}
              onCompleted={() => setShowBreathingOffer(true)}
            />
          </div>
        </div>
      )}

      <Link
        to="/wod"
        className="mt-4 flex items-center justify-between rounded-xl bg-bg-surface p-4 hover:bg-bg-raised"
      >
        <div>
          <p className="text-sm font-medium">Today's WOD</p>
          <p className="mt-0.5 text-xs text-ink-muted">{wodSummary(todaysWod, movementIndex)}</p>
        </div>
        <span className="text-ink-muted">→</span>
      </Link>

      {showBreathingOffer && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-bg-surface p-4">
          <div>
            <p className="text-sm font-medium">Nice work.</p>
            <p className="mt-0.5 text-xs text-ink-muted">Want to cool down with some breathing?</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/breathing"
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg"
            >
              Let's go
            </Link>
            <button
              onClick={() => setShowBreathingOffer(false)}
              aria-label="Dismiss"
              className="text-xs text-ink-muted underline"
            >
              No thanks
            </button>
          </div>
        </div>
      )}

      <Link
        to="/breathing"
        className="mt-4 flex items-center justify-between rounded-xl bg-bg-surface p-4 hover:bg-bg-raised"
      >
        <div>
          <p className="text-sm font-medium">Take 5 minutes</p>
          <p className="mt-0.5 text-xs text-ink-muted">Guided breathing for a cooldown or reset.</p>
        </div>
        <span className="text-ink-muted">→</span>
      </Link>

      {readyToTry.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-accent">Ready to try next</h2>
          <p className="mt-0.5 text-xs text-ink-muted">
            You've made progress on everything these need first.
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {readyToTry.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/library/${m.id}`}
                  className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2 hover:bg-bg-raised"
                >
                  <span className="text-sm">{m.name}</span>
                  <span className="text-xs text-ink-muted">{m.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentlyCompleted.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-accent">Completed programs</h2>
          <ul className="mt-1.5 space-y-1.5">
            {recentlyCompleted.map((c) => (
              <li
                key={c.programId}
                className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2 text-sm"
              >
                <Link to={`/programs/${c.programId}`}>{c.program!.name}</Link>
                <span className="text-xs text-ink-muted">
                  {new Date(c.completedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
