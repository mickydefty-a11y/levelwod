import { METRIC_LOWER_IS_BETTER } from '../types/pr'
import type { MetricType, PREntry } from '../types/pr'

export function isTimeMetric(metricType: MetricType): boolean {
  return metricType === 'time' || metricType === 'holdTime'
}

// rounds_and_reps is a compound AMRAP score, encoded into PREntry's single
// numeric `value` as rounds + reps/1000 (reps into the next round is always
// well under 1000) — this keeps rounds_and_reps directly comparable via
// plain numeric comparison (more rounds always wins; equal rounds, more
// reps wins) without widening PREntry's shape for one metric type.
export function encodeRoundsAndReps(rounds: number, reps: number): number {
  return rounds + reps / 1000
}

export function formatRoundsAndReps(value: number): string {
  const rounds = Math.floor(value)
  const reps = Math.round((value - rounds) * 1000)
  const roundsLabel = `${rounds} round${rounds === 1 ? '' : 's'}`
  return reps > 0 ? `${roundsLabel} + ${reps} rep${reps === 1 ? '' : 's'}` : roundsLabel
}

export function formatSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

// Accepts "mm:ss" or a bare number of seconds.
export function parseSeconds(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (trimmed.includes(':')) {
    const [m, s] = trimmed.split(':')
    const minutes = Number(m)
    const seconds = Number(s)
    if (Number.isNaN(minutes) || Number.isNaN(seconds)) return null
    return minutes * 60 + seconds
  }
  const n = Number(trimmed)
  return Number.isNaN(n) ? null : n
}

export function formatValue(metricType: MetricType, value: number, unit: string): string {
  if (isTimeMetric(metricType)) return formatSeconds(value)
  if (metricType === 'rounds_and_reps') return formatRoundsAndReps(value)
  return `${value} ${unit}`
}

export function bestEntry(entries: PREntry[]): PREntry | null {
  if (entries.length === 0) return null
  const lowerIsBetter = METRIC_LOWER_IS_BETTER[entries[0].metricType]
  return entries.reduce((best, e) =>
    lowerIsBetter ? (e.value < best.value ? e : best) : e.value > best.value ? e : best,
  )
}
