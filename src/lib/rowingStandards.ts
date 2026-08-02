import { ROWING_STANDARDS } from './rowingStandardsData'
import type { Gender } from '../types/strengthStandards'
import type {
  RowingAgeCategory,
  RowingClassification,
  RowingPiece,
  WeightCategory,
} from '../types/rowingStandards'

export function referenceTimesFor(
  piece: RowingPiece,
  ageCategory: RowingAgeCategory,
  weightCategory: WeightCategory,
  gender: Gender,
) {
  return ROWING_STANDARDS[piece]?.[ageCategory]?.[weightCategory]?.[gender] ?? null
}

// Linear interpolation between the four known percentile anchor points.
// Time is lower-is-better, so a faster (lower) time than p90 clamps to 99,
// and a slower (higher) time than p25 clamps to 1 — we only have four real
// anchor points, so anything beyond them is an edge estimate, not a lookup.
export function classifyRowingTime(
  piece: RowingPiece,
  timeSeconds: number,
  ageCategory: RowingAgeCategory,
  weightCategory: WeightCategory,
  gender: Gender,
): RowingClassification | null {
  const reference = referenceTimesFor(piece, ageCategory, weightCategory, gender)
  if (!reference || timeSeconds <= 0) return null

  const points: [number, number][] = [
    [reference.p90, 90],
    [reference.p75, 75],
    [reference.p50, 50],
    [reference.p25, 25],
  ]

  let percentile: number
  if (timeSeconds <= reference.p90) {
    percentile = 99
  } else if (timeSeconds >= reference.p25) {
    percentile = 1
  } else {
    // Find the bracketing pair and interpolate.
    let lower = points[points.length - 1]
    let upper = points[0]
    for (let i = 0; i < points.length - 1; i++) {
      const [tFast] = points[i]
      const [tSlow] = points[i + 1]
      if (timeSeconds >= tFast && timeSeconds <= tSlow) {
        upper = points[i]
        lower = points[i + 1]
        break
      }
    }
    const [tSlow, pSlow] = lower
    const [tFast, pFast] = upper
    const frac = (timeSeconds - tFast) / (tSlow - tFast)
    percentile = pFast + frac * (pSlow - pFast)
  }

  return { percentile: Math.round(percentile), reference }
}
