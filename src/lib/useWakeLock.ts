import { useEffect, useRef } from 'react'

// Keeps the screen from locking while `active` is true. Silently does
// nothing on browsers without Wake Lock API support (feature-detected).
export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let cancelled = false

    navigator.wakeLock
      .request('screen')
      .then((lock) => {
        if (cancelled) {
          lock.release().catch(() => {})
        } else {
          lockRef.current = lock
        }
      })
      .catch(() => {
        // e.g. page not visible, or permission denied — nothing to do
      })

    return () => {
      cancelled = true
      lockRef.current?.release().catch(() => {})
      lockRef.current = null
    }
  }, [active])
}
