import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LEVEL_ORDER } from '../lib/levels'
import { loadMovements } from '../lib/loadData'
import { useSubstitutions } from '../lib/useSubstitutions'
import type { Movement } from '../types/movement'

function groupByCategory(movements: Movement[]) {
  const groups = new Map<string, Map<string, Movement[]>>()
  for (const movement of movements) {
    if (!groups.has(movement.category)) groups.set(movement.category, new Map())
    const subgroups = groups.get(movement.category)!
    if (!subgroups.has(movement.subcategory)) subgroups.set(movement.subcategory, [])
    subgroups.get(movement.subcategory)!.push(movement)
  }
  return groups
}

function movementHasLevel(movement: Movement, level: string): boolean {
  if (movement.type === 'progression') return movement.stages?.some((s) => s.level === level) ?? false
  if (movement.type === 'tutorial') return movement.scaling?.some((s) => s.level === level) ?? false
  return false
}

const typeBadge: Record<Movement['type'], string> = {
  progression: 'bg-accent/20 text-accent-light',
  tutorial: 'bg-white/10 text-ink-muted',
  composite: 'bg-white/20 text-ink',
}

const ALL = 'All'

export default function Library() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL)
  const [level, setLevel] = useState(ALL)
  const [bodyweightOnly, setBodyweightOnly] = useState(false)
  const { choiceFor } = useSubstitutions()

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const byId = useMemo(() => {
    const map = new Map<string, Movement>()
    for (const m of movements ?? []) map.set(m.id, m)
    return map
  }, [movements])

  const categories = useMemo(() => {
    if (!movements) return []
    return [ALL, ...new Set(movements.map((m) => m.category))]
  }, [movements])

  const filtered = useMemo(() => {
    if (!movements) return null
    const query = search.trim().toLowerCase()
    return movements.filter((m) => {
      if (category !== ALL && m.category !== category) return false
      if (level !== ALL && !movementHasLevel(m, level)) return false
      if (bodyweightOnly && m.equipment.length > 0) return false
      if (query && !`${m.name} ${m.category} ${m.subcategory}`.toLowerCase().includes(query))
        return false
      return true
    })
  }, [movements, search, category, level, bodyweightOnly])

  const grouped = useMemo(() => (filtered ? groupByCategory(filtered) : null), [filtered])

  const filtersActive = category !== ALL || level !== ALL || bodyweightOnly || search.trim() !== ''

  function clearFilters() {
    setSearch('')
    setCategory(ALL)
    setLevel(ALL)
    setBodyweightOnly(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Library</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search movements…"
        className="mt-4 w-full rounded-lg bg-bg-surface px-3 py-2 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {movements && (
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
            {[ALL, ...LEVEL_ORDER].map((l) => (
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
            <button
              onClick={() => setBodyweightOnly((v) => !v)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                bodyweightOnly ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
              }`}
            >
              Bodyweight only
            </button>
          </div>

          {filtersActive && (
            <button onClick={clearFilters} className="text-xs text-ink-muted underline">
              Clear filters
            </button>
          )}
        </div>
      )}

      {!grouped ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : grouped.size === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">No movements match your filters.</p>
      ) : (
        <div className="mt-4 space-y-6">
          {[...grouped.entries()].map(([cat, subgroups]) => (
            <section key={cat}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">{cat}</h2>
              <div className="mt-2 space-y-4">
                {[...subgroups.entries()].map(([subcategory, items]) => (
                  <div key={subcategory}>
                    <h3 className="text-xs font-medium text-ink-muted">{subcategory}</h3>
                    <ul className="mt-1.5 space-y-1.5">
                      {items.map((movement) => {
                        const choice = choiceFor(movement.id)
                        const ongoingSub =
                          choice?.scope === 'ongoing' ? byId.get(choice.substitutedWith) : null
                        return (
                          <li key={movement.id}>
                            <Link
                              to={`/library/${movement.id}`}
                              className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2 hover:bg-bg-raised"
                            >
                              <span className="text-sm">
                                {movement.name}
                                {ongoingSub && (
                                  <span className="block text-[10px] text-accent-light">
                                    Swapped for {ongoingSub.name}
                                  </span>
                                )}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeBadge[movement.type]}`}
                              >
                                {movement.type}
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
