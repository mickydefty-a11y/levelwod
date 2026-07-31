import type { Program } from '../types/program'

// Weeks are sorted ascending by loadPrograms(), and each week's days are
// already in authored order, so the last entry of each is the final one.
export function isLastDayOf(program: Program, weekNumber: number, dayNumber: number): boolean {
  const lastWeek = program.weeks[program.weeks.length - 1]
  if (!lastWeek || lastWeek.weekNumber !== weekNumber) return false
  const lastDay = lastWeek.days[lastWeek.days.length - 1]
  return !!lastDay && lastDay.dayNumber === dayNumber
}
