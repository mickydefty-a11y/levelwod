import { STRENGTH_STANDARDS } from './strengthStandardsData'
import { STRENGTH_TIERS } from '../types/strengthStandards'
import type { Gender, StrengthClassification, TierThresholds } from '../types/strengthStandards'

export const STANDARDS_MOVEMENT_IDS = Object.keys(STRENGTH_STANDARDS)

export function hasStandardsFor(movementId: string): boolean {
  return movementId in STRENGTH_STANDARDS
}

export function thresholdsFor(movementId: string, gender: Gender): TierThresholds | null {
  return STRENGTH_STANDARDS[movementId]?.[gender] ?? null
}

export function classifyStrength(
  movementId: string,
  oneRepMax: number,
  bodyweight: number,
  gender: Gender,
): StrengthClassification | null {
  const thresholds = STRENGTH_STANDARDS[movementId]?.[gender]
  if (!thresholds || bodyweight <= 0) return null

  const ratio = oneRepMax / bodyweight

  // Highest tier whose threshold the ratio still meets or exceeds; null
  // (below Beginner) if it doesn't clear even the lowest bar.
  let tier: StrengthClassification['tier'] = null
  for (const t of STRENGTH_TIERS) {
    if (ratio >= thresholds[t]) tier = t
  }

  return { ratio, tier }
}
