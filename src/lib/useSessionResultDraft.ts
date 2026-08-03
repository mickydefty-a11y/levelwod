import { useCallback, useSyncExternalStore } from 'react'
import { createLocalStorageStore } from './localStorageStore'

// Captured the instant "Mark Complete" (or a timer's natural end) fires, so
// a Benchmark WOD or WOD Generator session's result survives an accidental
// back-navigation out of the result-entry screen — cleared only once the
// result is actually saved.
export interface SessionResultDraft {
  elapsedSeconds?: number
  amrapRounds?: number
  capturedAt: string
}

type DraftMap = Record<string, SessionResultDraft>

export const sessionResultDraftStore = createLocalStorageStore<DraftMap>(
  'levelwod:session-result-drafts',
  {},
)

export function useSessionResultDraft(sessionId: string) {
  const all = useSyncExternalStore(sessionResultDraftStore.subscribe, sessionResultDraftStore.getSnapshot)
  const draft = all[sessionId] ?? null

  const saveDraft = useCallback(
    (data: { elapsedSeconds?: number; amrapRounds?: number }) => {
      sessionResultDraftStore.update((prev) => ({
        ...prev,
        [sessionId]: { ...data, capturedAt: new Date().toISOString() },
      }))
    },
    [sessionId],
  )

  const clearDraft = useCallback(() => {
    sessionResultDraftStore.update((prev) => {
      const { [sessionId]: _removed, ...rest } = prev
      return rest
    })
  }, [sessionId])

  return { draft, saveDraft, clearDraft }
}
