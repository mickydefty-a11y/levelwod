import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { lastResultLabel } from '../lib/benchmarkDisplay'
import { BENCHMARK_WODS } from '../lib/benchmarkWods'
import { loadPrograms } from '../lib/loadData'
import { usePRHistory } from '../lib/usePRHistory'
import { useProgramHistory } from '../lib/useProgramHistory'
import type { WodCategory } from '../types/benchmark'
import type { Program, ProgramCategory } from '../types/program'

const ALL = 'All'
const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced']
const BENCHMARK_CATEGORIES: (typeof ALL | WodCategory)[] = [ALL, 'Girl', 'Hero']

export default function Programs() {
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [level, setLevel] = useState(ALL)
  const [category, setCategory] = useState(ALL)
  const [benchmarkCategory, setBenchmarkCategory] = useState<typeof ALL | WodCategory>(ALL)
  const { isCompleted } = useProgramHistory()
  const { historyFor } = usePRHistory()

  useEffect(() => {
    loadPrograms().then(setPrograms)
  }, [])

  const levels = useMemo(() => {
    if (!programs) return []
    const present = new Set(programs.map((p) => p.level))
    return [ALL, ...LEVEL_ORDER.filter((l) => present.has(l))]
  }, [programs])

  const categories = useMemo((): string[] => {
    if (!programs) return []
    const present = new Set(programs.map((p) => p.category).filter((c): c is ProgramCategory => !!c))
    return [ALL, ...present]
  }, [programs])

  const filtered = useMemo(() => {
    if (!programs) return null
    return programs.filter((p) => {
      if (level !== ALL && p.level !== level) return false
      if (category !== ALL && p.category !== category) return false
      return true
    })
  }, [programs, level, category])

  const filtersActive = level !== ALL || category !== ALL

  const filteredBenchmarks = BENCHMARK_WODS.filter(
    (b) => benchmarkCategory === ALL || b.wodCategory === benchmarkCategory,
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold">Programs</h1>

      <div className="mt-3 space-y-2">
        <Link
          to="/programs/quiz"
          className="flex items-center justify-between rounded-xl bg-bg-surface p-3 text-sm"
        >
          <span className="font-medium">Not sure where to start?</span>
          <span className="text-xs text-accent-light">Take the quiz →</span>
        </Link>
        <Link
          to="/programs/compare"
          className="flex items-center justify-between rounded-xl bg-bg-surface p-3 text-sm"
        >
          <span className="font-medium">Want to compare everything?</span>
          <span className="text-xs text-accent-light">Filter &amp; sort →</span>
        </Link>
      </div>

      {programs && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                  category === c ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                }`}
              >
                {c === ALL ? 'All categories' : c}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                  level === l ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                }`}
              >
                {l === ALL ? 'All levels' : l}
              </button>
            ))}
          </div>

          {filtersActive && (
            <button
              onClick={() => {
                setLevel(ALL)
                setCategory(ALL)
              }}
              className="text-xs text-ink-muted underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {!filtered ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">No programs match your filters.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((program) => (
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
                {program.category && (
                  <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                    {program.category}
                  </span>
                )}
                <p className="mt-1.5 text-sm text-ink-muted">{program.description}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  {program.durationWeeks} weeks · {program.daysPerWeek} days/week
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Benchmark WODs</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Classic, named workouts worth repeating over time — not something you "start," just do again
          whenever you want to see how you've progressed.
        </p>

        <div className="mt-3 flex gap-1.5">
          {BENCHMARK_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setBenchmarkCategory(c)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                benchmarkCategory === c ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
              }`}
            >
              {c === ALL ? 'All' : `${c} WODs`}
            </button>
          ))}
        </div>

        <ul className="mt-3 space-y-2">
          {filteredBenchmarks.map((b) => {
            const lastResult = lastResultLabel(historyFor(b.id))
            return (
              <li key={b.id}>
                <Link
                  to={`/benchmarks/${b.id}`}
                  className="block rounded-xl bg-bg-surface p-4 hover:bg-bg-raised"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-medium">{b.name}</h3>
                    <span className="shrink-0 text-xs text-accent-light">{b.wodCategory} WOD</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{b.format}</p>
                  {lastResult && <p className="mt-1 text-xs text-accent-light">{lastResult}</p>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
