import type { LoadConfig, Program, TrainingMaxData, WeightUnit } from '../types/program'

const INCREMENT: Record<WeightUnit, number> = { kg: 2.5, lb: 5 }

export function roundDownToIncrement(value: number, unit: WeightUnit): number {
  const step = INCREMENT[unit]
  return Math.round((Math.floor(value / step) * step) * 100) / 100
}

export function roundToNearestIncrement(value: number, unit: WeightUnit): number {
  const step = INCREMENT[unit]
  return Math.round((Math.round(value / step) * step) * 100) / 100
}

// 5/3/1 trains off 90% of a true 1RM, not the 1RM itself — a small buffer
// so the prescribed lifts stay achievable week to week.
export function computeTrainingMax(oneRepMax: number, unit: WeightUnit): number {
  return roundDownToIncrement(oneRepMax * 0.9, unit)
}

// The Training Max only changes once, at the start of Wave 2 (week 5) —
// weeks 1-4 use the base Training Max as entered at program start.
export function trainingMaxForWeek(baseTrainingMax: number, weekNumber: number, increment: number): number {
  return weekNumber >= 5 ? baseTrainingMax + increment : baseTrainingMax
}

export function calculateLoadWeight(loadConfig: LoadConfig, trainingMax: number, unit: WeightUnit): number {
  return roundToNearestIncrement(trainingMax * (loadConfig.percentage / 100), unit)
}

// Resolves every lift's Training Max for a given week, applying each lift's
// own increment (if any) once the week is in wave 2 or later.
export function trainingMaxForWeekAllLifts(
  data: TrainingMaxData,
  weekNumber: number,
  program: Program,
): { trainingMax: Record<string, number>; unit: WeightUnit } {
  const trainingMax: Record<string, number> = {}
  for (const [movementId, base] of Object.entries(data.trainingMax)) {
    const increment = program.trainingMaxIncrementsPerCycle?.[movementId]?.[data.unit] ?? 0
    trainingMax[movementId] = trainingMaxForWeek(base, weekNumber, increment)
  }
  return { trainingMax, unit: data.unit }
}
