// A tiny shared store per localStorage key. Every component that reads this
// key via useSyncExternalStore sees the same live value and re-renders the
// instant any of them writes to it — no more stale copies between screens.
// Also picks up changes written by other browser tabs via the storage event.
export function createLocalStorageStore<T>(key: string, defaultValue: T) {
  function read(): T {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : defaultValue
    } catch {
      return defaultValue
    }
  }

  let cache = read()
  const listeners = new Set<() => void>()

  function emit() {
    listeners.forEach((listener) => listener())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  function getSnapshot() {
    return cache
  }

  function set(value: T) {
    cache = value
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // e.g. storage full or unavailable — keep the in-memory value regardless
    }
    emit()
  }

  function update(updater: (prev: T) => T) {
    set(updater(cache))
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === key) {
        cache = read()
        emit()
      }
    })
  }

  return { getSnapshot, subscribe, set, update }
}
