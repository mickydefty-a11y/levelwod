import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

export interface CompletedProgram {
  programId: string
  completedAt: string
}

const store = createLocalStorageStore<CompletedProgram[]>('levelwod:completed-programs', [])

export function useProgramHistory() {
  const completed = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const markCompleted = useCallback((programId: string) => {
    store.update((prev) => [
      ...prev.filter((c) => c.programId !== programId),
      { programId, completedAt: new Date().toISOString() },
    ])
  }, [])

  const isCompleted = useCallback(
    (programId: string) => completed.some((c) => c.programId === programId),
    [completed],
  )

  const completedAt = useCallback(
    (programId: string) => completed.find((c) => c.programId === programId)?.completedAt,
    [completed],
  )

  return { completed, markCompleted, isCompleted, completedAt }
}
