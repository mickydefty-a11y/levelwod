import { useState } from 'react'
import { Link } from 'react-router-dom'
import CantDoThis from './CantDoThis'
import PRLogForm from './PRLogForm'
import { findStage } from '../lib/loadData'
import { calculateLoadWeight, type LoadContext } from '../lib/trainingMax'
import { timerConfigToPath } from '../lib/timerUrl'
import { useSubstitutions } from '../lib/useSubstitutions'
import type { Movement } from '../types/movement'
import type { ProgramBlock } from '../types/program'

const blockTypeStyle: Record<ProgramBlock['blockType'], string> = {
  warmup: 'bg-white/10 text-ink-muted',
  mobility: 'bg-white/10 text-ink-muted',
  skill: 'bg-accent/20 text-accent-light',
  strength: 'bg-accent/20 text-accent-light',
  metcon: 'bg-accent/30 text-accent-light',
  cooldown: 'bg-white/10 text-ink-muted',
}

export default function ProgramBlockRow({
  block,
  index,
  logValue,
  onLogChange,
  done,
  onToggleDone,
  programContext,
  loadContext,
}: {
  block: ProgramBlock
  index: Map<string, Movement>
  // when provided, renders an editable "what did you actually do" input and
  // a done checkmark — used only for the day the user currently has open
  logValue?: string
  onLogChange?: (value: string) => void
  done?: boolean
  onToggleDone?: () => void
  // "{programId} / week {N} / day {N}" — only needed alongside onLogChange,
  // used to tag PR entries logged from this block with where they came from
  programContext?: string | null
  // resolved Training Max for percentage-based programs; omitted entirely
  // for every other program, so this has no effect on them
  loadContext?: LoadContext | null
}) {
  const movement = index.get(block.movementId)
  const stage = findStage(movement, block.targetStageId)
  const [showPRForm, setShowPRForm] = useState(false)
  const { activeSubstituteFor } = useSubstitutions()
  const substituteId = movement ? activeSubstituteFor(movement.id) : null
  const displayMovement = (substituteId && index.get(substituteId)) || movement

  const base =
    block.loadConfig?.basedOn === 'oneRepMax'
      ? loadContext?.oneRepMax[block.movementId]
      : loadContext?.trainingMax[block.movementId]
  const loadWeight =
    block.loadConfig && base != null ? calculateLoadWeight(block.loadConfig, base, loadContext!.unit) : null

  return (
    <li className={`rounded-lg px-3 py-2 ${done ? 'bg-accent/15' : 'bg-bg-surface'}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onToggleDone && (
            <button
              onClick={onToggleDone}
              aria-label={done ? 'Mark not done' : 'Mark done'}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors ${
                done ? 'border-accent bg-accent text-bg' : 'border-ink-muted text-transparent'
              }`}
            >
              ✓
            </button>
          )}
          <Link to={`/library/${displayMovement?.id ?? block.movementId}`} className="text-sm font-medium">
            {displayMovement?.name ?? block.movementId}
          </Link>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${blockTypeStyle[block.blockType]}`}
        >
          {block.blockType}
        </span>
      </div>
      {stage && !substituteId && <p className="mt-0.5 text-xs text-accent-light">{stage.name}</p>}
      <p className="mt-1 text-xs text-ink-muted">
        {loadWeight != null && (
          <span className="font-semibold text-ink">
            {loadWeight}
            {loadContext!.unit}{' '}
          </span>
        )}
        {block.prescription}
      </p>
      {block.notes && <p className="mt-1 text-xs italic text-ink-muted">{block.notes}</p>}
      {movement && <CantDoThis movement={movement} movementIndex={index} />}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {block.timerConfig && (
          <Link
            to={timerConfigToPath(block.timerConfig, displayMovement?.name)}
            className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-light"
          >
            ⏱ Start Timer
          </Link>
        )}
        {block.logPrompt && onLogChange && !showPRForm && (
          <button
            onClick={() => setShowPRForm(true)}
            className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-light"
          >
            🏆 Log {block.logPrompt.suggestedLabel}
          </button>
        )}
      </div>

      {showPRForm && block.logPrompt && (
        <div className="mt-2">
          <PRLogForm
            movementId={block.movementId}
            defaultMetricType={block.logPrompt.metricType}
            label={block.logPrompt.suggestedLabel}
            programContext={programContext ?? null}
            onSaved={() => setShowPRForm(false)}
            onCancel={() => setShowPRForm(false)}
          />
        </div>
      )}

      {onLogChange && (
        <input
          type="text"
          value={logValue ?? ''}
          onChange={(e) => onLogChange(e.target.value)}
          placeholder="Log what you actually did (optional) — e.g. 135lb x 5, or 2:15"
          className="mt-2 w-full rounded-md bg-bg-raised px-2 py-1.5 text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      )}
    </li>
  )
}
