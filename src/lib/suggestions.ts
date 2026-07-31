import type { Movement } from '../types/movement'
import type { ProgressMap } from './useProgress'

// Movements you haven't started yet, but where every prerequisite already has
// progress recorded — i.e. you've been building toward these and they're
// worth trying next. Movements with no prerequisites are excluded since
// they're always "available" and would otherwise flood the list.
export function getReadyToTry(
  movements: Movement[],
  progress: ProgressMap,
  limit = 5,
): Movement[] {
  const hasProgress = (id: string) => Boolean(progress[id])

  return movements
    .filter(
      (m) =>
        !hasProgress(m.id) &&
        m.prerequisites.length > 0 &&
        m.prerequisites.every((p) => hasProgress(p)),
    )
    .slice(0, limit)
}
