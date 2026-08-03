import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BackLink from '../components/BackLink'
import { buildStatsCardOptions } from '../lib/statsCardData'
import { canvasToBlob, shareOrDownloadImage } from '../lib/shareImage'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import { renderStatsCard } from '../lib/statsCardRender'
import { useProgramHistory } from '../lib/useProgramHistory'
import { useProgress } from '../lib/useProgress'
import { usePRHistory } from '../lib/usePRHistory'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { StatsCardType } from '../types/statsCard'
import type { Movement } from '../types/movement'

const VALID_TYPES: StatsCardType[] = ['streak', 'pr', 'journey']

export default function ShareCard() {
  const [searchParams] = useSearchParams()
  const { log } = useWorkoutLog()
  const { completed } = useProgramHistory()
  const { progress } = useProgress()
  const { historyFor, allEntries } = usePRHistory()
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [selected, setSelected] = useState<StatsCardType | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = useMemo(
    () => (movements ? buildMovementIndex(movements) : null),
    [movements],
  )

  const options = useMemo(() => {
    if (!movements || !movementIndex) return null
    return buildStatsCardOptions({
      log,
      completed,
      movements,
      progress,
      prEntries: allEntries(),
      historyForMovement: historyFor,
      movementName: (id) => movementIndex.get(id)?.name ?? id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log, completed, movements, movementIndex, progress, allEntries, historyFor])

  // If a contextual prompt linked here with a specific card in mind (e.g.
  // right after a new PR), honor it as long as that card actually has data;
  // otherwise fall back to the first enabled template.
  useEffect(() => {
    if (selected || !options) return
    const requested = searchParams.get('template') as StatsCardType | null
    const requestedOption = requested && VALID_TYPES.includes(requested)
      ? options.find((o) => o.type === requested)
      : undefined
    setSelected(
      (requestedOption?.data ? requestedOption.type : options.find((o) => o.data)?.type ?? options[0].type) as StatsCardType,
    )
  }, [options, selected, searchParams])

  const current = options?.find((o) => o.type === selected) ?? null

  useEffect(() => {
    if (!current?.data || !canvasRef.current) return
    setStatus(null)
    renderStatsCard(canvasRef.current, current.data)
  }, [current])

  async function handleShare() {
    if (!canvasRef.current) return
    setStatus(null)
    const blob = await canvasToBlob(canvasRef.current)
    const result = await shareOrDownloadImage(blob, `levelwod-${selected}.png`)
    if (result === 'downloaded') setStatus('Image saved.')
    if (result === 'shared') setStatus('Shared!')
  }

  return (
    <div>
      <BackLink to="/progress" label="Progress" />

      <h1 className="mt-2 text-2xl font-semibold">Share your progress</h1>
      <p className="mt-1 text-sm text-ink-muted">
        A quick image built from your real stats — pick what to share, preview it, then send it
        wherever you like.
      </p>

      {!options ? (
        <p className="mt-6 text-ink-muted">Loading…</p>
      ) : (
        <>
          <div className="mt-4 flex gap-1.5">
            {options.map((o) => (
              <button
                key={o.type}
                onClick={() => o.data && setSelected(o.type)}
                disabled={!o.data}
                className={`flex-1 rounded-full px-2 py-2 text-xs font-medium ${
                  selected === o.type && o.data
                    ? 'bg-accent text-bg'
                    : o.data
                      ? 'bg-bg-surface text-ink-muted'
                      : 'cursor-not-allowed bg-bg-surface/50 text-ink-muted/50'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {current?.disabledReason && (
            <p className="mt-2 text-xs text-ink-muted">{current.disabledReason}</p>
          )}

          {current?.data && (
            <>
              <div className="mt-4 overflow-hidden rounded-xl bg-bg-surface">
                <canvas ref={canvasRef} className="w-full" />
              </div>

              <button
                onClick={handleShare}
                className="mt-3 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-bg"
              >
                Share / Save image
              </button>
              {status && <p className="mt-2 text-xs text-accent-light">{status}</p>}
            </>
          )}
        </>
      )}
    </div>
  )
}
