export const LEVEL_ORDER = ['Beginner', 'Intermediate', 'RX', 'Elite'] as const

export function levelIndex(level: string): number {
  const i = LEVEL_ORDER.indexOf(level as (typeof LEVEL_ORDER)[number])
  return i === -1 ? LEVEL_ORDER.length : i
}
