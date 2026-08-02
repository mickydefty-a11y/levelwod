export type RunningDistance = 'mile' | '5k' | '10k' | 'half-marathon' | 'marathon'

export const RUNNING_DISTANCES: { id: RunningDistance; label: string; meters: number }[] = [
  { id: 'mile', label: 'Mile (1,609m)', meters: 1609 },
  { id: '5k', label: '5K', meters: 5000 },
  { id: '10k', label: '10K', meters: 10000 },
  { id: 'half-marathon', label: 'Half Marathon', meters: 21097 },
  { id: 'marathon', label: 'Marathon', meters: 42195 },
]

export type AgeGradeTier =
  | 'Recreational'
  | 'Recreational-strong'
  | 'Local/competitive class'
  | 'Regional/national class'
  | 'National/world class'

// Bands given directly in the spec — not placeholder, unlike the underlying
// age-grading factors used to compute the percentage itself.
export const AGE_GRADE_BANDS: { min: number; tier: AgeGradeTier }[] = [
  { min: 0, tier: 'Recreational' },
  { min: 50, tier: 'Recreational-strong' },
  { min: 65, tier: 'Local/competitive class' },
  { min: 75, tier: 'Regional/national class' },
  { min: 85, tier: 'National/world class' },
]

export interface AgeGradeResult {
  percentage: number
  tier: AgeGradeTier
}
