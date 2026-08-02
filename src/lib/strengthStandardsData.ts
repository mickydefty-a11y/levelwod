import type { StrengthStandardsTable } from '../types/strengthStandards'

// ⚠️ PLACEHOLDER DATA — NOT SOURCED, NOT ACCURATE. ⚠️
//
// These ratio thresholds are copied verbatim from the feature spec's
// illustrative example (which itself only sketched Back Squat, and only for
// a single generic case) and reused identically across every movement and
// both genders purely so the UI has real numbers to render during
// development. They do NOT represent real published strength standards, and
// deliberately do NOT differ by movement or by gender — inventing
// movement-specific or gender-specific numbers would be worse than reusing
// one obviously-generic placeholder, since it would look more credible than
// it is.
//
// Before this feature ships for real, replace this file with numbers
// sourced from a reputable published reference (e.g. ExRx.net strength
// standards, or Strength Level's aggregated lift data), cited by name in
// CITATION below, with real per-movement and per-gender values.
export const CITATION: string | null = null // e.g. "ExRx.net Strength Standards, https://exrx.net/Testing/WeightLifting/StrengthStandards"

const PLACEHOLDER_THRESHOLDS = {
  Beginner: 0.5,
  Novice: 0.75,
  Intermediate: 1.5,
  Advanced: 2.0,
  Elite: 2.5,
}

const MOVEMENT_IDS = ['back-squat', 'front-squat', 'deadlift', 'bench-press', 'strict-press']

export const STRENGTH_STANDARDS: StrengthStandardsTable = Object.fromEntries(
  MOVEMENT_IDS.map((id) => [
    id,
    {
      male: { ...PLACEHOLDER_THRESHOLDS },
      female: { ...PLACEHOLDER_THRESHOLDS },
    },
  ]),
)
