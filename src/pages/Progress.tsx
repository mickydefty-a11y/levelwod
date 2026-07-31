import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { downloadBackup, resetAllData, restoreBackup } from '../lib/backup'
import { loadMovements } from '../lib/loadData'
import { useProgress } from '../lib/useProgress'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { Movement } from '../types/movement'

export default function Progress() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { progress, clearMovementProgress } = useProgress()
  const { log } = useWorkoutLog()
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        const result = restoreBackup(data)
        setImportMessage(result.ok ? 'Backup restored.' : result.error)
      } catch {
        setImportMessage("That file couldn't be read — is it a LevelWOD backup JSON file?")
      }
    }
    reader.readAsText(file)
  }

  function handleReset() {
    if (
      window.confirm(
        'This clears everything — saved levels, active program, and workout history. This cannot be undone. Continue?',
      )
    ) {
      resetAllData()
      setImportMessage('All data cleared.')
    }
  }

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const entries = useMemo(() => {
    if (!movements) return []
    const byId = new Map(movements.map((m) => [m.id, m]))
    return Object.entries(progress)
      .map(([movementId, entry]) => {
        const movement = byId.get(movementId)
        const label =
          movement?.type === 'progression'
            ? (movement.stages?.find((s) => s.id === entry.value)?.name ?? entry.value)
            : entry.value
        return { movement, ...entry, movementId, label }
      })
      .filter((e) => e.movement)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [movements, progress])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Progress</h1>

      {!movements ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          No progress saved yet. Open any movement in the{' '}
          <Link to="/library" className="text-accent-light underline">
            Library
          </Link>{' '}
          and tap a stage or level to mark where you're at.
        </p>
      ) : (
        <ul className="mt-4 space-y-1.5">
          {entries.map((e) => (
            <li
              key={e.movementId}
              className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2"
            >
              <Link to={`/library/${e.movementId}`} className="text-sm">
                {e.movement!.name}
                <span className="ml-2 text-xs text-accent-light">{e.label}</span>
              </Link>
              <button
                onClick={() => clearMovementProgress(e.movementId)}
                className="text-xs text-ink-muted underline"
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-accent">Workout history</h2>
        {log.length === 0 ? (
          <p className="mt-1.5 text-sm text-ink-muted">
            Completed days will show up here once you mark a session done.
          </p>
        ) : (
          <ul className="mt-1.5 space-y-2">
            {log.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-bg-surface px-3 py-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{entry.dayName}</span>
                  <span className="text-xs text-ink-muted">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  {entry.programName} · Week {entry.weekNumber}
                </p>
                {entry.results.length > 0 ? (
                  <ul className="mt-1.5 space-y-0.5">
                    {entry.results.map((r) => (
                      <li key={r.blockIndex} className="text-xs">
                        <Link to={`/library/${r.movementId}`} className="text-accent-light">
                          {r.movementName}
                        </Link>
                        <span className="text-ink-muted"> — {r.result}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs italic text-ink-muted">No results logged</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-accent">Your data</h2>
        <p className="mt-1.5 text-xs text-ink-muted">
          Everything above is stored only in this browser. Back it up regularly so you don't lose
          it if you clear browser data or switch devices.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={downloadBackup}
            className="flex-1 rounded-lg bg-bg-surface py-2 text-sm font-medium"
          >
            Export backup
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 rounded-lg bg-bg-surface py-2 text-sm font-medium"
          >
            Import backup
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleImportFile}
          className="hidden"
        />
        {importMessage && <p className="mt-2 text-xs text-accent-light">{importMessage}</p>}

        <button
          onClick={handleReset}
          className="mt-3 w-full rounded-lg bg-white/5 py-2 text-xs text-ink-muted"
        >
          Clear all my data
        </button>
      </div>
    </div>
  )
}
