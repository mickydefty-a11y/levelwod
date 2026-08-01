export default function CoachsBriefBanner({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null

  return (
    <div className="rounded-lg bg-accent/10 px-3 py-2.5">
      {lines.map((line, i) => (
        <p key={i} className={i === 0 ? 'text-sm text-ink' : 'mt-1 text-xs text-ink-muted'}>
          {line}
        </p>
      ))}
    </div>
  )
}
