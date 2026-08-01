export type MetricType = 'weight' | 'time' | 'reps' | 'holdTime' | 'distance'

export const METRIC_LABELS: Record<MetricType, string> = {
  weight: 'Weight',
  time: 'Time',
  reps: 'Reps',
  holdTime: 'Hold Time',
  distance: 'Distance',
}

// Lower is better for race-style times; everything else, higher is better.
export const METRIC_LOWER_IS_BETTER: Record<MetricType, boolean> = {
  weight: false,
  time: true,
  reps: false,
  holdTime: false,
  distance: false,
}

export const METRIC_UNITS: Record<MetricType, string[]> = {
  weight: ['kg', 'lb'],
  time: ['sec'],
  reps: ['reps'],
  holdTime: ['sec'],
  distance: ['m', 'ft'],
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
