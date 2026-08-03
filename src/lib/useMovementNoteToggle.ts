import { useState } from 'react'
import { useMovementNotes } from './useMovementNotes'

// Backs the small, unobtrusive "📝" icon shown next to a movement name
// during a workout (structured program day, WOD Generator, Benchmark WOD)
// when that movement has a saved personal note. Collapsed by default — tap
// to reveal, tap again to hide; never auto-expands.
export function useMovementNoteToggle(movementId: string) {
  const { noteFor } = useMovementNotes()
  const note = noteFor(movementId)
  const [show, setShow] = useState(false)
  return { note, show, toggle: () => setShow((v) => !v) }
}
