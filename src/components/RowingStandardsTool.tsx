import { useState } from 'react'
import StandardsDisclaimer from './StandardsDisclaimer'
import { CITATION } from '../lib/rowingStandardsData'
import { classifyRowingTime } from '../lib/rowingStandards'
import { formatSeconds, parseSeconds } from '../lib/prFormat'
import { useBodyweightProfile } from '../lib/useBodyweightProfile'
import {
  ROWING_AGE_CATEGORIES,
  ROWING_PIECES,
  type RowingAgeCategory,
  type RowingPiece,
  type WeightCategory,
} from '../types/rowingStandards'

export default function RowingStandardsTool() {
  const { profile, setProfile } = useBodyweightProfile()
  const [piece, setPiece] = useState<RowingPiece>('2k')
  const [ageCategory, setAgeCategory] = useState<RowingAgeCategory>('30-39')
  const [weightCategory, setWeightCategory] = useState<WeightCategory>('heavyweight')
  const [timeInput, setTimeInput] = useState('')

  const timeSeconds = parseSeconds(timeInput)
  const hasTime = timeSeconds != null && timeSeconds > 0
  const result =
    hasTime && profile.gender
      ? classifyRowingTime(piece, timeSeconds!, ageCategory, weightCategory, profile.gender)
      : null

  return (
    <div className="rounded-xl bg-bg-surface p-4">
      <h2 className="text-sm font-semibold text-accent">Rowing Standards</h2>

      <StandardsDisclaimer
        isPlaceholder={!CITATION}
        summary={
          CITATION
            ? "Concept2 logbook data — skews toward competitive rowers. Tap for details."
            : 'Placeholder data — not yet sourced. Tap for details.'
        }
        detail={
          CITATION
            ? `Rowing data sourced from ${CITATION}. People who submit times to Concept2's logbook skew toward more serious, competitive rowers — the 50th percentile here represents a higher fitness level than the general population.`
            : "The percentile times below are illustrative only, not real Concept2 rankings data. They'll be replaced with numbers pulled from Concept2's Online Rankings before this tool is accurate. Don't rely on the percentile shown yet. (Once sourced, remember: logbook submitters skew toward serious, competitive rowers — the 50th percentile represents a higher fitness level than the general population.)"
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
          <label className="text-xs text-ink-muted">Weight category</label>
          <div className="mt-1 flex gap-1.5">
            {(['lightweight', 'heavyweight'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWeightCategory(w)}
                className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize ${
                  weightCategory === w ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="rs-age" className="text-xs text-ink-muted">
          Age category
        </label>
        <select
          id="rs-age"
          value={ageCategory}
          onChange={(e) => setAgeCategory(e.target.value as RowingAgeCategory)}
          className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {ROWING_AGE_CATEGORIES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label htmlFor="rs-piece" className="text-xs text-ink-muted">
          Piece
        </label>
        <select
          id="rs-piece"
          value={piece}
          onChange={(e) => setPiece(e.target.value as RowingPiece)}
          className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {ROWING_PIECES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label htmlFor="rs-time" className="text-xs text-ink-muted">
          Time (mm:ss)
        </label>
        <input
          id="rs-time"
          type="text"
          inputMode="numeric"
          placeholder="7:30"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="mt-1 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {hasTime && profile.gender == null && (
        <p className="mt-3 text-xs text-ink-muted">Select a gender to see a comparison.</p>
      )}

      {result && (
        <>
          <div className="mt-3 rounded-lg bg-accent/15 px-3 py-2">
            <p className="text-xs text-ink-muted">Estimated percentile</p>
            <p className="text-xl font-semibold text-accent-light">
              {result.percentile >= 99 ? '99th+' : `${result.percentile}th`}
            </p>
          </div>

          <table className="mt-3 w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 pl-2 text-ink-muted">90th percentile</td>
                <td className="py-1 pr-2 text-right font-medium">
                  {formatSeconds(result.reference.p90)}
                </td>
              </tr>
              <tr>
                <td className="py-1 pl-2 text-ink-muted">75th percentile</td>
                <td className="py-1 pr-2 text-right font-medium">
                  {formatSeconds(result.reference.p75)}
                </td>
              </tr>
              <tr>
                <td className="py-1 pl-2 text-ink-muted">50th percentile</td>
                <td className="py-1 pr-2 text-right font-medium">
                  {formatSeconds(result.reference.p50)}
                </td>
              </tr>
              <tr>
                <td className="py-1 pl-2 text-ink-muted">25th percentile</td>
                <td className="py-1 pr-2 text-right font-medium">
                  {formatSeconds(result.reference.p25)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
