import { useEffect, useState } from 'react'
import OneRepMaxCalculator from './OneRepMaxCalculator'
import StandardsDisclaimer from './StandardsDisclaimer'
import { CITATION } from '../lib/strengthStandardsData'
import { classifyStrength, STANDARDS_MOVEMENT_IDS, thresholdsFor } from '../lib/strengthStandards'
import { useBodyweightProfile } from '../lib/useBodyweightProfile'
import { usePRHistory } from '../lib/usePRHistory'
import type { Movement } from '../types/movement'
import type { WeightUnit } from '../types/program'
import { STRENGTH_TIERS } from '../types/strengthStandards'

export default function StrengthStandardsTool({
  movementIndex,
}: {
  movementIndex: Map<string, Movement>
}) {
  const { profile, setProfile } = useBodyweightProfile()
  const { historyFor } = usePRHistory()
  const [movementId, setMovementId] = useState(STANDARDS_MOVEMENT_IDS[0])
  const [oneRepMax, setOneRepMax] = useState('')
  const [showCalculator, setShowCalculator] = useState(false)
  const [bodyweightInput, setBodyweightInput] = useState(
    profile.bodyweight > 0 ? profile.bodyweight.toString() : '',
  )

  // Pre-fill from the most recent logged weight PR for this movement.
  useEffect(() => {
    const mostRecent = historyFor(movementId).find((e) => e.metricType === 'weight')
    setOneRepMax(mostRecent ? mostRecent.value.toString() : '')
    setShowCalculator(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movementId])

  function saveBodyweight(value: string) {
    setBodyweightInput(value)
    const n = Number(value)
    if (value.trim() !== '' && !Number.isNaN(n) && n > 0) {
      setProfile({ bodyweight: n })
    }
  }

  function setUnit(unit: WeightUnit) {
    setProfile({ unit })
  }

  const bodyweightNum = Number(bodyweightInput)
  const oneRepMaxNum = Number(oneRepMax)
  const hasBodyweight = bodyweightInput.trim() !== '' && !Number.isNaN(bodyweightNum) && bodyweightNum > 0
  const hasOneRepMax = oneRepMax.trim() !== '' && !Number.isNaN(oneRepMaxNum) && oneRepMaxNum > 0
  const canClassify = hasBodyweight && hasOneRepMax && profile.gender != null

  const result = canClassify
    ? classifyStrength(movementId, oneRepMaxNum, bodyweightNum, profile.gender!)
    : null
  const thresholds = profile.gender ? thresholdsFor(movementId, profile.gender) : null

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <h2 className="text-sm font-semibold text-accent">Strength Standards</h2>

      <StandardsDisclaimer
        isPlaceholder={!CITATION}
        summary={
          CITATION
            ? 'Based on general population data, not CrossFit-specific — tap for details.'
            : 'Placeholder data — not yet sourced. Tap for details.'
        }
        detail={
          CITATION
            ? `These standards are based on general strength training population data (not CrossFit-specific competition data), sourced from ${CITATION}. They're a useful reference point, not a precise ranking — actual percentiles vary by training history, sport background, and the specific population being compared against.`
            : "The thresholds below are illustrative only, not real published strength standards. They'll be replaced with numbers from a cited, reputable source (e.g. ExRx.net or Strength Level) before this tool is accurate. Don't rely on the tier shown yet."
        }
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="ss-bodyweight" className="text-xs text-ink-muted">
            Bodyweight
          </label>
          <div className="mt-1 flex items-center gap-1.5">
            <input
              id="ss-bodyweight"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={bodyweightInput}
              onChange={(e) => saveBodyweight(e.target.value)}
              className="w-full min-w-0 rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="flex shrink-0 gap-1">
              {(['kg', 'lb'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`rounded-full px-2 py-1.5 text-xs font-medium ${
                    profile.unit === u ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-ink-muted">Gender</label>
          <div className="mt-1 flex gap-1.5">
            {(['female', 'male'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setProfile({ gender: g })}
                className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize ${
                  profile.gender === g ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="ss-movement" className="text-xs text-ink-muted">
          Movement
        </label>
        <select
          id="ss-movement"
          value={movementId}
          onChange={(e) => setMovementId(e.target.value)}
          className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {STANDARDS_MOVEMENT_IDS.map((id) => (
            <option key={id} value={id}>
              {movementIndex.get(id)?.name ?? id}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label htmlFor="ss-orm" className="text-xs text-ink-muted">
          1-rep max
        </label>
        <div className="mt-1 flex items-center gap-1.5">
          <input
            id="ss-orm"
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={oneRepMax}
            onChange={(e) => setOneRepMax(e.target.value)}
            className="w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="shrink-0 text-xs text-ink-muted">{profile.unit}</span>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="mt-1 text-xs text-accent-light underline"
        >
          {showCalculator ? 'Hide calculator' : "Don't know it? Estimate it"}
        </button>
      </div>

      {showCalculator && (
        <div className="mt-1.5">
          <OneRepMaxCalculator
            movementIndex={movementIndex}
            movementIds={[movementId]}
            initialMovementId={movementId}
            unit={profile.unit}
            onUseEstimate={(_, estimate) => {
              setOneRepMax(estimate.toString())
              setShowCalculator(false)
            }}
          />
        </div>
      )}

      {!hasBodyweight && (
        <p className="mt-3 text-xs text-ink-muted">Enter your bodyweight to see a comparison.</p>
      )}
      {hasBodyweight && profile.gender == null && (
        <p className="mt-3 text-xs text-ink-muted">Select a gender to see a comparison.</p>
      )}

      {result && (
        <>
          <div className="mt-3 rounded-lg bg-accent/15 px-3 py-2">
            <p className="text-xs text-ink-muted">
              {movementIndex.get(movementId)?.name ?? movementId} — ratio to bodyweight
            </p>
            <p className="text-xl font-semibold text-accent-light">
              {result.ratio.toFixed(2)}x{' '}
              <span className="text-base font-medium">— {result.tier ?? 'Below Beginner'}</span>
            </p>
          </div>

          {thresholds && (
            <table className="mt-3 w-full text-sm">
              <tbody>
                {STRENGTH_TIERS.map((t) => (
                  <tr key={t} className={result.tier === t ? 'bg-accent/10' : undefined}>
                    <td className="py-1 pl-2 text-ink-muted">{t}</td>
                    <td className="py-1 pr-2 text-right font-medium">
                      {thresholds[t].toFixed(2)}x bodyweight
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
