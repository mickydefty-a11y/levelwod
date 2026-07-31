import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadPrograms } from '../lib/loadData'
import { useProgramHistory } from '../lib/useProgramHistory'
import type { Program } from '../types/program'

export default function Programs() {
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const { isCompleted } = useProgramHistory()

  useEffect(() => {
    loadPrograms().then(setPrograms)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Programs</h1>
      {!programs ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {programs.map((program) => (
            <li key={program.id}>
              <Link
                to={`/programs/${program.id}`}
                className="block rounded-xl bg-bg-surface p-4 hover:bg-bg-raised"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-medium">{program.name}</h2>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {isCompleted(program.id) && <span className="text-xs">✅</span>}
                    <span className="text-xs text-accent-light">{program.level}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{program.description}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  {program.durationWeeks} weeks · {program.daysPerWeek} days/week
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
