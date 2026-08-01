import type { TimerConfig } from '../types/timer'

export interface TimerStep {
  kind: 'work' | 'rest' | 'active'
  seconds: number
}

// Countdown-based configs (everything except stopwatch) reduce to a flat
// sequence of steps the engine just walks through. Intervals skip the
// trailing rest after the final round.
export function buildSteps(config: TimerConfig): TimerStep[] | null {
  switch (config.type) {
    case 'stopwatch':
      return null
    case 'rest':
      return [{ kind: 'active', seconds: config.durationSeconds }]
    case 'amrap':
      return [{ kind: 'active', seconds: config.durationSeconds }]
    case 'emom': {
      const steps: TimerStep[] = []
      for (let i = 0; i < config.rounds; i++) {
        steps.push({ kind: 'active', seconds: config.intervalSeconds })
      }
      return steps
    }
    case 'intervals': {
      const steps: TimerStep[] = []
      for (let i = 0; i < config.rounds; i++) {
        steps.push({ kind: 'work', seconds: config.workSeconds })
        if (i < config.rounds - 1) {
          steps.push({ kind: 'rest', seconds: config.restSeconds })
        }
      }
      return steps
    }
  }
}
