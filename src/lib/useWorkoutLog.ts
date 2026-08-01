import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

export interface LoggedResult {
  blockIndex: number
  movementId: string
  movementName: string
  prescription: string
  result: string
}

export interface WorkoutLogEntry {
  id: string
  programId: string
  programName: string
  weekNumber: number
  dayNumber: number
  dayName: string
  completedAt: string
  results: LoggedResult[]
  // 1-10 Rate of Perceived Exertion, optional — someone can mark a day done
  // without rating it
  rpe?: number
}

export const workoutLogStore = createLocalStorageStore<WorkoutLogEntry[]>(
  'levelwod:workout-log',
  [],
)
const store = workoutLogStore

export function useWorkoutLog() {
  const log = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const addEntry = useCallback((entry: Omit<WorkoutLogEntry, 'id'>) => {
    const id = `${entry.programId}-w${entry.weekNumber}d${entry.dayNumber}-${entry.completedAt}`
    store.update((prev) => [{ ...entry, id }, ...prev])
  }, [])

  const resultsForMovement = useCallback(
    (movementId: string) => {
      return log
        .flatMap((entry) =>
          entry.results
            .filter((r) => r.movementId === movementId)
            .map((r) => ({ ...r, completedAt: entry.completedAt, programName: entry.programName })),
        )
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    },
    [log],
  )

  return { log, addEntry, resultsForMovement }
}
