import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import { levelIndex } from '../lib/levels'
import { useProgress } from '../lib/useProgress'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import { getYouTubeEmbedUrl } from '../lib/youtube'
import type { Movement } from '../types/movement'

function MovementLink({ id, index }: { id: string; index: Map<string, Movement> }) {
  const target = index.get(id)
  return (
    <Link to={`/library/${id}`} className="text-coral-light underline underline-offset-2">
      {target?.name ?? id}
    </Link>
  )
}

export default function MovementDetail() {
  const { id } = useParams<{ id: string }>()
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const { progress, setMovementProgress, clearMovementProgress } = useProgress()
  const { resultsForMovement } = useWorkoutLog()

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const index = useMemo(() => (movements ? buildMovementIndex(movements) : null), [movements])
  const movement = id && index ? index.get(id) : undefined
  const current = id ? progress[id] : undefined

  if (!movements || !index) {
    return <p className="mt-4 text-ink-muted">Loading…</p>
  }

  if (!movement) {
    return (
      <div>
        <p className="text-ink-muted">Movement not found.</p>
        <Link to="/library" className="mt-2 inline-block text-coral-light underline">
          Back to Library
        </Link>
      </div>
    )
  }

  const currentStageIndex =
    movement.type === 'progression' && current
      ? (movement.stages ?? []).findIndex((s) => s.id === current.value)
      : -1
  const currentLevelIndex =
    movement.type === 'tutorial' && current ? levelIndex(current.value) : -1
  const currentLabel =
    movement.type === 'progression'
      ? (movement.stages?.find((s) => s.id === current?.value)?.name ?? current?.value)
      : current?.value
  const videoEmbedUrl = getYouTubeEmbedUrl(movement.media.video)
  const recentResults = resultsForMovement(movement.id).slice(0, 5)

  return (
    <div>
      <Link to="/library" className="text-sm text-ink-muted">
        ← Library
      </Link>

      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-2xl font-semibold">{movement.name}</h1>
        <span className="mt-1 shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
          {movement.type}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-ink-muted">
        {movement.category} · {movement.subcategory}
      </p>

      <p className="mt-3 text-sm leading-relaxed">{movement.description}</p>

      {videoEmbedUrl && (
        <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            className="h-full w-full"
            src={videoEmbedUrl}
            title={`${movement.name} demo video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {movement.equipment.length === 0 ? (
          <span className="rounded-full bg-bg-surface px-2 py-0.5 text-xs text-ink-muted">
            Bodyweight only
          </span>
        ) : (
          movement.equipment.map((eq) => (
            <span key={eq} className="rounded-full bg-bg-surface px-2 py-0.5 text-xs text-ink-muted">
              {eq}
            </span>
          ))
        )}
      </div>

      {(movement.prerequisites.length > 0 || movement.variantOf) && (
        <div className="mt-4 text-sm">
          {movement.variantOf && (
            <p>
              Variation of <MovementLink id={movement.variantOf} index={index} />
            </p>
          )}
          {movement.prerequisites.length > 0 && (
            <p className="mt-1">
              Prerequisites:{' '}
              {movement.prerequisites.map((p, i) => (
                <span key={p}>
                  {i > 0 && ', '}
                  <MovementLink id={p} index={index} />
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      {movement.commonFaults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-coral">Common faults</h2>
          <ul className="mt-1.5 space-y-1.5">
            {movement.commonFaults.map((f) => (
              <li key={f.fault} className="rounded-lg bg-bg-surface px-3 py-2 text-sm">
                <span className="font-medium">{f.fault}</span>
                <span className="block text-xs text-ink-muted">Cue: {f.cue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {current && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-coral/15 px-3 py-2 text-sm">
          <span>
            Your level: <span className="font-medium text-coral-light">{currentLabel}</span>
          </span>
          <button
            onClick={() => clearMovementProgress(movement.id)}
            className="text-xs text-ink-muted underline"
          >
            Clear
          </button>
        </div>
      )}

      {recentResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-coral">Recent results</h2>
          <ul className="mt-1.5 space-y-1.5">
            {recentResults.map((r, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2 text-sm"
              >
                <span>{r.result}</span>
                <span className="text-xs text-ink-muted">
                  {new Date(r.completedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {movement.type === 'progression' && movement.stages && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-coral">Stages</h2>
          <ol className="mt-1.5 space-y-1.5">
            {movement.stages.map((stage, i) => {
              const reached = currentStageIndex >= 0 && i <= currentStageIndex
              const isCurrent = i === currentStageIndex
              return (
                <li key={stage.id}>
                  <button
                    onClick={() => setMovementProgress(movement.id, stage.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isCurrent
                        ? 'bg-coral text-bg'
                        : reached
                          ? 'bg-coral/20'
                          : 'bg-bg-surface hover:bg-bg-raised'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stage.name}</span>
                      <span
                        className={`text-[10px] font-medium ${isCurrent ? 'text-bg/70' : 'text-ink-muted'}`}
                      >
                        {stage.level}
                      </span>
                    </div>
                    <p className={`mt-0.5 text-xs ${isCurrent ? 'text-bg/80' : 'text-ink-muted'}`}>
                      {stage.description}
                    </p>
                    <p className={`mt-0.5 text-xs ${isCurrent ? 'text-bg/70' : 'text-ink-muted'}`}>
                      Graduate: {stage.graduationCriteria}
                    </p>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {movement.type === 'tutorial' && movement.scaling && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-coral">Scaling</h2>
          <ol className="mt-1.5 space-y-1.5">
            {movement.scaling.map((scale) => {
              const isCurrent = current?.value === scale.level
              const reached = currentLevelIndex >= 0 && levelIndex(scale.level) <= currentLevelIndex
              return (
                <li key={scale.level}>
                  <button
                    onClick={() => setMovementProgress(movement.id, scale.level)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isCurrent
                        ? 'bg-coral text-bg'
                        : reached
                          ? 'bg-coral/20'
                          : 'bg-bg-surface hover:bg-bg-raised'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{scale.level}</span>
                    </div>
                    <p className={`mt-0.5 text-xs ${isCurrent ? 'text-bg/80' : 'text-ink-muted'}`}>
                      {scale.description}
                    </p>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {movement.drills && movement.drills.length > 0 && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-coral">Example drills</h2>
          <ul className="mt-1.5 space-y-1.5">
            {movement.drills.map((d) => (
              <li key={d.name} className="rounded-lg bg-bg-surface px-3 py-2 text-sm">
                <span className="font-medium">{d.name}</span>
                <span className="block text-xs text-ink-muted">{d.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {movement.type === 'composite' && movement.requiredMovements && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-coral">Unlocks when you reach</h2>
          <ul className="mt-1.5 space-y-1.5">
            {movement.requiredMovements.map((req) => (
              <li
                key={req.movementId}
                className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2 text-sm"
              >
                <MovementLink id={req.movementId} index={index} />
                <span className="text-xs text-ink-muted">{req.requiredLevel}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
