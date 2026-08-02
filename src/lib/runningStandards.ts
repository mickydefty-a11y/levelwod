import { standardSecondsFor } from './runningStandardsData'
import { AGE_GRADE_BANDS } from '../types/runningStandards'
import type { AgeGradeResult, RunningDistance } from '../types/runningStandards'

// Age-graded % = standard time for this age/distance ÷ actual time. Gender
// isn't used by the calculation itself yet — in the real WMA tables the
// standard time is independently gender-specific, but this placeholder's
// standardSecondsFor() doesn't vary by gender (see runningStandardsData.ts).
// Kept as a parameter now so the UI/signature won't need to change once
// real gender-specific standards are wired in.
export function calculateAgeGrade(
  distance: RunningDistance,
  timeSeconds: number,
  age: number,
): AgeGradeResult | null {
  if (timeSeconds <= 0 || age <= 0) return null

  const standard = standardSecondsFor(distance, age)
  const percentage = (standard / timeSeconds) * 100

  let tier = AGE_GRADE_BANDS[0].tier
  for (const band of AGE_GRADE_BANDS) {
    if (percentage >= band.min) tier = band.tier
  }

  return { percentage: Math.round(percentage * 10) / 10, tier }
}
