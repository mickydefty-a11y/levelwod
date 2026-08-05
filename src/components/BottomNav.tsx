import { NavLink } from 'react-router-dom'
import { ClockIcon, HomeIcon, LibraryIcon, ProgramsIcon, TrendingUpIcon } from './icons'
import type { ComponentType, SVGProps } from 'react'

interface NavItem {
  to: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

const items: NavItem[] = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/library', label: 'Library', Icon: LibraryIcon },
  { to: '/programs', label: 'Programs', Icon: ProgramsIcon },
  { to: '/timer', label: 'Timer', Icon: ClockIcon },
  { to: '/progress', label: 'Progress', Icon: TrendingUpIcon },
]

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-bg-surface/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-ink-muted'
                }`
              }
            >
              <item.Icon className="h-6 w-6" strokeWidth={2} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
