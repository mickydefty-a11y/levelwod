// Brzycki formula — well-established, single-formula rep-max estimator.
// Most reliable in the 1-10 rep range; the denominator hits zero at 37 reps
// and gets unreliable well before that, hence the hard cap at 10.
const BRZYCKI_BASE = 1.0278
const BRZYCKI_SLOPE = 0.0278

export const MAX_REPS = 10

export function estimateOneRepMax(weight: number, reps: number): number {
  return weight / (BRZYCKI_BASE - BRZYCKI_SLOPE * reps)
}

// Same formula rearranged — gives the estimated weight for any rep count
// once the 1RM is known, which is how a single input generates the whole
// table rather than needing a separate "reps -> weight" mode.
export function estimateWeightForReps(oneRepMax: number, reps: number): number {
  return oneRepMax * (BRZYCKI_BASE - BRZYCKI_SLOPE * reps)
}

export interface RepMaxRow {
  reps: number
  weight: number
}

// Rounds to the nearest 0.5kg or 1lb — nobody's loading a bar to 58.073kg.
export function roundEstimate(weight: number, unit: 'kg' | 'lb'): number {
  const increment = unit === 'kg' ? 0.5 : 1
  return Math.round(weight / increment) * increment
}

export function generateRepMaxTable(oneRepMax: number, unit: 'kg' | 'lb'): RepMaxRow[] {
  const rows: RepMaxRow[] = []
  for (let reps = 1; reps <= MAX_REPS; reps++) {
    rows.push({ reps, weight: roundEstimate(estimateWeightForReps(oneRepMax, reps), unit) })
  }
  return rows
}

// "Loadable strength movements" per the spec — classic barbell lifts people
// actually test/track a 1RM for. Deliberately excludes strongman/odd-object
// and metcon-style movements (farmer carry, sandbag work, thruster, etc.),
// which aren't expressed as a clean 1RM the same way.
export const LOADABLE_STRENGTH_MOVEMENT_IDS = [
  'back-squat',
  'front-squat',
  'overhead-squat',
  'deadlift',
  'bench-press',
  'strict-press',
  'push-press',
  'push-jerk',
  'split-jerk',
  'clean',
  'power-clean',
  'hang-clean',
  'snatch',
  'power-snatch',
  'hang-snatch',
  'muscle-snatch',
  'snatch-balance',
  'clean-and-jerk',
]

// Movements where the Brzycki relationship holds least well — skill and bar
// speed under fatigue matter as much as raw strength, so the UI should
// surface a caveat rather than presenting the estimate with full confidence.
const TECHNICAL_LIFT_IDS = new Set([
  'snatch',
  'power-snatch',
  'hang-snatch',
  'muscle-snatch',
  'snatch-balance',
  'clean',
  'power-clean',
  'hang-clean',
  'clean-and-jerk',
])

export function isTechnicalLift(movementId: string): boolean {
  return TECHNICAL_LIFT_IDS.has(movementId)
}
