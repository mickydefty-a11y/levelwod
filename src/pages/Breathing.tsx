import { useState } from 'react'
import BackLink from '../components/BackLink'
import BreathingCircle from '../components/BreathingCircle'
import BreathingRectangle from '../components/BreathingRectangle'
import VoiceModeToggle from '../components/VoiceModeToggle'
import { BREATHING_TECHNIQUES } from '../lib/breathingTechniques'
import { useBreathingSession } from '../lib/useBreathingSession'
import { useBreathingUjjayiNote } from '../lib/useBreathingUjjayiNote'
import { useBreathingVoiceCues } from '../lib/useBreathingVoiceCues'
import { useWakeLock } from '../lib/useWakeLock'
import type { BreathingTechnique } from '../types/breathing'

const PHASE_LABEL: Record<string, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
}

function formatMinutes(totalSeconds: number) {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function Breathing() {
  const [techniqueId, setTechniqueId] = useState<string | null>(null)
  const [durationMinutes, setDurationMinutes] = useState(4)
  const [showUjjayiNote, setShowUjjayiNote] = useState(false)
  const { hasSeenUjjayiNote, markUjjayiNoteSeen } = useBreathingUjjayiNote()

  const technique = BREATHING_TECHNIQUES.find((t) => t.id === techniqueId) ?? null
  const session = useBreathingSession(technique?.phases ?? [], durationMinutes)
  useWakeLock(session.status === 'running')
  useBreathingVoiceCues(session)

  function selectTechnique(t: BreathingTechnique) {
    setTechniqueId(t.id)
    if (t.id === 'ujjayi' && !hasSeenUjjayiNote) setShowUjjayiNote(true)
  }

  function backToPicker() {
    session.reset()
    setShowUjjayiNote(false)
    setTechniqueId(null)
  }

  if (!technique) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Breathing</h1>
          <VoiceModeToggle />
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          A few minutes of guided breathing — pick a technique to get started.
        </p>
        <ul className="mt-4 space-y-2">
          {BREATHING_TECHNIQUES.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => selectTechnique(t)}
                className="w-full rounded-xl bg-bg-surface p-4 text-left hover:bg-bg-raised"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{t.label}</span>
                  <span className="shrink-0 text-xs text-accent-light">{t.patternLabel}</span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{t.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <BackLink onClick={backToPicker} label="Techniques" />
        <div className="flex items-center gap-2">
          {technique.firstTimeNote && (
            <button
              onClick={() => setShowUjjayiNote(true)}
              aria-label={`About ${technique.label}`}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-surface text-xs text-ink-muted"
            >
              ⓘ
            </button>
          )}
          <VoiceModeToggle />
        </div>
      </div>

      <h1 className="mt-2 self-start text-2xl font-semibold">{technique.label}</h1>

      {showUjjayiNote && technique.firstTimeNote && (
        <div className="mt-3 w-full rounded-lg bg-bg-surface p-3">
          <p className="text-xs leading-relaxed text-ink-muted">{technique.firstTimeNote}</p>
          <button
            onClick={() => {
              setShowUjjayiNote(false)
              markUjjayiNoteSeen()
            }}
            className="mt-2 text-xs text-accent-light underline"
          >
            Got it
          </button>
        </div>
      )}

      {session.status === 'idle' && (
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between">
            <label htmlFor="breathing-duration" className="text-sm text-ink-muted">
              Duration
            </label>
            <span className="text-sm font-semibold">{durationMinutes} min</span>
          </div>
          <input
            id="breathing-duration"
            type="range"
            min={1}
            max={10}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
          <button
            onClick={session.start}
            className="mt-4 w-full rounded-lg bg-accent py-3 text-base font-semibold text-bg"
          >
            Start
          </button>
        </div>
      )}

      {(session.status === 'running' || session.status === 'paused') && (
        <>
          <div className="mt-6">
            {technique.visual === 'rectangle' ? (
              <BreathingRectangle edgeCount={session.edgeCount} progress={session.phaseProgress} />
            ) : (
              <BreathingCircle progress={session.circleProgress} />
            )}
          </div>

          <p className="mt-6 text-3xl font-medium">
            {PHASE_LABEL[session.phaseName]}
            {session.status === 'paused' && <span className="text-base text-ink-muted"> · Paused</span>}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{formatMinutes(session.totalSecondsLeft)} left</p>

          <div className="mt-8 flex w-full gap-3">
            {session.status === 'running' ? (
              <button
                onClick={session.pause}
                className="flex-1 rounded-lg bg-bg-surface py-3 text-sm font-medium"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={session.resume}
                className="flex-1 rounded-lg bg-accent py-3 text-sm font-semibold text-bg"
              >
                Resume
              </button>
            )}
            <button
              onClick={session.reset}
              className="flex-1 rounded-lg bg-white/5 py-3 text-sm text-ink-muted"
            >
              End
            </button>
          </div>
        </>
      )}

      {session.status === 'done' && (
        <div className="mt-16 flex flex-col items-center">
          <p className="text-lg font-medium text-accent-light">Session complete</p>
          <button
            onClick={backToPicker}
            className="mt-6 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-bg"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
