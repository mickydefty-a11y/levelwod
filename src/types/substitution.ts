export type SubstitutionScope = 'today-only' | 'ongoing'

export interface SubstitutionChoice {
  originalMovementId: string
  substitutedWith: string
  scope: SubstitutionScope
  // date the swap was made — used to expire a "today-only" scope once the
  // calendar date moves on
  date: string
}

export interface SubstituteSuggestion {
  movementId: string
  reason: string | null
  tier: 'curated' | 'fallback'
}
