// Pure visual: progress is 0-1, already resolved by the caller (grows
// during inhale, holds steady during a hold, shrinks during exhale).
export default function BreathingCircle({ progress }: { progress: number }) {
  const minScale = 0.55
  const maxScale = 1
  const scale = minScale + (maxScale - minScale) * progress

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      <div
        className="absolute h-56 w-56 rounded-full bg-accent/15"
        style={{ transform: `scale(${scale})` }}
      />
      <div
        className="absolute h-56 w-56 rounded-full border-2 border-accent/50"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}
