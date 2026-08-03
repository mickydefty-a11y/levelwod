import { useState } from 'react'
import { useMovementNotes } from '../lib/useMovementNotes'
import { MOVEMENT_NOTE_MAX_LENGTH } from '../types/movementNote'

export default function MovementNotes({ movementId }: { movementId: string }) {
  const { noteFor, setNote } = useMovementNotes()
  const existing = noteFor(movementId)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(existing?.note ?? '')

  function startEditing() {
    setDraft(existing?.note ?? '')
    setEditing(true)
  }

  function save() {
    setNote(movementId, draft)
    setEditing(false)
  }

  return (
    <div className="mt-4">
      <h2 className="text-sm font-semibold text-accent">My Notes</h2>

      {editing ? (
        <div className="mt-1.5">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MOVEMENT_NOTE_MAX_LENGTH))}
            onBlur={save}
            maxLength={MOVEMENT_NOTE_MAX_LENGTH}
            rows={3}
            placeholder="A cue, a reminder, anything worth remembering next time"
            className="w-full rounded-lg bg-bg-surface px-3 py-2 text-sm placeholder:text-ink-muted/70 focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[10px] text-ink-muted">
              {draft.length}/{MOVEMENT_NOTE_MAX_LENGTH}
            </span>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={save}
              className="text-xs font-medium text-accent-light"
            >
              Done
            </button>
          </div>
        </div>
      ) : existing ? (
        <button
          onClick={startEditing}
          className="mt-1.5 block w-full rounded-lg bg-bg-surface px-3 py-2 text-left text-sm hover:bg-bg-raised"
        >
          {existing.note}
        </button>
      ) : (
        <button
          onClick={startEditing}
          className="mt-1.5 block w-full rounded-lg bg-bg-surface px-3 py-2 text-left text-sm italic text-ink-muted hover:bg-bg-raised"
        >
          Add a note — a cue, a reminder, anything worth remembering next time
        </button>
      )}
    </div>
  )
}
