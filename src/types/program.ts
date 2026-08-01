import type { TimerConfig } from './timer'
import type { LogPrompt } from './pr'

export type BlockType = 'warmup' | 'skill' | 'strength' | 'metcon' | 'mobility' | 'cooldown'

export interface ProgramBlock {
  blockType: BlockType
  movementId: string
  targetStageId: string | null
  prescription: string
  notes: string | null
  timerConfig?: TimerConfig
  logPrompt?: LogPrompt
}

export interface ProgramDay {
  dayNumber: number
  name: string
  blocks: ProgramBlock[]
}

export interface ProgramWeek {
  weekNumber: number
  focus: string
  days: ProgramDay[]
}

export interface Program {
  id: string
  name: string
  level: string
  durationWeeks: number
  daysPerWeek: number
  description: string
  weeks: ProgramWeek[]
}

// Phase files (e.g. strength-focus-phase2-weeks3-5.json) continue an existing
// program by id rather than repeating its top-level fields.
export interface ProgramPhase {
  programId: string
  weeks: ProgramWeek[]
}
