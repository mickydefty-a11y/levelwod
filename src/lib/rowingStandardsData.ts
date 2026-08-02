import { ROWING_AGE_CATEGORIES, ROWING_PIECES } from '../types/rowingStandards'
import type { RowingPercentileTimes, RowingStandardsTable } from '../types/rowingStandards'

// ⚠️ PLACEHOLDER DATA — NOT SOURCED, NOT ACCURATE. ⚠️
//
// Concept2 runs a real, official online rankings tool with genuine logbook
// percentile times for every piece x age category x weight category x
// gender combination. This file does NOT contain that data — reproducing
// hundreds of specific-looking percentile times from memory would be worse
// than an obvious placeholder, since it would look authoritative without
// being real.
//
// Instead, every category below uses the exact same flat placeholder pace
// (a 2:00/500m split, scaled by distance) with the same four percentile
// multipliers applied uniformly — deliberately identical across every age
// category, weight category, and gender, so nothing here reads as if it
// were differentiated real data.
//
// Before this ships for real, replace this file with Concept2's actual
// published rankings data (concept2.com/rankings), cited in CITATION below.
export const CITATION: string | null = null // e.g. "Concept2 Online Rankings, https://log.concept2.com/rankings"

const PLACEHOLDER_500M_SPLIT_SECONDS = 120 // an arbitrary flat 2:00/500m pace

// Multipliers on the 50th-percentile time. Lower time = faster = better, so
// the 90th percentile is the fastest (lowest) time here.
const PERCENTILE_MULTIPLIERS = { p90: 0.9, p75: 0.95, p50: 1.0, p25: 1.08 }

function placeholderTimesFor(meters: number): RowingPercentileTimes {
  const p50 = (meters / 500) * PLACEHOLDER_500M_SPLIT_SECONDS
  return {
    p90: p50 * PERCENTILE_MULTIPLIERS.p90,
    p75: p50 * PERCENTILE_MULTIPLIERS.p75,
    p50: p50 * PERCENTILE_MULTIPLIERS.p50,
    p25: p50 * PERCENTILE_MULTIPLIERS.p25,
  }
}

export const ROWING_STANDARDS: RowingStandardsTable = Object.fromEntries(
  ROWING_PIECES.map(({ id, meters }) => [
    id,
    Object.fromEntries(
      ROWING_AGE_CATEGORIES.map(({ id: ageId }) => [
        ageId,
        {
          lightweight: {
            male: placeholderTimesFor(meters),
            female: placeholderTimesFor(meters),
          },
          heavyweight: {
            male: placeholderTimesFor(meters),
            female: placeholderTimesFor(meters),
          },
        },
      ]),
    ),
  ]),
) as RowingStandardsTable
