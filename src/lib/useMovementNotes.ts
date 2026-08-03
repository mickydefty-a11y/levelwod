import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import type { MovementNote } from '../types/movementNote'

// One current note per movement, overwritten on edit — not a history log.
// Keyed by movementId in a single reactive store, matching the pattern used
// by usePRHistory.ts rather than a literal separate localStorage key per
// movement.
type MovementNoteMap = Record<string, MovementNote>

export const movementNotesStore = createLocalStorageStore<MovementNoteMap>('levelwod:movement-notes', {})

export function useMovementNotes() {
  const all = useSyncExternalStore(movementNotesStore.subscribe, movementNotesStore.getSnapshot)

  const noteFor = useCallback(
    (movementId: string): MovementNote | null => {
      return all[movementId] ?? null
    },
    [all],
  )

  const setNote = useCallback((movementId: string, note: string) => {
    const trimmed = note.trim()
    movementNotesStore.update((prev) => {
      if (!trimmed) {
        const { [movementId]: _removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [movementId]: { movementId, note: trimmed, updatedAt: new Date().toISOString() },
      }
    })
  }, [])

  const clearNote = useCallback((movementId: string) => {
    movementNotesStore.update((prev) => {
      const { [movementId]: _removed, ...rest } = prev
      return rest
    })
  }, [])

  return { noteFor, setNote, clearNote }
}
