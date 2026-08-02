import { Link } from 'react-router-dom'

interface BackLinkProps {
  label: string
  to?: string
  onClick?: () => void
}

const className =
  '-ml-2 inline-flex items-center gap-1 rounded-lg py-2.5 pl-2 pr-3 text-base font-semibold text-ink-muted transition-colors active:bg-white/5 active:text-ink'

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5 shrink-0">
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Shared back-navigation control: a large tap target (44px+) placed by the
// page itself, below <main>'s safe-area-aware top padding — never bleeds
// under the status bar and never a fiddly small target.
export default function BackLink({ label, to, onClick }: BackLinkProps) {
  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        <ChevronLeft />
        {label}
      </button>
    )
  }

  return (
    <Link to={to!} className={className}>
      <ChevronLeft />
      {label}
    </Link>
  )
}
