import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ActiveDayCard from '../components/ActiveDayCard'
import ProgramBlockRow from '../components/ProgramBlockRow'
import { buildMovementIndex, loadMovements, loadPrograms } from '../lib/loadData'
import { isLastDayOf } from '../lib/programProgress'
import { useActiveProgram } from '../lib/useActiveProgram'
import { useProgramHistory } from '../lib/useProgramHistory'
import type { Movement } from '../types/movement'
import type { Program } from '../types/program'

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>()
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { pointer, startProgram, stopProgram } = useActiveProgram()
  const { isCompleted, completedAt } = useProgramHistory()

  const isActive = pointer?.programId === id
  const [openWeek, setOpenWeek] = useState<number | null>(isActive ? pointer!.weekNumber : 1)

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
        <Link to="/programs" className="mt-2 inline-block text-coral-light underline">
          Back to Programs
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/programs" className="text-sm text-ink-muted">
        ← Programs
      </Link>

      <h1 className="mt-2 text-2xl font-semibold">{program.name}</h1>
      <p className="mt-1 text-xs text-ink-muted">
        {program.level} · {program.durationWeeks} weeks · {program.daysPerWeek} days/week
      </p>
      {isCompleted(program.id) && (
        <p className="mt-1 text-xs text-coral-light">
          🎉 Completed {new Date(completedAt(program.id)!).toLocaleDateString()}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed">{program.description}</p>

      {isActive ? (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-coral/15 px-3 py-2.5 text-sm">
          <span className="font-medium text-coral-light">
            Active — Week {pointer!.weekNumber}, Day {pointer!.dayNumber}
          </span>
          <button onClick={stopProgram} className="text-xs text-ink-muted underline">
            Stop
          </button>
        </div>
      ) : (
        <button
          onClick={() => startProgram(program.id)}
          className="mt-4 w-full rounded-lg bg-coral py-2.5 text-sm font-medium text-bg"
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
                    return (
                      <div key={day.dayNumber}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                            {day.name}
                          </h3>
                          {isCurrentDay && (
                            <span className="rounded-full bg-coral/20 px-2 py-0.5 text-[10px] font-medium text-coral-light">
                              You are here
                            </span>
                          )}
                        </div>
                        {isCurrentDay ? (
                          <div className="mt-1.5">
                            <ActiveDayCard
                              program={program}
                              week={week}
                              day={day}
                              movementIndex={movementIndex}
                              isFinalDay={isFinalDay}
                            />
                          </div>
                        ) : (
                          <ul className="mt-1.5 space-y-1.5">
                            {day.blocks.map((block, i) => (
                              <ProgramBlockRow key={i} block={block} index={movementIndex} />
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
