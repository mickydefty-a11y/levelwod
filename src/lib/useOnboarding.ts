import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

const store = createLocalStorageStore<boolean>('levelwod:onboarded', false)

export function useOnboarding() {
  const hasSeenIntro = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const markSeen = useCallback(() => store.set(true), [])

  return { hasSeenIntro, markSeen }
}
