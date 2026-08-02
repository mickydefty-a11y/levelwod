export type QuizGoal =
  | 'just-starting'
  | 'get-stronger'
  | 'gymnastics-skills'
  | 'conditioning'
  | 'functional-strongman'
  | 'olympic-weightlifting'
  | 'hyrox'
  | 'crossfit-open'

export type QuizExperience =
  | 'never-trained'
  | 'building-basics'
  | 'comfortable-basics'
  | 'experienced-peak'

// Only asked when goal === 'get-stronger'.
export type StrongerFocus = 'balanced' | 'percentage-method' | 'squat-specific'

export interface QuizAnswers {
  goal: QuizGoal
  experience: QuizExperience
  strongerFocus?: StrongerFocus
}

export interface QuizAlternative {
  programId: string
  reason: string
}

export interface ReadinessCheck {
  prompt: string
  fallbackProgramId: string
  fallbackReason: string
}

export interface QuizRecommendation {
  programId: string
  // full, on-screen reason — names the recommended program (e.g. "Based on
  // X, we'd suggest Y")
  reason: string
  // shorter variant with no program name, for the Coach's Brief's "you told
  // us X — welcome to Y" phrasing, where the program name is added separately
  briefReason: string
  alternatives: QuizAlternative[]
  readinessCheck: ReadinessCheck | null
}
