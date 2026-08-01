export type AutoregulationNudgeType = 'high-effort' | 'low-effort'

export interface AutoregulationNudge {
  type: AutoregulationNudgeType
  message: string
}

const HIGH_EFFORT_MESSAGE =
  "Your last few sessions have rated high effort. Want to take it easier today, or press on?"
const LOW_EFFORT_MESSAGE =
  "You've had a few lighter sessions — today could be a good day to push a bit harder if you're feeling it."

const HIGH_EFFORT_WINDOW = 3
const HIGH_EFFORT_AVG_THRESHOLD = 8
const ALL_VERY_HIGH_THRESHOLD = 9
// "extended stretch" isn't given an exact number by the spec — using a
// deliberately longer window than the 3-session high-effort check so a
// couple of easy days doesn't trigger this one.
const LOW_EFFORT_WINDOW = 5
const LOW_EFFORT_AVG_THRESHOLD = 4

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

// rpeHistory: the person's logged RPE values, most-recent-first, with any
// skipped/unrated sessions already excluded by the caller — a gap in
// ratings is simply absent from this list, never a zero, and never breaks
// the trend calculation. High-effort is checked first (and wins if both
// conditions somehow apply) since it's the stronger, higher-priority signal.
export function detectAutoregulationNudge(rpeHistory: number[]): AutoregulationNudge | null {
  const lastThree = rpeHistory.slice(0, HIGH_EFFORT_WINDOW)
  if (lastThree.length === HIGH_EFFORT_WINDOW) {
    const allVeryHigh = lastThree.every((r) => r >= ALL_VERY_HIGH_THRESHOLD)
    if (average(lastThree) >= HIGH_EFFORT_AVG_THRESHOLD || allVeryHigh) {
      return { type: 'high-effort', message: HIGH_EFFORT_MESSAGE }
    }
  }

  const lastFive = rpeHistory.slice(0, LOW_EFFORT_WINDOW)
  if (lastFive.length === LOW_EFFORT_WINDOW && average(lastFive) <= LOW_EFFORT_AVG_THRESHOLD) {
    return { type: 'low-effort', message: LOW_EFFORT_MESSAGE }
  }

  return null
}
