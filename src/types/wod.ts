export type WodFormat = 'amrap' | 'forTime' | 'emom' | 'chipper'
export type WodTier = 'rx' | 'intermediate' | 'scaled'

export interface WodSlotTierFill {
  movementId: string
  stageId?: string
  // reps, or a distance/calorie string for monostructural pieces (e.g. "400m")
  amount: number | string
  loadNote?: string
}

export interface WodSlot {
  subcategory: string
  tiers: Record<WodTier, WodSlotTierFill>
}

export interface WodDay {
  date: string
  format: WodFormat
  durationMinutes?: number
  rounds?: number
  slots: WodSlot[]
}
