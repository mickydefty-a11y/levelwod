export interface CoachsBriefRecentResult {
  movementName: string
  // already formatted for display, e.g. "72.5kg" or "8:42"
  displayValue: string
}

export interface CoachsBriefRecentUnlock {
  movementName: string
  stageName: string
}

// All fields here are already-resolved plain data — this function does no
// lookups of its own, so it's fully testable with literal objects and has
// no dependency on hooks or storage.
export interface CoachsBriefInput {
  // used only by the rule-6 fallback ("Welcome to {sessionName}...")
  sessionName: string
  // rule 0 (highest priority): an auto-regulation nudge, already resolved
  // by the caller (deload-week suppression already applied) — a plain
  // message string, single line, no combination with the streak
  autoregulationNudge?: string | null
  isRetestDay: boolean
  retestMovementName?: string | null
  // rule 2: the first session movement (in session order) with a past
  // logged result, already resolved by the caller
  recentResult?: CoachsBriefRecentResult | null
  // rule 3: the first session movement (in session order) recently
  // unlocked to a new stage, already resolved by the caller
  recentUnlock?: CoachsBriefRecentUnlock | null
  // rule 4: only present for structured programs
  weekFocus?: string | null
  currentStreak: number
}
