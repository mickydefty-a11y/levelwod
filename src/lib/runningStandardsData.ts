import type { RunningDistance } from '../types/runningStandards'

// ⚠️ PLACEHOLDER DATA — NOT SOURCED, NOT ACCURATE. ⚠️
//
// The real WMA (World Masters Athletics) age-grading system is a large,
// publicly available, empirically-derived dataset (compiled by Alan Jones,
// released under CC0) with an independent factor for every single
// age/gender/distance combination — it is NOT a simple formula. This file
// does not contain that dataset. Instead it uses a deliberately simplistic,
// clearly-labeled placeholder shape just to make the calculation pipeline
// and UI work end-to-end:
//   - one flat "open standard" time per distance, identical for both
//     genders (real WMA standards differ meaningfully by gender)
//   - a single linear age-factor curve (flat between ages 18-30, then a
//     flat +1%/year outside that band), identical for both genders and
//     every distance (the real tables are non-linear and event-specific)
//
// Before this ships for real, replace OPEN_STANDARD_SECONDS with real WMA
// standard times and ageFactor() with a proper lookup against the actual
// Alan Jones age-grading tables, cited in CITATION below.
export const CITATION: string | null = null // e.g. "WMA Age-Grading Tables (Alan Jones, CC0), https://www.howardgrubb.co.uk/athletics/wmalookup06.html"

const OPEN_STANDARD_SECONDS: Record<RunningDistance, number> = {
  mile: 3.75 * 60, // arbitrary flat "world-class-ish" placeholder pace
  '5k': 13 * 60,
  '10k': 27 * 60,
  'half-marathon': 60 * 60,
  marathon: 125 * 60,
}

const PEAK_AGE_MIN = 18
const PEAK_AGE_MAX = 30
const AGE_FACTOR_PER_YEAR = 0.01 // +1% standard time per year outside the peak band

export function ageFactor(age: number): number {
  if (age < PEAK_AGE_MIN) return 1 + (PEAK_AGE_MIN - age) * AGE_FACTOR_PER_YEAR
  if (age > PEAK_AGE_MAX) return 1 + (age - PEAK_AGE_MAX) * AGE_FACTOR_PER_YEAR
  return 1
}

export function standardSecondsFor(distance: RunningDistance, age: number): number {
  return OPEN_STANDARD_SECONDS[distance] * ageFactor(age)
}
