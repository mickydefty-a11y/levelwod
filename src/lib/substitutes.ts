import type { Movement } from '../types/movement'
import type { SubstituteSuggestion } from '../types/substitution'

// Tier 2: automatic fallback for movements without a curated substitutes
// list. Same category+subcategory only (never crosses training intent),
// excludes composites (they gate on requiredMovements, not prerequisites,
// so they'd misleadingly sort as "easy"), ordered toward more accessible
// options first — fewer equipment requirements, then fewer prerequisites.
export function getFallbackSubstitutes(
  movement: Movement,
  allMovements: Movement[],
  limit = 3,
): Movement[] {
  const candidates = allMovements.filter(
    (m) =>
      m.id !== movement.id &&
      m.category === movement.category &&
      m.subcategory === movement.subcategory &&
      m.type !== 'composite' &&
      // a candidate that requires this movement as a prerequisite is a
      // harder version, not an alternative — e.g. Rope Climb needs Pull-Up
      !m.prerequisites.includes(movement.id),
  )

  candidates.sort((a, b) => {
    if (a.equipment.length !== b.equipment.length) return a.equipment.length - b.equipment.length
    return a.prerequisites.length - b.prerequisites.length
  })

  return candidates.slice(0, limit)
}

// Curated (Tier 1) suggestions take priority; only fall back to automatic
// matching when a movement has no curated list, or it doesn't fill the limit.
export function getSubstituteSuggestions(
  movement: Movement,
  allMovements: Movement[],
  limit = 3,
): SubstituteSuggestion[] {
  const curated: SubstituteSuggestion[] = (movement.suggestedSubstitutes ?? [])
    .filter((s) => allMovements.some((m) => m.id === s.movementId))
    .slice(0, limit)
    .map((s) => ({ movementId: s.movementId, reason: s.reason, tier: 'curated' }))

  if (curated.length >= limit) return curated

  const curatedIds = new Set(curated.map((s) => s.movementId))
  const fallback = getFallbackSubstitutes(movement, allMovements, limit - curated.length + curatedIds.size)
    .filter((m) => !curatedIds.has(m.id))
    .slice(0, limit - curated.length)
    .map((m): SubstituteSuggestion => ({ movementId: m.id, reason: null, tier: 'fallback' }))

  return [...curated, ...fallback]
}
