export type MovementType = 'progression' | 'tutorial' | 'composite'
export type SkillLevel = 'Beginner' | 'Intermediate' | 'RX' | 'Elite'

export interface CommonFault {
  fault: string
  cue: string
}

export interface MovementStage {
  id: string
  level: SkillLevel
  name: string
  description: string
  graduationCriteria: string
  // stage-specific demo clip — falls back to nothing (not the movement's
  // overview video) when unset, since a Dead Hang clip shouldn't play under
  // a Chest-to-Bar stage just because the movement has *a* video
  video?: string | null
}

export interface ScalingLevel {
  level: SkillLevel
  description: string
}

export interface Drill {
  name: string
  description: string
}

export interface RequiredMovement {
  movementId: string
  requiredLevel: SkillLevel
}

export interface SuggestedSubstitute {
  movementId: string
  reason: string
}

export interface MovementMedia {
  video: string | null
  thumbnail: string | null
}

export interface Movement {
  id: string
  name: string
  category: string
  subcategory: string
  type: MovementType
  equipment: string[]
  prerequisites: string[]
  variantOf: string | null
  description: string
  commonFaults: CommonFault[]
  media: MovementMedia
  // present when type === 'progression'
  stages?: MovementStage[]
  // present when type === 'tutorial' (umbrella entries also carry `drills`)
  scaling?: ScalingLevel[]
  drills?: Drill[]
  // present when type === 'composite'
  requiredMovements?: RequiredMovement[]
  // hand-curated substitutes, checked before falling back to automatic matching
  suggestedSubstitutes?: SuggestedSubstitute[]
}
