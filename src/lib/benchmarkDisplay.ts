import { findStage } from './loadData'
import { formatValue } from './prFormat'
import type { Movement } from '../types/movement'
import type { PREntry } from '../types/pr'
import type { BenchmarkMovementFill, BenchmarkWod } from '../types/benchmark'
import type { TimerConfig } from '../types/timer'

// Reuses the exact TimerConfig shapes the Timer feature already supports —
// "for time" is an open-ended stopwatch, AMRAP needs the benchmark's own
// durationSeconds (format is free text like "20 min AMRAP" and isn't safely
// parseable back into a number).
export function timerConfigForBenchmark(benchmark: BenchmarkWod): TimerConfig {
  if (benchmark.scoreType === 'rounds_and_reps') {
    return { type: 'amrap', durationSeconds: benchmark.durationSeconds ?? 1200 }
  }
  return { type: 'stopwatch' }
}

export function movementFillLabel(fill: BenchmarkMovementFill, movement: Movement | undefined): string {
  const name = movement?.name ?? fill.movementId
  const stage = fill.stageId ? findStage(movement, fill.stageId) : undefined
  return stage ? `${name} (${stage.name})` : name
}

export function relativeTimeAgo(dateStr: string): string {
  const then = new Date(`${dateStr}T00:00:00Z`).getTime()
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

// entries should already be this benchmark's PR history
export function lastResultLabel(entries: PREntry[]): string | null {
  if (entries.length === 0) return null
  const mostRecent = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0]
  const label = mostRecent.metricType === 'rounds_and_reps' ? 'Last score' : 'Last time'
  return `${label}: ${formatValue(mostRecent.metricType, mostRecent.value, mostRecent.unit)}, ${relativeTimeAgo(mostRecent.date)}`
}
