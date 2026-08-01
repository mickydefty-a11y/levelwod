import type { WodTier } from './wod'

export type WodCategory = 'Girl' | 'Hero'

export interface BenchmarkMovementFill {
  movementId: string
  stageId?: string
  loadNote?: string
}

export interface BenchmarkTier {
  movements: BenchmarkMovementFill[]
  // tier-specific guidance that doesn't belong to any single movement, e.g.
  // Murph's scaled-tier partitioning advice
  note?: string
}

export interface BenchmarkWod {
  id: string
  name: string
  wodCategory: WodCategory
  format: string
  repScheme?: string
  description: string
  // brief, respectful context — present on Hero WODs
  originNote?: string
  // Hero WODs that are specifically a memorial tribute get distinct UI
  // treatment for their origin note (currently just Murph)
  memorialTribute?: boolean
  tiers: Record<WodTier, BenchmarkTier>
}
