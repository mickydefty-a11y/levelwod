import { findStage } from './loadData'
import type { Movement } from '../types/movement'
import type { ScoreType } from '../types/scoreType'
import type { TimerConfig } from '../types/timer'
import type { WodDay, WodFormat, WodSlotTierFill } from '../types/wod'

// EMOM has no comparable score across attempts — just a completion. AMRAP
// produces rounds+reps; forTime and chipper both produce a finish time.
export function scoreTypeForFormat(format: WodFormat): ScoreType {
  switch (format) {
    case 'amrap':
      return 'rounds_and_reps'
    case 'emom':
      return 'none'
    case 'forTime':
    case 'chipper':
      return 'time'
  }
}

// Reuses the exact TimerConfig shapes the Timer feature already supports —
// EMOM's "every minute on the minute" convention means its durationMinutes
// doubles as its round count.
export function timerConfigForWod(wod: WodDay): TimerConfig {
  switch (wod.format) {
    case 'amrap':
      return { type: 'amrap', durationSeconds: (wod.durationMinutes ?? 12) * 60 }
    case 'emom':
      return { type: 'emom', intervalSeconds: 60, rounds: wod.durationMinutes ?? 12 }
    case 'forTime':
    case 'chipper':
      return { type: 'stopwatch' }
  }
}

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
