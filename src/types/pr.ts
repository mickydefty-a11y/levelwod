export type MetricType = 'weight' | 'time' | 'reps' | 'holdTime' | 'distance' | 'rounds_and_reps'

export const METRIC_LABELS: Record<MetricType, string> = {
  weight: 'Weight',
  time: 'Time',
  reps: 'Reps',
  holdTime: 'Hold Time',
  distance: 'Distance',
  rounds_and_reps: 'Rounds + Reps',
}

// Lower is better for race-style times; everything else, higher is better.
export const METRIC_LOWER_IS_BETTER: Record<MetricType, boolean> = {
  weight: false,
  time: true,
  reps: false,
  holdTime: false,
  distance: false,
  rounds_and_reps: false,
}

export const METRIC_UNITS: Record<MetricType, string[]> = {
  weight: ['kg', 'lb'],
  time: ['sec'],
  reps: ['reps'],
  holdTime: ['sec'],
  distance: ['m', 'ft'],
  // display is custom-formatted (see formatRoundsAndReps) rather than a
  // plain "value unit" pairing, but PREntry still needs some unit string
  rounds_and_reps: ['rounds'],
}

export interface PREntry {
  id: string
  movementId: string
  metricType: MetricType
  value: number
  unit: string
  date: string
  programContext: string | null
  notes: string | null
}

export interface LogPrompt {
  metricType: MetricType
  suggestedLabel: string
}
