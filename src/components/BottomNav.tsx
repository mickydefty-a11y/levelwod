import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const items: NavItem[] = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/library',
    label: 'Library',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 19.5V5.5A1.5 1.5 0 0 1 5.5 4H9v16H5.5A1.5 1.5 0 0 1 4 19.5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 4h5.5A1.5 1.5 0 0 1 16 5.5v14a1.5 1.5 0 0 1-1.5 1.5H9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 7l4 1v12l-4-1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/programs',
    label: 'Programs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="4" y="5" width="16" height="15" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 20V13M11 20V8M18 20v-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 9l6-5 5 4 6-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
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
              <span className="h-6 w-6">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
