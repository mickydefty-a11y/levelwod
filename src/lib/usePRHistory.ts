import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import type { MetricType, PREntry } from '../types/pr'

// Keyed by movementId so a movement's full history is one lookup, matching
// the spec's intent — kept as a single reactive store (rather than one
// localStorage key per movement) to fit the app's existing shared-state
// pattern used by every other feature.
type PRHistoryMap = Record<string, PREntry[]>

export const prHistoryStore = createLocalStorageStore<PRHistoryMap>('levelwod:pr-history', {})

export function usePRHistory() {
  const all = useSyncExternalStore(prHistoryStore.subscribe, prHistoryStore.getSnapshot)

  const historyFor = useCallback(
    (movementId: string): PREntry[] => {
      return (all[movementId] ?? []).slice().sort((a, b) => b.date.localeCompare(a.date))
    },
    [all],
  )

  const addEntry = useCallback((entry: Omit<PREntry, 'id'>) => {
    const id = `${entry.movementId}-${entry.metricType}-${Date.now()}`
    prHistoryStore.update((prev) => ({
      ...prev,
      [entry.movementId]: [...(prev[entry.movementId] ?? []), { ...entry, id }],
    }))
  }, [])

  const deleteEntry = useCallback((movementId: string, entryId: string) => {
    prHistoryStore.update((prev) => ({
      ...prev,
      [movementId]: (prev[movementId] ?? []).filter((e) => e.id !== entryId),
    }))
  }, [])

  const lastUnitFor = useCallback(
    (movementId: string, metricType: MetricType): string | null => {
      const entries = (all[movementId] ?? [])
        .filter((e) => e.metricType === metricType)
        .sort((a, b) => b.date.localeCompare(a.date))
      return entries[0]?.unit ?? null
    },
    [all],
  )

  // Every logged entry across every movement, newest first — used by the
  // stats card export to find "the most recently logged PR" without the
  // caller needing to know which movement it belongs to.
  const allEntries = useCallback((): PREntry[] => {
    return Object.values(all)
      .flat()
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [all])

  return { historyFor, addEntry, deleteEntry, lastUnitFor, allEntries }
}
