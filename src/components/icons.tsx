import type { SVGProps } from 'react'

// Shared monochrome icon set — outline style matching the app icon and
// BottomNav's existing nav glyphs (24x24, stroke=currentColor) so every
// icon in the app draws from one consistent, conservative "lime on black"
// visual language instead of full-color platform emoji.
type IconProps = SVGProps<SVGSVGElement>

const strokeProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
} as const

export function HomeIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LibraryIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M4 19.5V5.5A1.5 1.5 0 0 1 5.5 4H9v16H5.5A1.5 1.5 0 0 1 4 19.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4h5.5A1.5 1.5 0 0 1 16 5.5v14a1.5 1.5 0 0 1-1.5 1.5H9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7l4 1v12l-4-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ProgramsIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <rect x="4" y="5" width="16" height="15" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <circle cx="12" cy="13" r="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13V9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 2h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M4 20V13M11 20V8M18 20v-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9l6-5 5 4 6-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NoteIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v4h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12.5h6M9 16h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v3.5M9 21h6M9.5 21c-.3-2.2.7-3.5 2.5-3.5s2.8 1.3 2.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  )
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MedalIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M8 3l2 6M16 3l-2 6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 12.3l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2-1.45-1.4 2-.3.9-1.8Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CalculatorIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="7.5" y="5.5" width="9" height="3.5" rx="0.5" strokeLinecap="round" strokeLinejoin="round" />
      {[13, 16.3].map((cy) =>
        [8.5, 12, 15.5].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.75" fill="currentColor" stroke="none" />
        )),
      )}
    </svg>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SpeakerOnIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M4 10v4h4l5 4V6L8 10H4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 9a4.5 4.5 0 0 1 0 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 7a8 8 0 0 1 0 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SpeakerOffIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M4 10v4h4l5 4V6L8 10H4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WarningIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path d="M12 4 3 20h18L12 4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10.5v3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LightningIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <path
        d="M12 6.5c-1.5-1-3.5-1.5-6-1.5v13c2.5 0 4.5.5 6 1.5 1.5-1 3.5-1.5 6-1.5V5c-2.5 0-4.5.5-6 1.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 6.5V19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12.3l2.5 2.5L16 9.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
