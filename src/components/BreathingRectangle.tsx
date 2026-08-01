// Traces the full rectangle across two breath cycles: a short (vertical)
// edge on each inhale, a long (horizontal) edge on each exhale — matching
// how rectangle breathing is actually practiced (tracing around a window
// or door), rather than bouncing along a single edge forever.
const LEFT = 20
const RIGHT = 220
const TOP = 30
const BOTTOM = 130

const EDGES = [
  { from: [RIGHT, BOTTOM], to: [RIGHT, TOP] }, // short: right side, going up (inhale)
  { from: [RIGHT, TOP], to: [LEFT, TOP] }, // long: top, going left (exhale)
  { from: [LEFT, TOP], to: [LEFT, BOTTOM] }, // short: left side, going down (inhale)
  { from: [LEFT, BOTTOM], to: [RIGHT, BOTTOM] }, // long: bottom, going right (exhale)
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function BreathingRectangle({
  edgeCount,
  progress,
}: {
  edgeCount: number
  progress: number
}) {
  const edge = EDGES[edgeCount % EDGES.length]
  const [x1, y1] = edge.from
  const [x2, y2] = edge.to
  const dotX = lerp(x1, x2, progress)
  const dotY = lerp(y1, y2, progress)

  return (
    <svg viewBox="0 0 240 160" className="h-64 w-64">
      <rect
        x={LEFT}
        y={TOP}
        width={RIGHT - LEFT}
        height={BOTTOM - TOP}
        fill="none"
        stroke="currentColor"
        className="text-white/15"
        strokeWidth={3}
      />
      <line
        x1={x1}
        y1={y1}
        x2={dotX}
        y2={dotY}
        stroke="currentColor"
        className="text-accent"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={dotX} cy={dotY} r={7} className="fill-accent" />
    </svg>
  )
}
