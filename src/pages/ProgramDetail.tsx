import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ActiveDayCard from '../components/ActiveDayCard'
import BackLink from '../components/BackLink'
import OneRepMaxForm from '../components/OneRepMaxForm'
import ProgramBlockRow from '../components/ProgramBlockRow'
import { CheckCircleIcon, WarningIcon } from '../components/icons'
import { buildMovementIndex, loadMovements, loadPrograms } from '../lib/loadData'
import { isLastDayOf } from '../lib/programProgress'
import { resolveLoadContext } from '../lib/trainingMax'
import { useActiveProgram } from '../lib/useActiveProgram'
import { useProgramHistory } from '../lib/useProgramHistory'
import { useTrainingMax } from '../lib/useTrainingMax'
import type { Movement } from '../types/movement'
import type { Program } from '../types/program'

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  // present only when arriving from the program-recommendation quiz's
  // "View program" link — carried into the Coach's Brief on day 1
  const quizReason = searchParams.get('quizReason') ?? undefined
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { pointer, startProgram, stopProgram } = useActiveProgram()
  const { isCompleted, completedAt } = useProgramHistory()
  const { dataFor } = useTrainingMax()
  const [showOneRepMaxForm, setShowOneRepMaxForm] = useState(false)

  const isActive = pointer?.programId === id
  const [openWeek, setOpenWeek] = useState<number | null>(isActive ? pointer!.weekNumber : 1)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

  function toggleDay(weekNumber: number, dayNumber: number) {
    const key = `${weekNumber}-${dayNumber}`
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  useEffect(() => {
    loadPrograms().then(setPrograms)
    loadMovements().then(setMovements)
  }, [])

  useEffect(() => {
    if (isActive) setOpenWeek(pointer!.weekNumber)
  }, [isActive, pointer])

  const movementIndex = useMemo(
    () => (movements ? buildMovementIndex(movements) : null),
    [movements],
  )
  const program = programs?.find((p) => p.id === id)

  if (!programs || !movementIndex) {
    return <p className="mt-4 text-ink-muted">Loading…</p>
  }

  if (!program) {
    return (
      <div>
        <p className="text-ink-muted">Program not found.</p>
        <Link to="/programs" className="mt-2 inline-block text-accent-light underline">
          Back to Programs
        </Link>
      </div>
    )
  }

  const trainingMaxData = dataFor(program.id)

  return (
    <div>
      <BackLink to="/programs" label="Programs" />

      <h1 className="mt-2 text-2xl font-semibold">{program.name}</h1>
      <p className="mt-1 text-xs text-ink-muted">
        {program.level} · {program.durationWeeks} weeks · {program.daysPerWeek} days/week
      </p>
      {isCompleted(program.id) && (
        <p className="mt-1 flex items-center gap-1 text-xs text-accent-light">
          <CheckCircleIcon className="h-3.5 w-3.5" strokeWidth={2} /> Completed{' '}
          {new Date(completedAt(program.id)!).toLocaleDateString()}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed">{program.description}</p>

      {program.safetyNote && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <WarningIcon className="h-3.5 w-3.5" strokeWidth={2} /> Before you start
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-100/90">{program.safetyNote}</p>
        </div>
      )}

      {isActive ? (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-accent/15 px-3 py-2.5 text-sm">
          <span className="font-medium text-accent-light">
            Active — Week {pointer!.weekNumber}, Day {pointer!.dayNumber}
          </span>
          <button onClick={stopProgram} className="text-xs text-ink-muted underline">
            Stop
          </button>
        </div>
      ) : showOneRepMaxForm && program.requiresInput ? (
        <div className="mt-4">
          <OneRepMaxForm
            programId={program.id}
            movementIds={program.requiresInput.oneRepMaxInputs}
            movementIndex={movementIndex}
            onDone={() => {
              startProgram(program.id, quizReason)
              setShowOneRepMaxForm(false)
            }}
            onCancel={() => setShowOneRepMaxForm(false)}
          />
        </div>
      ) : (
        <button
          onClick={() =>
            program.requiresInput ? setShowOneRepMaxForm(true) : startProgram(program.id, quizReason)
          }
          className="mt-4 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg"
        >
          {isCompleted(program.id) ? 'Start again' : 'Start this program'}
        </button>
      )}

      <div className="mt-4 space-y-2">
        {program.weeks.map((week) => {
          const isOpen = openWeek === week.weekNumber
          return (
            <div key={week.weekNumber} className="rounded-xl bg-bg-surface">
              <button
                onClick={() => setOpenWeek(isOpen ? null : week.weekNumber)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium">
                  Week {week.weekNumber} — {week.focus}
                </span>
                <span className="ml-2 shrink-0 text-ink-muted">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="space-y-3 px-4 pb-4">
                  {week.days.map((day) => {
                    const isCurrentDay =
                      isActive &&
                      pointer!.weekNumber === week.weekNumber &&
                      pointer!.dayNumber === day.dayNumber
                    const isFinalDay = isLastDayOf(program, week.weekNumber, day.dayNumber)

                    if (isCurrentDay) {
                      return (
                        <div key={day.dayNumber}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                              {day.name}
                            </h3>
                            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent-light">
                              You are here
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <ActiveDayCard
                              program={program}
                              week={week}
                              day={day}
                              movementIndex={movementIndex}
                              isFinalDay={isFinalDay}
                            />
                          </div>
                        </div>
                      )
                    }

                    // Non-active days default collapsed to a one-line summary —
                    // otherwise every day in an open week (up to 5 days x 8
                    // blocks for 5/3/1) dumps its full prescription list inline
                    // regardless of whether it's relevant to today.
                    const dayKey = `${week.weekNumber}-${day.dayNumber}`
                    const isDayExpanded = expandedDays.has(dayKey)
                    return (
                      <div key={day.dayNumber} className="rounded-lg bg-bg-raised">
                        <button
                          onClick={() => toggleDay(week.weekNumber, day.dayNumber)}
                          className="flex w-full items-center justify-between px-3 py-2.5 text-left"
                          aria-expanded={isDayExpanded}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                            {day.name}
                          </span>
                          <span className="flex shrink-0 items-center gap-2 text-xs text-ink-muted">
                            {day.blocks.length} exercise{day.blocks.length === 1 ? '' : 's'}
                            <span>{isDayExpanded ? '▲' : '▼'}</span>
                          </span>
                        </button>
                        {isDayExpanded && (
                          <ul className="space-y-1.5 px-3 pb-3">
                            {day.blocks.map((block, i) => (
                              <ProgramBlockRow
                                key={i}
                                block={block}
                                index={movementIndex}
                                loadContext={
                                  trainingMaxData
                                    ? resolveLoadContext(trainingMaxData, week.weekNumber, program)
                                    : null
                                }
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
