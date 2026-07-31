import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

export interface ProgressEntry {
  // stage id for progression movements, or a level name (e.g. "RX") for tutorials
  value: string
  updatedAt: string
}

export type ProgressMap = Record<string, ProgressEntry>

const store = createLocalStorageStore<ProgressMap>('levelwod:progress', {})

export function useProgress() {
  const progress = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const setMovementProgress = useCallback((movementId: string, value: string) => {
    store.update((prev) => ({
      ...prev,
      [movementId]: { value, updatedAt: new Date().toISOString() },
    }))
  }, [])

  const clearMovementProgress = useCallback((movementId: string) => {
    store.update((prev) => {
      const next = { ...prev }
      delete next[movementId]
      return next
    })
  }, [])

  return { progress, setMovementProgress, clearMovementProgress }
}
