import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

// date -> subcategories used that day. A pure optimization aid for variety,
// never the source of truth for what's displayed (generateWod is fully
// deterministic from date + template pool) — a missing or stale entry just
// means slightly less effective repeat-avoidance, never a wrong result.
type WodHistory = Record<string, string[]>

const MAX_ENTRIES = 14

export const wodHistoryStore = createLocalStorageStore<WodHistory>('levelwod:wod-history', {})
const store = wodHistoryStore

function addDays(dateStr: string, delta: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

export function useWodHistory() {
  const history = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const recentSubcategories = useCallback(
    (beforeDate: string, days: number): string[][] => {
      const result: string[][] = []
      for (let back = 1; back <= days; back++) {
        const subs = history[addDays(beforeDate, -back)]
        if (subs) result.push(subs)
      }
      return result
    },
    [history],
  )

  const recordWod = useCallback((date: string, subcategories: string[]) => {
    store.update((prev) => {
      if (prev[date]) return prev
      const next = { ...prev, [date]: subcategories }
      const dates = Object.keys(next).sort()
      while (dates.length > MAX_ENTRIES) {
        delete next[dates.shift()!]
      }
      return next
    })
  }, [])

  return { history, recentSubcategories, recordWod }
}
