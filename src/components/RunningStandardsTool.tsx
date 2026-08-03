import { useState } from 'react'
import StandardsDisclaimer from './StandardsDisclaimer'
import { CITATION } from '../lib/runningStandardsData'
import { calculateAgeGrade } from '../lib/runningStandards'
import { parseSeconds } from '../lib/prFormat'
import { useBodyweightProfile } from '../lib/useBodyweightProfile'
import { RUNNING_DISTANCES, type RunningDistance } from '../types/runningStandards'

export default function RunningStandardsTool() {
  const { profile, setProfile } = useBodyweightProfile()
  const [distance, setDistance] = useState<RunningDistance>('5k')
  const [ageInput, setAgeInput] = useState('')
  const [timeInput, setTimeInput] = useState('')

  const age = Number(ageInput)
  const hasAge = ageInput.trim() !== '' && !Number.isNaN(age) && age > 0
  const timeSeconds = parseSeconds(timeInput)
  const hasTime = timeSeconds != null && timeSeconds > 0

  const result = hasAge && hasTime ? calculateAgeGrade(distance, timeSeconds!, age) : null

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <h2 className="text-sm font-semibold text-accent">Running Standards</h2>

      <StandardsDisclaimer
        isPlaceholder={!CITATION}
        summary={
          CITATION
            ? 'WMA age-grading standards — a reference point, not a precise ranking. Tap for details.'
            : 'Placeholder data — not yet sourced. Tap for details.'
        }
        detail={
          CITATION
            ? `Running data uses WMA age-grading standards (${CITATION}). Your age-graded % is your time as a percentage of the world-record standard for your age and gender — a useful reference point, not a precise ranking.`
            : "The age-grading standards below are illustrative only, not the real WMA/Alan Jones age-grading tables. They'll be replaced with the actual published age-grading factor dataset before this tool is accurate. Don't rely on the percentage or tier shown yet."
        }
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
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

        <div>
          <label htmlFor="rn-age" className="text-xs text-ink-muted">
            Age
          </label>
          <input
            id="rn-age"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
            className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="mt-2">
        <label htmlFor="rn-distance" className="text-xs text-ink-muted">
          Distance
        </label>
        <select
          id="rn-distance"
          value={distance}
          onChange={(e) => setDistance(e.target.value as RunningDistance)}
          className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {RUNNING_DISTANCES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label htmlFor="rn-time" className="text-xs text-ink-muted">
          Finish time (mm:ss)
        </label>
        <input
          id="rn-time"
          type="text"
          inputMode="numeric"
          placeholder="25:00"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {result && (
        <div className="mt-3 rounded-lg bg-accent/15 px-3 py-2">
          <p className="text-xs text-ink-muted">Age-graded performance</p>
          <p className="text-xl font-semibold text-accent-light">
            {result.percentage.toFixed(1)}%{' '}
            <span className="text-base font-medium">— {result.tier}</span>
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Your time as a percentage of the age/gender-adjusted world-record standard for this
            distance.
          </p>
        </div>
      )}
    </div>
  )
}
