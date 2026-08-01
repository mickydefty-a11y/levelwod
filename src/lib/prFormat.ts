import { METRIC_LOWER_IS_BETTER } from '../types/pr'
import type { MetricType, PREntry } from '../types/pr'

export function isTimeMetric(metricType: MetricType): boolean {
  return metricType === 'time' || metricType === 'holdTime'
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
  return `${value} ${unit}`
}

export function bestEntry(entries: PREntry[]): PREntry | null {
  if (entries.length === 0) return null
  const lowerIsBetter = METRIC_LOWER_IS_BETTER[entries[0].metricType]
  return entries.reduce((best, e) =>
    lowerIsBetter ? (e.value < best.value ? e : best) : e.value > best.value ? e : best,
  )
}
