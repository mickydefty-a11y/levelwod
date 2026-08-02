import type { Gender } from './strengthStandards'

export type WeightCategory = 'lightweight' | 'heavyweight'

// Matches Concept2's own ranking pieces.
export type RowingPiece = '500m' | '1k' | '2k' | '5k' | '6k' | '10k' | 'half-marathon' | 'marathon'

export const ROWING_PIECES: { id: RowingPiece; label: string; meters: number }[] = [
  { id: '500m', label: '500m', meters: 500 },
  { id: '1k', label: '1,000m', meters: 1000 },
  { id: '2k', label: '2,000m', meters: 2000 },
  { id: '5k', label: '5,000m', meters: 5000 },
  { id: '6k', label: '6,000m', meters: 6000 },
  { id: '10k', label: '10,000m', meters: 10000 },
  { id: 'half-marathon', label: 'Half Marathon (21,097m)', meters: 21097 },
  { id: 'marathon', label: 'Marathon (42,195m)', meters: 42195 },
]

// Concept2's own ranking age-category buckets.
export type RowingAgeCategory =
  | 'under-19'
  | '20-29'
  | '30-39'
  | '40-49'
  | '50-59'
  | '60-69'
  | '70-79'
  | '80-89'
  | '90-99'

export const ROWING_AGE_CATEGORIES: { id: RowingAgeCategory; label: string }[] = [
  { id: 'under-19', label: 'Under 19' },
  { id: '20-29', label: '20-29' },
  { id: '30-39', label: '30-39' },
  { id: '40-49', label: '40-49' },
  { id: '50-59', label: '50-59' },
  { id: '60-69', label: '60-69' },
  { id: '70-79', label: '70-79' },
  { id: '80-89', label: '80-89' },
  { id: '90-99', label: '90-99' },
]

// Reference times (seconds) for four percentile anchor points within one
// exact category (piece + age category + weight category + gender). Lower
// time = better, so p90 is the FASTEST time, p25 the slowest.
export interface RowingPercentileTimes {
  p90: number
  p75: number
  p50: number
  p25: number
}

export type RowingStandardsTable = Record<
  RowingPiece,
  Record<RowingAgeCategory, Record<WeightCategory, Record<Gender, RowingPercentileTimes>>>
>

export interface RowingClassification {
  percentile: number // interpolated/estimated, clamped to [1, 99]
  reference: RowingPercentileTimes
}
