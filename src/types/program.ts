import type { TimerConfig } from './timer'
import type { LogPrompt } from './pr'

export type BlockType = 'warmup' | 'skill' | 'strength' | 'metcon' | 'mobility' | 'cooldown'

export type WeightUnit = 'kg' | 'lb'

// A block's weight is calculated from a percentage of the lift's Training
// Max rather than given as a literal number (used by percentage-based
// strength programs like 5/3/1).
export interface LoadConfig {
  basedOn: 'trainingMax'
  percentage: number
  reps: number
  isAmrap: boolean
}

export interface ProgramBlock {
  blockType: BlockType
  movementId: string
  targetStageId: string | null
  prescription: string
  notes: string | null
  timerConfig?: TimerConfig
  logPrompt?: LogPrompt
  loadConfig?: LoadConfig
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

// Present on programs that need a person to enter numbers before the
// program's weights can be calculated (e.g. 5/3/1's 1RM inputs).
export interface RequiresInput {
  oneRepMaxInputs: string[]
}

export interface Program {
  id: string
  name: string
  level: string
  durationWeeks: number
  daysPerWeek: number
  description: string
  weeks: ProgramWeek[]
  requiresInput?: RequiresInput
  // per-lift Training Max increase applied once a new wave begins, keyed by
  // movementId then unit
  trainingMaxIncrementsPerCycle?: Record<string, Record<WeightUnit, number>>
}

// Phase files (e.g. strength-focus-phase2-weeks3-5.json) continue an existing
// program by id rather than repeating its top-level fields.
export interface ProgramPhase {
  programId: string
  weeks: ProgramWeek[]
}

export interface TrainingMaxData {
  unit: WeightUnit
  oneRepMax: Record<string, number>
  // base (Wave 1) Training Max per movement, computed once at program start
  trainingMax: Record<string, number>
}
