import { useEffect, useState } from 'react'
import { loadPrograms } from '../lib/loadData'
import { applyReadinessFallback, recommendProgram } from '../lib/programQuiz'
import type { Program } from '../types/program'
import type {
  QuizAnswers,
  QuizExperience,
  QuizGoal,
  QuizRecommendation,
  StrongerFocus,
} from '../types/programQuiz'

const GOAL_OPTIONS: { id: QuizGoal; label: string }[] = [
  { id: 'just-starting', label: 'Just starting out / general fitness' },
  { id: 'get-stronger', label: 'Get stronger (barbell lifts)' },
  { id: 'gymnastics-skills', label: 'Build gymnastics skills (pull-ups, handstands, muscle-ups)' },
  { id: 'conditioning', label: 'Improve conditioning/engine' },
  { id: 'functional-strongman', label: 'Functional/strongman-style training' },
  { id: 'olympic-weightlifting', label: 'Olympic weightlifting' },
  { id: 'hyrox', label: 'Train for a Hyrox race' },
  { id: 'crossfit-open', label: 'Train for the CrossFit Open' },
]

const EXPERIENCE_OPTIONS: { id: QuizExperience; label: string }[] = [
  { id: 'never-trained', label: 'Never trained before' },
  { id: 'building-basics', label: 'Some experience, still building the basics' },
  { id: 'comfortable-basics', label: 'Comfortable with the basics, want to go further' },
  { id: 'experienced-peak', label: 'Experienced, chasing peak performance' },
]

const STRONGER_FOCUS_OPTIONS: { id: StrongerFocus; label: string }[] = [
  { id: 'balanced', label: 'A balanced program across multiple lifts' },
  { id: 'percentage-method', label: 'A classic percentage-based method I can run long-term' },
  { id: 'squat-specific', label: 'A short, focused block to push my squat specifically' },
]

type Step = 'goal' | 'experience' | 'stronger-focus' | 'readiness' | 'result'

// The Program Recommendation Quiz's full question/result flow, extracted so
// both the standalone /programs/quiz page and onboarding's quiz step render
// the exact same experience — same decision tree, same readiness-check
// handling — the only thing that differs is what happens once someone
// commits to a recommendation (navigate away vs. advance to the next
// onboarding screen), via onSelect.
export default function ProgramQuiz({
  onSelect,
  onSkip,
}: {
  onSelect: (programId: string, reason: string) => void
  // when provided, a "Skip for now" affordance is shown on the goal screen
  onSkip?: () => void
}) {
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [step, setStep] = useState<Step>('goal')
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null)

  useEffect(() => {
    loadPrograms().then(setPrograms)
  }, [])

  function restart() {
    setAnswers({})
    setRecommendation(null)
    setStep('goal')
  }

  function chooseGoal(goal: QuizGoal) {
    setAnswers({ goal })
    setStep('experience')
  }

  function chooseExperience(experience: QuizExperience) {
    const next = { ...answers, experience }
    setAnswers(next)
    if (next.goal === 'get-stronger') {
      setStep('stronger-focus')
    } else {
      finish(next as QuizAnswers)
    }
  }

  function chooseStrongerFocus(strongerFocus: StrongerFocus) {
    const next = { ...answers, strongerFocus }
    setAnswers(next)
    finish(next as QuizAnswers)
  }

  function finish(finalAnswers: QuizAnswers) {
    const rec = recommendProgram(finalAnswers)
    setRecommendation(rec)
    setStep(rec.readinessCheck ? 'readiness' : 'result')
  }

  function confirmReady() {
    setStep('result')
  }

  function notReadyYet() {
    if (!recommendation) return
    setRecommendation(applyReadinessFallback(recommendation))
    setStep('result')
  }

  function programName(id: string): string {
    return programs?.find((p) => p.id === id)?.name ?? id
  }

  return (
    <div>
      {step === 'goal' && (
        <div>
          <h2 className="text-sm font-semibold text-accent">What's your main goal?</h2>
          <ul className="mt-2 space-y-2">
            {GOAL_OPTIONS.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => chooseGoal(o.id)}
                  className="w-full rounded-xl bg-bg-surface p-3 text-left text-sm hover:bg-bg-raised"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
          {onSkip && (
            <button onClick={onSkip} className="mt-3 text-xs text-ink-muted underline">
              Skip for now
            </button>
          )}
        </div>
      )}

      {step === 'experience' && (
        <div>
          <h2 className="text-sm font-semibold text-accent">What's your experience level?</h2>
          <ul className="mt-2 space-y-2">
            {EXPERIENCE_OPTIONS.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => chooseExperience(o.id)}
                  className="w-full rounded-xl bg-bg-surface p-3 text-left text-sm hover:bg-bg-raised"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => setStep('goal')} className="mt-3 text-xs text-ink-muted underline">
            ← Back
          </button>
        </div>
      )}

      {step === 'stronger-focus' && (
        <div>
          <h2 className="text-sm font-semibold text-accent">What kind of strength program?</h2>
          <ul className="mt-2 space-y-2">
            {STRONGER_FOCUS_OPTIONS.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => chooseStrongerFocus(o.id)}
                  className="w-full rounded-xl bg-bg-surface p-3 text-left text-sm hover:bg-bg-raised"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setStep('experience')}
            className="mt-3 text-xs text-ink-muted underline"
          >
            ← Back
          </button>
        </div>
      )}

      {step === 'readiness' && recommendation?.readinessCheck && (
        <div>
          <div className="rounded-xl bg-bg-surface p-4">
            <p className="text-sm leading-relaxed">{recommendation.readinessCheck.prompt}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={confirmReady}
                className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium text-bg"
              >
                Yes
              </button>
              <button
                onClick={notReadyYet}
                className="flex-1 rounded-lg bg-bg-raised py-2 text-sm text-ink-muted"
              >
                Not yet
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && recommendation && (
        <div>
          <h2 className="text-sm font-semibold text-accent">Recommended for you</h2>
          <div className="mt-2 rounded-xl bg-accent/15 p-4">
            <h3 className="text-lg font-semibold text-accent-light">
              {programName(recommendation.programId)}
            </h3>
            <p className="mt-1 text-sm leading-relaxed">{recommendation.reason}</p>
            <button
              onClick={() => onSelect(recommendation.programId, recommendation.briefReason)}
              className="mt-3 block w-full rounded-lg bg-accent py-2 text-center text-sm font-medium text-bg"
            >
              View program
            </button>
          </div>

          {recommendation.alternatives.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-accent">Or consider</h2>
              <ul className="mt-2 space-y-2">
                {recommendation.alternatives.map((alt) => (
                  <li key={alt.programId}>
                    <button
                      onClick={() => onSelect(alt.programId, alt.reason)}
                      className="block w-full rounded-xl bg-bg-surface p-3 text-left hover:bg-bg-raised"
                    >
                      <p className="text-sm font-medium">{programName(alt.programId)}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{alt.reason}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={restart} className="mt-4 text-xs text-ink-muted underline">
            Retake the quiz
          </button>
        </div>
      )}
    </div>
  )
}
