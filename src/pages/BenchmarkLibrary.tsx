import { useState } from 'react'
import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink'
import { lastResultLabel } from '../lib/benchmarkDisplay'
import { BENCHMARK_WODS } from '../lib/benchmarkWods'
import { usePRHistory } from '../lib/usePRHistory'
import type { WodCategory } from '../types/benchmark'

const ALL = 'All'
const BENCHMARK_CATEGORIES: (typeof ALL | WodCategory)[] = [ALL, 'Girl', 'Hero']

export default function BenchmarkLibrary() {
  const [benchmarkCategory, setBenchmarkCategory] = useState<typeof ALL | WodCategory>(ALL)
  const { historyFor } = usePRHistory()

  const filteredBenchmarks = BENCHMARK_WODS.filter(
    (b) => benchmarkCategory === ALL || b.wodCategory === benchmarkCategory,
  )

  return (
    <div>
      <BackLink to="/programs" label="Programs" />

      <h1 className="mt-2 text-2xl font-semibold">Benchmark WODs</h1>
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
  )
}
