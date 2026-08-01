import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import type { SubstitutionChoice, SubstitutionScope } from '../types/substitution'

type SubstitutionMap = Record<string, SubstitutionChoice>

export const substitutionStore = createLocalStorageStore<SubstitutionMap>(
  'levelwod:substitutions',
  {},
)

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useSubstitutions() {
  const all = useSyncExternalStore(substitutionStore.subscribe, substitutionStore.getSnapshot)

  const setSubstitution = useCallback(
    (originalMovementId: string, substitutedWith: string, scope: SubstitutionScope) => {
      substitutionStore.update((prev) => ({
        ...prev,
        [originalMovementId]: { originalMovementId, substitutedWith, scope, date: todayISO() },
      }))
    },
    [],
  )

  const clearSubstitution = useCallback((originalMovementId: string) => {
    substitutionStore.update((prev) => {
      const next = { ...prev }
      delete next[originalMovementId]
      return next
    })
  }, [])

  // A "today-only" swap from a previous day is treated as expired (present
  // in storage but no longer active) rather than deleted outright — this
  // way it can still be inspected/re-applied deliberately if ever needed.
  const choiceFor = useCallback(
    (originalMovementId: string): SubstitutionChoice | null => {
      const choice = all[originalMovementId]
      if (!choice) return null
      if (choice.scope === 'today-only' && choice.date !== todayISO()) return null
      return choice
    },
    [all],
  )

  const activeSubstituteFor = useCallback(
    (originalMovementId: string): string | null => choiceFor(originalMovementId)?.substitutedWith ?? null,
    [choiceFor],
  )

  return { all, setSubstitution, clearSubstitution, choiceFor, activeSubstituteFor }
}
