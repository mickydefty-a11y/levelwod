import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import type { Gender } from '../types/strengthStandards'
import type { WeightUnit } from '../types/program'

// The app's single user-profile store — bodyweight/gender/unit were added
// first (for the Standards tools), then extended with name/age/
// onboardingCompletedAt for the first-run onboarding flow. Kept as one
// store rather than a second competing one so "unit preference respected
// everywhere" stays true for every existing reader (Strength/Rowing/Running
// Standards, the embedded 1RM Calculator) with no changes to them.
export interface BodyweightProfile {
  name: string | null
  bodyweight: number
  unit: WeightUnit
  gender: Gender | null
  age: number | null
  // set once onboarding is completed (skipped fields and all) — null means
  // "never completed," the sole gate for showing onboarding on next launch
  onboardingCompletedAt: string | null
}

const DEFAULT_PROFILE: BodyweightProfile = {
  name: null,
  bodyweight: 0,
  unit: 'kg',
  gender: null,
  age: null,
  onboardingCompletedAt: null,
}

export const bodyweightProfileStore = createLocalStorageStore<BodyweightProfile>(
  'levelwod:bodyweight-profile',
  DEFAULT_PROFILE,
)

export function useBodyweightProfile() {
  const raw = useSyncExternalStore(bodyweightProfileStore.subscribe, bodyweightProfileStore.getSnapshot)
  // older saved profiles predate name/age/onboardingCompletedAt — backfill
  // so every reader can rely on the full shape being present
  const profile: BodyweightProfile = { ...DEFAULT_PROFILE, ...raw }

  const setProfile = useCallback((next: Partial<BodyweightProfile>) => {
    bodyweightProfileStore.update((prev) => ({ ...DEFAULT_PROFILE, ...prev, ...next }))
  }, [])

  return { profile, setProfile }
}
