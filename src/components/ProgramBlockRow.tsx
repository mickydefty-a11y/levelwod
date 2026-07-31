import { Link } from 'react-router-dom'
import { findStage } from '../lib/loadData'
import type { Movement } from '../types/movement'
import type { ProgramBlock } from '../types/program'

const blockTypeStyle: Record<ProgramBlock['blockType'], string> = {
  warmup: 'bg-white/10 text-ink-muted',
  mobility: 'bg-white/10 text-ink-muted',
  skill: 'bg-coral/20 text-coral-light',
  strength: 'bg-coral/20 text-coral-light',
  metcon: 'bg-coral/30 text-coral-light',
  cooldown: 'bg-white/10 text-ink-muted',
}

export default function ProgramBlockRow({
  block,
  index,
  logValue,
  onLogChange,
  done,
  onToggleDone,
}: {
  block: ProgramBlock
  index: Map<string, Movement>
  // when provided, renders an editable "what did you actually do" input and
  // a done checkmark — used only for the day the user currently has open
  logValue?: string
  onLogChange?: (value: string) => void
  done?: boolean
  onToggleDone?: () => void
}) {
  const movement = index.get(block.movementId)
  const stage = findStage(movement, block.targetStageId)

  return (
    <li className={`rounded-lg px-3 py-2 ${done ? 'bg-coral/15' : 'bg-bg-surface'}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onToggleDone && (
            <button
              onClick={onToggleDone}
              aria-label={done ? 'Mark not done' : 'Mark done'}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors ${
                done ? 'border-coral bg-coral text-bg' : 'border-ink-muted text-transparent'
              }`}
            >
              ✓
            </button>
          )}
          <Link to={`/library/${block.movementId}`} className="text-sm font-medium">
            {movement?.name ?? block.movementId}
          </Link>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${blockTypeStyle[block.blockType]}`}
        >
          {block.blockType}
        </span>
      </div>
      {stage && <p className="mt-0.5 text-xs text-coral-light">{stage.name}</p>}
      <p className="mt-1 text-xs text-ink-muted">{block.prescription}</p>
      {block.notes && <p className="mt-1 text-xs italic text-ink-muted">{block.notes}</p>}
      {onLogChange && (
        <input
          type="text"
          value={logValue ?? ''}
          onChange={(e) => onLogChange(e.target.value)}
          placeholder="Log what you actually did (optional) — e.g. 135lb x 5, or 2:15"
          className="mt-2 w-full rounded-md bg-bg-raised px-2 py-1.5 text-xs text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-1 focus:ring-coral"
        />
      )}
    </li>
  )
}
