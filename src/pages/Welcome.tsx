import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../lib/useOnboarding'

interface Section {
  title: string
  body: string
}

const sections: Section[] = [
  {
    title: '🏠 Home',
    body: "Shows today's session once you've started a program, plus quick stats. This is where you'll spend most of your time day-to-day.",
  },
  {
    title: '📚 Library',
    body: "Browse every movement. Tap one to see its details, then tap a stage (or level) to mark that as where you're currently at — it highlights so you can track your progress over time. This is about long-term skill level, not a single workout.",
  },
  {
    title: '📅 Programs',
    body: "Pick a structured multi-week plan and tap \"Start this program.\" It'll show you exactly what to do each day, in order.",
  },
  {
    title: '📈 Progress',
    body: 'See every movement level you\'ve saved, plus a history of every workout you\'ve logged — what you did and when.',
  },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { markSeen } = useOnboarding()

  function handleGetStarted() {
    markSeen()
    navigate('/')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome to LevelWOD</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        A quick guide to how this app works — takes about 30 seconds.
      </p>

      <div className="mt-4 space-y-3">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl bg-bg-surface p-4">
            <h2 className="font-medium">{s.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-coral/15 p-4">
        <h2 className="font-medium text-coral-light">Two different kinds of "progress"</h2>
        <p className="mt-1 text-sm text-ink-muted">
          <strong className="text-ink">Setting your level</strong> (in the Library) is about a
          skill overall — e.g. "I'm currently at Negative Pull-Ups." It doesn't change day to day.
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          <strong className="text-ink">Logging a workout</strong> happens on the day you're
          actually doing — tap the checkmark or type in the box under an exercise, then tap "Mark
          day complete" at the bottom. That's what builds your workout history.
        </p>
      </div>

      <button
        onClick={handleGetStarted}
        className="mt-4 w-full rounded-lg bg-coral py-2.5 text-sm font-medium text-bg"
      >
        Get started
      </button>
    </div>
  )
}
