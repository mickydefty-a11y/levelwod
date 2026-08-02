import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import type { Gender } from '../types/strengthStandards'
import type { WeightUnit } from '../types/program'

// A small, standalone profile store — nothing in the app tracks bodyweight
// or gender today. Kept separate from every other feature's storage; the
// Strength Standards tool is currently the only reader/writer.
export interface BodyweightProfile {
  bodyweight: number
  unit: WeightUnit
  gender: Gender | null
}

const DEFAULT_PROFILE: BodyweightProfile = { bodyweight: 0, unit: 'kg', gender: null }

export const bodyweightProfileStore = createLocalStorageStore<BodyweightProfile>(
  'levelwod:bodyweight-profile',
  DEFAULT_PROFILE,
)

export function useBodyweightProfile() {
  const profile = useSyncExternalStore(
    bodyweightProfileStore.subscribe,
    bodyweightProfileStore.getSnapshot,
  )

  const setProfile = useCallback((next: Partial<BodyweightProfile>) => {
    bodyweightProfileStore.update((prev) => ({ ...prev, ...next }))
  }, [])

  return { profile, setProfile }
}
