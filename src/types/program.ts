import type { TimerConfig } from './timer'
import type { LogPrompt } from './pr'
import type { ScoreType } from './scoreType'

export type BlockType = 'warmup' | 'skill' | 'strength' | 'metcon' | 'mobility' | 'cooldown'

export type WeightUnit = 'kg' | 'lb'

// A block's weight is calculated rather than given as a literal number.
// 'trainingMax' (5/3/1) uses a 90%-reduced buffer that increments between
// waves; 'oneRepMax' (Russian Squat) uses the raw entered 1RM directly with
// no reduction and no increment.
export interface LoadConfig {
  basedOn: 'trainingMax' | 'oneRepMax'
  percentage: number
  // number of identical sets at this percentage — authoring convenience only,
  // doesn't affect the weight (every set at a given percentage is the same
  // weight); defaults to 1 when omitted (as in every existing 5/3/1 block)
  sets?: number
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
  // present only on metcon blocks with a comparable result (a for-time or
  // AMRAP piece) — enables the same Start Now -> Timer -> Log Result flow
  // already built for Benchmark WODs/the WOD Generator. Most metcon blocks
  // are steady-state/interval conditioning with no comparable score, so this
  // is deliberately absent on those; they keep the plain "Start Timer" link.
  scoreType?: ScoreType
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

export type ProgramCategory =
  | 'General Fitness'
  | 'Strength'
  | 'Gymnastics'
  | 'Conditioning'
  | 'Functional/Strongman'
  | 'Olympic Weightlifting'
  | 'Hyrox'
  | 'CrossFit Open'
  | 'Minimal Equipment'

export interface Program {
  id: string
  name: string
  level: string
  category?: ProgramCategory
  durationWeeks: number
  daysPerWeek: number
  description: string
  weeks: ProgramWeek[]
  requiresInput?: RequiresInput
  // per-lift Training Max increase applied once a new wave begins, keyed by
  // movementId then unit
  trainingMaxIncrementsPerCycle?: Record<string, Record<WeightUnit, number>>
  // shown as a prominent callout before someone starts the program (e.g.
  // "not recommended for beginners")
  safetyNote?: string
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
