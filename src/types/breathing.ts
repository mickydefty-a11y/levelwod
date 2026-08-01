export type BreathingPhaseName = 'inhale' | 'hold' | 'exhale'

export interface BreathingPhase {
  name: BreathingPhaseName
  seconds: number
}

export type BreathingTechniqueId = '4-7-8' | 'box' | 'ujjayi' | 'rectangle'

export interface BreathingTechnique {
  id: BreathingTechniqueId
  label: string
  // e.g. "4:7:8" or "4:4:4:4" — shown on the picker so people can choose by pattern
  patternLabel: string
  description: string
  visual: 'circle' | 'rectangle'
  phases: BreathingPhase[]
  // Ujjayi's pacing alone doesn't teach the throat-constriction technique
  firstTimeNote?: string
}
