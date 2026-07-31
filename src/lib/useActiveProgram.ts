import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import type { Program } from '../types/program'

export interface ActiveProgramPointer {
  programId: string
  weekNumber: number
  dayNumber: number
}

const store = createLocalStorageStore<ActiveProgramPointer | null>('levelwod:active-program', null)

export function useActiveProgram() {
  const pointer = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const startProgram = useCallback((programId: string) => {
    store.set({ programId, weekNumber: 1, dayNumber: 1 })
  }, [])

  const stopProgram = useCallback(() => store.set(null), [])

  const setDay = useCallback((weekNumber: number, dayNumber: number) => {
    store.update((prev) => (prev ? { ...prev, weekNumber, dayNumber } : prev))
  }, [])

  // Moves to the next day in `program`, rolling into the next week when the
  // current week runs out of days, and stopping at the final day if the
  // program is finished.
  const advanceDay = useCallback((program: Program) => {
    store.update((prev) => {
      if (!prev || prev.programId !== program.id) return prev
      const week = program.weeks.find((w) => w.weekNumber === prev.weekNumber)
      if (!week) return prev

      const dayIdx = week.days.findIndex((d) => d.dayNumber === prev.dayNumber)
      if (dayIdx >= 0 && dayIdx + 1 < week.days.length) {
        return { ...prev, dayNumber: week.days[dayIdx + 1].dayNumber }
      }

      const weekIdx = program.weeks.findIndex((w) => w.weekNumber === prev.weekNumber)
      const nextWeek = program.weeks[weekIdx + 1]
      if (nextWeek && nextWeek.days.length > 0) {
        return { ...prev, weekNumber: nextWeek.weekNumber, dayNumber: nextWeek.days[0].dayNumber }
      }

      return prev
    })
  }, [])

  return { pointer, startProgram, stopProgram, setDay, advanceDay }
}
