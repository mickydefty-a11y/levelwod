export type StatsCardType = 'streak' | 'pr' | 'journey'

export interface StreakCardData {
  type: 'streak'
  currentStreak: number
  totalSessions: number
}

export interface PRCardData {
  type: 'pr'
  movementName: string
  valueLabel: string
  date: string
  improvementLabel: string | null
}

export interface JourneyCardData {
  type: 'journey'
  programsCompleted: number
  totalSessions: number
  skillsUnlocked: number
}

export type StatsCardData = StreakCardData | PRCardData | JourneyCardData

export interface StatsCardOption {
  type: StatsCardType
  label: string
  data: StatsCardData | null
  // when data is null, why this template is disabled right now
  disabledReason: string | null
}
