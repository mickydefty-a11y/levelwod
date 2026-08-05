import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OneRepMaxForm from '../components/OneRepMaxForm'
import ProgramQuiz from '../components/ProgramQuiz'
import { HomeIcon, LibraryIcon, LightningIcon } from '../components/icons'
import { buildMovementIndex, loadMovements, loadPrograms } from '../lib/loadData'
import { useActiveProgram } from '../lib/useActiveProgram'
import { useBodyweightProfile } from '../lib/useBodyweightProfile'
import type { Movement } from '../types/movement'
import type { Program } from '../types/program'
import type { Gender } from '../types/strengthStandards'
import type { ComponentType, SVGProps } from 'react'

type Step = 'welcome' | 'profile' | 'quiz' | 'onerepmax' | 'tour'

interface PendingProgram {
  programId: string
  reason: string
}

const TOUR_CARDS: { icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; body: string }[] = [
  {
    icon: HomeIcon,
    title: 'Home',
    body: "This is your Home screen — today's session and your streak live here.",
  },
  {
    icon: LibraryIcon,
    title: 'Movement Library',
    body: 'Browse the full Movement Library anytime, filtered by category and level.',
  },
  {
    icon: LightningIcon,
    title: "Today's WOD",
    body: "Try today's generated WOD when you want something extra.",
  },
]

export default function OnboardingFlow() {
  const navigate = useNavigate()
  const { setProfile } = useBodyweightProfile()
  const { startProgram } = useActiveProgram()
  const [step, setStep] = useState<Step>('welcome')
  const [programs, setPrograms] = useState<Program[] | null>(null)
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [pending, setPending] = useState<PendingProgram | null>(null)
  const [tourIndex, setTourIndex] = useState(0)

  const [nameInput, setNameInput] = useState('')
  const [ageInput, setAgeInput] = useState('')
  const [bodyweightInput, setBodyweightInput] = useState('')
  const [genderChoice, setGenderChoice] = useState<Gender | 'prefer-not-to-say' | null>(null)
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')

  useEffect(() => {
    loadPrograms().then(setPrograms)
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = movements ? buildMovementIndex(movements) : null

  function finishOnboarding() {
    setProfile({ onboardingCompletedAt: new Date().toISOString().slice(0, 10) })
    navigate('/')
  }

  function saveProfileScreen() {
    setProfile({
      name: nameInput.trim() || null,
      age: ageInput.trim() ? Number(ageInput) : null,
      bodyweight: bodyweightInput.trim() ? Number(bodyweightInput) : 0,
      gender: genderChoice === 'prefer-not-to-say' ? null : genderChoice,
      unit,
    })
    setStep('quiz')
  }

  function handleQuizSelect(programId: string, reason: string) {
    const program = programs?.find((p) => p.id === programId)
    if (program?.requiresInput?.oneRepMaxInputs?.length) {
      setPending({ programId, reason })
      setStep('onerepmax')
    } else {
      startProgram(programId, reason)
      setStep('tour')
    }
  }

  function handleOneRepMaxDone() {
    if (pending) startProgram(pending.programId, pending.reason)
    setStep('tour')
  }

  return (
    <div>
      {step === 'welcome' && (
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          <img src="/icons/icon-192.png" alt="" className="h-20 w-20 rounded-2xl" />
          <h1 className="mt-4 text-2xl font-semibold">LevelWOD</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            Your coach in your pocket — movement progressions, structured programs, and everything
            you need to train smart.
          </p>
          <button
            onClick={() => setStep('profile')}
            className="mt-6 w-full max-w-xs rounded-lg bg-accent py-2.5 text-sm font-medium text-bg"
          >
            Get Started
          </button>
        </div>
      )}

      {step === 'profile' && (
        <div>
          <h1 className="text-2xl font-semibold">A little about you</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Every field here is optional — skip anything you'd rather not answer now.
          </p>

          <div className="mt-4">
            <label htmlFor="ob-name" className="text-xs text-ink-muted">
              Name
            </label>
            <input
              id="ob-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-md bg-bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="mt-3">
            <label className="text-xs text-ink-muted">Gender</label>
            <div className="mt-1 flex gap-1.5">
              {(
                [
                  { id: 'female', label: 'Female' },
                  { id: 'male', label: 'Male' },
                  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenderChoice(g.id)}
                  className={`flex-1 rounded-md px-2 py-2 text-xs font-medium ${
                    genderChoice === g.id ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="ob-age" className="text-xs text-ink-muted">
                Age
              </label>
              <input
                id="ob-age"
                type="number"
                inputMode="numeric"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
                placeholder="Optional"
                className="mt-1 w-full rounded-md bg-bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="ob-bodyweight" className="text-xs text-ink-muted">
                Bodyweight
              </label>
              <div className="mt-1 flex items-center gap-1.5">
                <input
                  id="ob-bodyweight"
                  type="number"
                  inputMode="decimal"
                  value={bodyweightInput}
                  onChange={(e) => setBodyweightInput(e.target.value)}
                  placeholder="Optional"
                  className="w-full min-w-0 rounded-md bg-bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <div className="flex shrink-0 gap-1">
                  {(['kg', 'lb'] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`rounded-full px-2 py-2 text-xs font-medium ${
                        unit === u ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={saveProfileScreen}
              className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-bg"
            >
              Continue
            </button>
            <button
              onClick={() => setStep('quiz')}
              className="flex-1 rounded-lg bg-bg-surface py-2.5 text-sm text-ink-muted"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div>
          <h1 className="text-2xl font-semibold">Find your program</h1>
          <p className="mt-1 text-sm text-ink-muted">
            A couple of quick questions to point you at the right program to start with.
          </p>
          <div className="mt-4">
            <ProgramQuiz onSelect={handleQuizSelect} onSkip={() => setStep('tour')} />
          </div>
        </div>
      )}

      {step === 'onerepmax' && pending && movementIndex && (
        <div>
          <h1 className="text-2xl font-semibold">Almost there</h1>
          <p className="mt-1 text-sm text-ink-muted">
            This program needs a starting point for a couple of lifts.
          </p>
          <div className="mt-4">
            <OneRepMaxForm
              programId={pending.programId}
              movementIds={
                programs?.find((p) => p.id === pending.programId)?.requiresInput?.oneRepMaxInputs ?? []
              }
              movementIndex={movementIndex}
              onDone={handleOneRepMaxDone}
              onCancel={() => setStep('tour')}
            />
          </div>
        </div>
      )}

      {step === 'tour' && (
        <div className="flex min-h-[70vh] flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {(() => {
              const TourIcon = TOUR_CARDS[tourIndex].icon
              return <TourIcon className="h-14 w-14 text-accent" strokeWidth={1.75} />
            })()}
            <h2 className="mt-4 text-lg font-semibold">{TOUR_CARDS[tourIndex].title}</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
              {TOUR_CARDS[tourIndex].body}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            {TOUR_CARDS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === tourIndex ? 'bg-accent' : 'bg-bg-surface'}`}
              />
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => {
                if (tourIndex < TOUR_CARDS.length - 1) {
                  setTourIndex(tourIndex + 1)
                } else {
                  finishOnboarding()
                }
              }}
              className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-medium text-bg"
            >
              {tourIndex < TOUR_CARDS.length - 1 ? 'Next' : 'Done'}
            </button>
            <button
              onClick={finishOnboarding}
              className="flex-1 rounded-lg bg-bg-surface py-2.5 text-sm text-ink-muted"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
