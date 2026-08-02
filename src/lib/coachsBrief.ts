import type { CoachsBriefInput } from '../types/coachsBrief'

// Priority-ordered template rules, checked in order — the first one with
// real data behind it wins. No AI/LLM involved: every line traces back to
// something already tracked (a logged PR, an actual stage unlock, the
// program's own week-focus text, or the streak count).
//
// Only rules 1 and 2 ever combine with a second line (the streak, if one
// exists) — everything else stays to a single line, so this reads like a
// quick coach's greeting rather than a report.
export function generateCoachsBrief(input: CoachsBriefInput): string[] {
  const streakLine = input.currentStreak > 0 ? `Day ${input.currentStreak} streak — nice consistency.` : null

  // Rule 0 (highest priority): an auto-regulation nudge based on recent
  // logged effort — takes precedence over even a retest day, since noticing
  // someone's been grinding matters more than any other greeting.
  if (input.autoregulationNudge) {
    return [input.autoregulationNudge]
  }

  // Rule 1: this is the very first session of a program started from the
  // recommendation quiz — surfaces the reason behind that pick exactly
  // once, taking priority over the retest/recentResult/weekFocus rules
  // below since none of those would have real data yet on day 1 anyway.
  if (input.isFirstSession && input.startReason) {
    const lines = [`${input.startReason} Welcome to ${input.sessionName}.`]
    if (streakLine) lines.push(streakLine)
    return lines
  }

  // Rule 2: today is a retest day
  if (input.isRetestDay) {
    const subject = input.retestMovementName ? `${input.retestMovementName} time` : 'retest time'
    const lines = [`Today's a retest — ${subject}. Compare against your earlier number and see how far you've come.`]
    if (streakLine) lines.push(streakLine)
    return lines
  }

  // Rule 3: a session movement was trained recently with a logged number
  if (input.recentResult) {
    const lines = [
      `Last ${input.recentResult.movementName} session you hit ${input.recentResult.displayValue} — let's build on that today.`,
    ]
    if (streakLine) lines.push(streakLine)
    return lines
  }

  // Rule 4: a session movement was unlocked to a new stage recently
  if (input.recentUnlock) {
    return [`You just leveled up to ${input.recentUnlock.stageName} — nice work. Let's put it to use.`]
  }

  // Rule 5: the program week has a focus field (structured programs only)
  if (input.weekFocus) {
    return [input.weekFocus]
  }

  // Rule 6: an active streak exists
  if (input.currentStreak > 0) {
    return [`Day ${input.currentStreak} — nice consistency, keep it going.`]
  }

  // Rule 7: fallback — no data yet
  return [`Welcome to ${input.sessionName}. Let's get started.`]
}
