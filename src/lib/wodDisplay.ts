import { findStage } from './loadData'
import type { Movement } from '../types/movement'
import type { WodDay, WodSlotTierFill } from '../types/wod'

export function wodFormatLabel(wod: WodDay): string {
  if (wod.format === 'amrap') return `AMRAP ${wod.durationMinutes}`
  if (wod.format === 'emom') return `EMOM ${wod.durationMinutes}`
  if (wod.format === 'forTime') return `For Time — ${wod.rounds} rounds`
  return 'Chipper'
}

export function tierFillLabel(fill: WodSlotTierFill, movement: Movement | undefined): string {
  const name = movement?.name ?? fill.movementId
  const stage = fill.stageId ? findStage(movement, fill.stageId) : undefined
  return stage ? `${name} (${stage.name})` : name
}

// One-line summary for the Home tile, e.g. "AMRAP 12 — Pull-ups, Wall Balls, Run"
export function wodSummary(wod: WodDay, movementIndex: Map<string, Movement>): string {
  const names = wod.slots.map((slot) => movementIndex.get(slot.tiers.rx.movementId)?.name ?? slot.tiers.rx.movementId)
  return `${wodFormatLabel(wod)} — ${names.join(', ')}`
}
