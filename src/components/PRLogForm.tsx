import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isTimeMetric, parseSeconds } from '../lib/prFormat'
import { usePRHistory } from '../lib/usePRHistory'
import { METRIC_LABELS, METRIC_UNITS, type MetricType } from '../types/pr'

const METRIC_ORDER: MetricType[] = ['weight', 'time', 'reps', 'holdTime', 'distance']

export default function PRLogForm({
  movementId,
  defaultMetricType,
  label,
  programContext = null,
  onSaved,
  onCancel,
}: {
  movementId: string
  defaultMetricType?: MetricType
  label?: string
  programContext?: string | null
  onSaved?: () => void
  onCancel?: () => void
}) {
  const { addEntry, lastUnitFor } = usePRHistory()
  const [metricType, setMetricType] = useState<MetricType>(defaultMetricType ?? 'weight')
  const [unit, setUnit] = useState(
    () => lastUnitFor(movementId, metricType) ?? METRIC_UNITS[metricType][0],
  )
  const [valueInput, setValueInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [justSaved, setJustSaved] = useState(false)

  function changeMetric(next: MetricType) {
    setMetricType(next)
    setUnit(lastUnitFor(movementId, next) ?? METRIC_UNITS[next][0])
    setError(null)
  }

  function save() {
    const value = isTimeMetric(metricType) ? parseSeconds(valueInput) : Number(valueInput)
    if (value == null || Number.isNaN(value) || value <= 0) {
      setError(isTimeMetric(metricType) ? 'Enter a time like 12:34' : 'Enter a number')
      return
    }
    addEntry({
      movementId,
      metricType,
      value,
      unit,
      date: new Date().toISOString().slice(0, 10),
      programContext,
      notes: null,
    })
    setJustSaved(true)
  }

  if (justSaved) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-bg-raised p-3">
        <p className="text-sm text-ink">PR saved. Want to share it?</p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/progress/share?template=pr"
            onClick={() => onSaved?.()}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg"
          >
            Share
          </Link>
          <button onClick={() => onSaved?.()} className="text-xs text-ink-muted underline">
            No thanks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-bg-raised p-3">
      {label && <p className="text-xs font-medium text-ink">{label}</p>}

      {!defaultMetricType && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {METRIC_ORDER.map((m) => (
            <button
              key={m}
              onClick={() => changeMetric(m)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                metricType === m ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
              }`}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <input
          type={isTimeMetric(metricType) ? 'text' : 'number'}
          inputMode={isTimeMetric(metricType) ? 'text' : 'decimal'}
          value={valueInput}
          onChange={(e) => {
            setValueInput(e.target.value)
            setError(null)
          }}
          placeholder={isTimeMetric(metricType) ? 'mm:ss' : '0'}
          autoFocus
          className="w-24 rounded-md bg-bg-surface px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {METRIC_UNITS[metricType].length > 1 && (
          <div className="flex gap-1">
            {METRIC_UNITS[metricType].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                  unit === u ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        )}
        {METRIC_UNITS[metricType].length === 1 && !isTimeMetric(metricType) && (
          <span className="text-xs text-ink-muted">{unit}</span>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button onClick={save} className="flex-1 rounded-md bg-accent py-2 text-sm font-medium text-bg">
          Save
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 rounded-md bg-bg-surface py-2 text-sm text-ink-muted"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
