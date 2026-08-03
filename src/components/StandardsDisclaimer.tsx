import { useState } from 'react'

// Shared by all three Standards tools — keeps the full honesty-commitment
// text available (never removed), just collapsed behind a one-line summary
// by default instead of a permanent paragraph block on every tool at once.
export default function StandardsDisclaimer({
  isPlaceholder,
  summary,
  detail,
}: {
  isPlaceholder: boolean
  summary: string
  detail: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`mt-2 rounded-lg border px-3 py-2 ${
        isPlaceholder ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-2 text-left"
        aria-expanded={expanded}
      >
        <span className={`text-xs leading-relaxed ${isPlaceholder ? 'text-yellow-200' : 'text-ink-muted'}`}>
          {isPlaceholder && <span className="font-semibold">⚠️ </span>}
          {summary}
        </span>
        <span className="shrink-0 text-xs text-ink-muted">{expanded ? '▲' : 'ⓘ'}</span>
      </button>
      {expanded && (
        <p
          className={`mt-1.5 border-t pt-1.5 text-xs leading-relaxed ${
            isPlaceholder ? 'border-yellow-500/20 text-yellow-200/90' : 'border-white/10 text-ink-muted'
          }`}
        >
          {detail}
        </p>
      )}
    </div>
  )
}
