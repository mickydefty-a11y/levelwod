import { useCallback, useSyncExternalStore } from 'react'
import { computeTrainingMax } from './trainingMax'
import { createLocalStorageStore } from './localStorageStore'
import type { TrainingMaxData, WeightUnit } from '../types/program'

type TrainingMaxStore = Record<string, TrainingMaxData>

export const trainingMaxStore = createLocalStorageStore<TrainingMaxStore>('levelwod:training-max', {})
const store = trainingMaxStore

export function useTrainingMax() {
  const all = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const dataFor = useCallback((programId: string): TrainingMaxData | null => all[programId] ?? null, [all])

  const setOneRepMaxes = useCallback(
    (programId: string, unit: WeightUnit, oneRepMax: Record<string, number>) => {
      const trainingMax: Record<string, number> = {}
      for (const [movementId, value] of Object.entries(oneRepMax)) {
        trainingMax[movementId] = computeTrainingMax(value, unit)
      }
      store.update((prev) => ({
        ...prev,
        [programId]: { unit, oneRepMax, trainingMax },
      }))
    },
    [],
  )

  return { dataFor, setOneRepMaxes }
}
