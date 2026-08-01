import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'
import { DEFAULT_VOICE_SETTINGS } from '../types/voice'
import type { VoiceSettings } from '../types/voice'

const store = createLocalStorageStore<VoiceSettings>('levelwod:voice-settings', DEFAULT_VOICE_SETTINGS)

export function useVoiceSettings() {
  const settings = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const update = useCallback((patch: Partial<VoiceSettings>) => {
    store.update((prev) => ({ ...prev, ...patch }))
  }, [])

  const toggleEnabled = useCallback(() => {
    store.update((prev) => ({ ...prev, voiceModeEnabled: !prev.voiceModeEnabled }))
  }, [])

  return { settings, update, toggleEnabled }
}
