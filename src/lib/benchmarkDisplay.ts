import { findStage } from './loadData'
import { formatSeconds } from './prFormat'
import type { Movement } from '../types/movement'
import type { PREntry } from '../types/pr'
import type { BenchmarkMovementFill } from '../types/benchmark'

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

// entries should already be this benchmark's PR history (metric type: time)
export function lastResultLabel(entries: PREntry[]): string | null {
  if (entries.length === 0) return null
  const mostRecent = [...entries].sort((a, b) => b.date.localeCompare(a.date))[0]
  return `Last time: ${formatSeconds(mostRecent.value)}, ${relativeTimeAgo(mostRecent.date)}`
}
