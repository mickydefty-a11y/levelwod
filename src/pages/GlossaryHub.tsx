import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BackLink from '../components/BackLink'
import { GLOSSARY, GLOSSARY_MOVEMENT_LINKS } from '../lib/glossaryData'

export default function GlossaryHub() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return GLOSSARY

    return GLOSSARY.map((group) => ({
      ...group,
      terms: group.terms.filter(
        (t) => t.term.toLowerCase().includes(query) || t.full.toLowerCase().includes(query),
      ),
    })).filter((group) => group.terms.length > 0)
  }, [search])

  return (
    <div>
      <BackLink to="/progress" label="Progress" />

      <h1 className="mt-2 text-2xl font-semibold">Glossary</h1>
      <p className="mt-1 text-sm text-ink-muted">
        The acronyms and jargon of CrossFit, explained in plain English.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search terms…"
        className="mt-4 w-full rounded-lg bg-bg-surface px-3 py-2 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">No terms match "{search}".</p>
      ) : (
        <div className="mt-4 space-y-5">
          {filtered.map((group) => (
            <section key={group.category}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
                {group.category}
              </h2>
              <ul className="mt-1.5 space-y-1.5">
                {group.terms.map((t) => {
                  const movementId = GLOSSARY_MOVEMENT_LINKS[t.term]
                  return (
                    <li key={t.term} className="rounded-lg bg-bg-surface p-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold">{t.term}</span>
                        <span className="shrink-0 text-xs text-accent-light">{t.full}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{t.definition}</p>
                      {movementId && (
                        <Link
                          to={`/library/${movementId}`}
                          className="mt-1.5 inline-block text-xs text-accent-light underline"
                        >
                          View in Library →
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
