import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import { loadPrograms } from '../lib/loadData'
import { filterPrograms, oneLineFocus, sortPrograms, SORT_OPTIONS } from '../lib/programComparison'
import { READINESS_CHECKS } from '../lib/programQuiz'
import type { SortOption } from '../lib/programComparison'
import type { Program, ProgramCategory } from '../types/program'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export default function ProgramComparisonView() {
  const [searchParams] = useSearchParams()
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [categories, setCategories] = useState<Set<ProgramCategory>>(new Set())
  const [levels, setLevels] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortOption>('alphabetical')

  useEffect(() => {
    loadPrograms().then(setPrograms)
  }, [])

  // Pre-filter from a quiz recommendation, e.g. /programs/compare?category=Hyrox&level=Intermediate
  useEffect(() => {
    const category = searchParams.get('category') as ProgramCategory | null
    const level = searchParams.get('level')
    if (category) setCategories(new Set([category]))
    if (level) setLevels(new Set([level]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const availableCategories = useMemo((): ProgramCategory[] => {
    if (!programs) return []
    const present = new Set(programs.map((p) => p.category).filter((c): c is ProgramCategory => !!c))
    return [...present]
  }, [programs])

  const results = useMemo(() => {
    if (!programs) return null
    return sortPrograms(filterPrograms(programs, categories, levels), sort)
  }, [programs, categories, levels, sort])

  const filtersActive = categories.size > 0 || levels.size > 0

  return (
    <div>
      <BackLink to="/programs" label="Programs" />

      <h1 className="mt-2 text-2xl font-semibold">Compare programs</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Filter and sort all {programs?.length ?? 15} programs to find the right fit.
      </p>

      <Link
        to="/programs/quiz"
        className="mt-3 flex items-center justify-between rounded-xl bg-bg-surface p-3 text-sm"
      >
        <span className="font-medium">Not sure which one?</span>
        <span className="text-xs text-accent-light">Take the quiz →</span>
      </Link>

      {programs && (
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-xs text-ink-muted">Category</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {availableCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategories(toggle(categories, c))}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    categories.has(c) ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-ink-muted">Level</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevels(toggle(levels, l))}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    levels.has(l) ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {filtersActive && (
            <button
              onClick={() => {
                setCategories(new Set())
                setLevels(new Set())
              }}
              className="text-xs text-ink-muted underline"
            >
              Clear filters
            </button>
          )}

          <div>
            <p className="text-xs text-ink-muted">Sort by</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    sort === s.id ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!results ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : results.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          No programs match — try adjusting filters.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {results.map((program) => (
            <li key={program.id}>
              <Link
                to={`/programs/${program.id}`}
                className="block rounded-xl bg-bg-surface p-4 hover:bg-bg-raised"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-medium">{program.name}</h2>
                  <span className="shrink-0 text-xs text-accent-light">{program.level}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {program.category && (
                    <span className="inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                      {program.category}
                    </span>
                  )}
                  {READINESS_CHECKS[program.id] && (
                    <span className="inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                      Assumes prior experience
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-ink-muted">{oneLineFocus(program.description)}</p>
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
