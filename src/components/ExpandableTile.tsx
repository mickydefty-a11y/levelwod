import { Link } from 'react-router-dom'
import type { ComponentType, SVGProps } from 'react'

// Reusable summary-first tile: icon + title + optional one-line subtitle,
// tapping through to a dedicated screen rather than expanding inline —
// used everywhere a section would otherwise dump its full content onto the
// page it's listed on (Benchmark WODs, Standards & Percentiles, the
// Progress dashboard). Keeping every collapsed section looking and
// behaving the same matters more than any one of them being novel.
export default function ExpandableTile({
  icon: Icon,
  title,
  subtitle,
  to,
  variant = 'row',
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  subtitle?: string
  to: string
  // 'row': full-width, icon + title/subtitle + arrow (lists like Programs,
  // the Standards entry point). 'grid': compact icon-forward square, no
  // subtitle or arrow — for the Progress dashboard's 2-column tile grid.
  variant?: 'row' | 'grid'
}) {
  if (variant === 'grid') {
    return (
      <Link
        to={to}
        className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-bg-surface p-4 text-center hover:bg-bg-raised"
      >
        <Icon className="h-7 w-7 text-accent" strokeWidth={1.75} aria-hidden="true" />
        <span className="text-xs font-medium">{title}</span>
      </Link>
    )
  }

  return (
    <Link to={to} className="flex items-center gap-3 rounded-xl bg-bg-surface p-4 hover:bg-bg-raised">
      <Icon className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        {subtitle && <span className="mt-0.5 block text-xs text-ink-muted">{subtitle}</span>}
      </span>
      <span className="shrink-0 text-ink-muted">→</span>
    </Link>
  )
}
