import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getSubstituteSuggestions } from '../lib/substitutes'
import { useSubstitutions } from '../lib/useSubstitutions'
import type { Movement } from '../types/movement'

export default function CantDoThis({
  movement,
  movementIndex,
}: {
  movement: Movement
  movementIndex: Map<string, Movement>
}) {
  const { choiceFor, setSubstitution, clearSubstitution } = useSubstitutions()
  const [expanded, setExpanded] = useState(false)

  const choice = choiceFor(movement.id)
  const substituteMovement = choice ? movementIndex.get(choice.substitutedWith) : null

  if (choice && substituteMovement) {
    return (
      <p className="mt-1.5 text-xs text-ink-muted">
        Substituting{' '}
        <Link to={`/library/${substituteMovement.id}`} className="text-accent-light underline">
          {substituteMovement.name}
        </Link>{' '}
        for {movement.name}
        {choice.scope === 'ongoing' ? ' · always' : ' · today only'}
        {' · '}
        <button onClick={() => clearSubstitution(movement.id)} className="underline">
          Undo
        </button>
      </p>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="mt-1.5 text-xs text-ink-muted underline decoration-dotted"
      >
        Can't do this?
      </button>
    )
  }

  const suggestions = getSubstituteSuggestions(movement, [...movementIndex.values()], 3)

  return (
    <div className="mt-1.5 rounded-lg bg-bg-raised p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">Try instead</span>
        <button onClick={() => setExpanded(false)} className="text-xs text-ink-muted underline">
          Close
        </button>
      </div>

      {suggestions.length === 0 ? (
        <p className="mt-1.5 text-xs text-ink-muted">No alternatives found for this movement yet.</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {suggestions.map((s) => {
            const sub = movementIndex.get(s.movementId)
            if (!sub) return null
            return (
              <li key={s.movementId} className="flex items-center justify-between gap-2">
                <span className="text-xs">
                  {sub.name}
                  {s.reason && <span className="block text-[10px] text-ink-muted">{s.reason}</span>}
                </span>
                <span className="flex shrink-0 gap-1">
                  <button
                    onClick={() => {
                      setSubstitution(movement.id, sub.id, 'today-only')
                      setExpanded(false)
                    }}
                    className="rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-bg"
                  >
                    Use today
                  </button>
                  <button
                    onClick={() => {
                      setSubstitution(movement.id, sub.id, 'ongoing')
                      setExpanded(false)
                    }}
                    className="rounded-full bg-bg-surface px-2 py-1 text-[10px] font-medium text-ink-muted"
                  >
                    Always
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
