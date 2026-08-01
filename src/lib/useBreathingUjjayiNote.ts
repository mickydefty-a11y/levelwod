import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

const store = createLocalStorageStore<boolean>('levelwod:breathing-ujjayi-note-seen', false)

export function useBreathingUjjayiNote() {
  const hasSeenUjjayiNote = useSyncExternalStore(store.subscribe, store.getSnapshot)
  const markUjjayiNoteSeen = useCallback(() => store.set(true), [])
  return { hasSeenUjjayiNote, markUjjayiNoteSeen }
}
