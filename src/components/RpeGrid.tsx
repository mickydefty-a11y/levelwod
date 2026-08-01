const SCALE = Array.from({ length: 10 }, (_, i) => i + 1)

// One tap, done — shown right after "Mark day complete" is tapped, in
// place of that button, so rating (or skipping) is what actually completes
// the day.
export default function RpeGrid({
  onSelect,
  onSkip,
}: {
  onSelect: (rpe: number) => void
  onSkip: () => void
}) {
  return (
    <div className="rounded-lg bg-bg-surface p-3">
      <p className="text-sm font-medium">How did that feel?</p>
      <p className="mt-0.5 text-xs text-ink-muted">1 = very easy · 5 = moderately hard · 10 = maximal effort</p>
      <div className="mt-2.5 grid grid-cols-5 gap-1.5">
        {SCALE.map((n) => (
          <button
            key={n}
            onClick={() => onSelect(n)}
            className="rounded-md bg-bg-raised py-2 text-sm font-medium text-ink hover:bg-white/10"
          >
            {n}
          </button>
        ))}
      </div>
      <button onClick={onSkip} className="mt-2.5 text-xs text-ink-muted underline">
        Skip
      </button>
    </div>
  )
}
