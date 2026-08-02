export type Gender = 'male' | 'female'

export type StrengthTier = 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced' | 'Elite'

export const STRENGTH_TIERS: StrengthTier[] = [
  'Beginner',
  'Novice',
  'Intermediate',
  'Advanced',
  'Elite',
]

// Ratio = 1RM / bodyweight (same units). Ascending order, one threshold per tier.
export interface TierThresholds {
  Beginner: number
  Novice: number
  Intermediate: number
  Advanced: number
  Elite: number
}

export type StrengthStandardsTable = Record<string, Record<Gender, TierThresholds>>

export interface StrengthClassification {
  ratio: number
  tier: StrengthTier | null // null when below the Beginner threshold
}
