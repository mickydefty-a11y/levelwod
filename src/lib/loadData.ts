import type { Movement } from '../types/movement'
import type { Program, ProgramPhase } from '../types/program'

const MOVEMENT_FILES = [
  'gymnastics.json',
  'monostructural.json',
  'strength-weightlifting.json',
  'functional-movements.json',
  'accessory-skill-development.json',
]

const PROGRAM_FILES = [
  'total-beginner-onramp-4wk.json',
  'program.example.json',
  'program-phase1-weeks2-3.json',
  'program-phase2-weeks4-6.json',
  'program-phase3-weeks7-9.json',
  'program-phase4-weeks10-12.json',
  'strength-focus-phase1-weeks1-2.json',
  'strength-focus-phase2-weeks3-5.json',
  'strength-focus-phase3-weeks6-8.json',
  'gymnastics-track-phase1-weeks1-2.json',
  'gymnastics-track-phase2-weeks3-5.json',
  'gymnastics-track-phase3-weeks6-8.json',
  'gymnastics-track-phase4-weeks9-10.json',
  'conditioning-engine-focus-phase1-weeks1-2.json',
  'conditioning-engine-focus-phase2-weeks3-4.json',
  'conditioning-engine-focus-phase3-weeks5-6.json',
  'olympic-weightlifting-deep-dive-phase1-weeks1-2.json',
  'olympic-weightlifting-deep-dive-phase2-weeks3-5.json',
  'olympic-weightlifting-deep-dive-phase3-weeks6-8.json',
  'strongman-functional-focus-phase1-weeks1-2.json',
  'strongman-functional-focus-phase2-weeks3-4.json',
  'strongman-functional-focus-phase3-weeks5-6.json',
  '531-strength-cycle1-weeks1-4.json',
  '531-strength-cycle2-weeks5-8.json',
  '531-strength-week9-retest.json',
  'russian-squat-program-weeks1-3.json',
  'russian-squat-program-weeks4-6.json',
  'hyrox-beginner-phase1-weeks1-3.json',
  'hyrox-beginner-phase2-weeks4-6.json',
  'hyrox-beginner-phase3-weeks7-8.json',
  'hyrox-intermediate-weeks1-5.json',
  'hyrox-intermediate-weeks6-10.json',
  'hyrox-elite-weeks1-4.json',
  'hyrox-elite-weeks5-8.json',
  'hyrox-elite-weeks9-12.json',
  'crossfit-open-beginner-weeks1-4.json',
  'crossfit-open-beginner-weeks5-8.json',
  'crossfit-open-intermediate-weeks1-5.json',
  'crossfit-open-intermediate-weeks6-10.json',
  'crossfit-open-elite-weeks1-4.json',
  'crossfit-open-elite-weeks5-8.json',
  'crossfit-open-elite-weeks9-12.json',
  'home-kettlebell-weeks1-4.json',
  'home-kettlebell-weeks5-8.json',
]

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

let movementsPromise: Promise<Movement[]> | null = null

// Cached so every page that needs the library shares one fetch instead of
// re-requesting the same 5 files every time it mounts.
export function loadMovements(): Promise<Movement[]> {
  if (!movementsPromise) {
    movementsPromise = Promise.all(
      MOVEMENT_FILES.map((file) => fetchJson<Movement[]>(`/data/movements/${file}`)),
    ).then((files) => files.flat())
  }
  return movementsPromise
}

function isFullProgram(data: Program | ProgramPhase): data is Program {
  return 'id' in data
}

let programsPromise: Promise<Program[]> | null = null

export function loadPrograms(): Promise<Program[]> {
  if (!programsPromise) {
    programsPromise = Promise.all(
      PROGRAM_FILES.map((file) => fetchJson<Program | ProgramPhase>(`/data/programs/${file}`)),
    ).then((files) => {
      const bases = files.filter(isFullProgram)
      const phases = files.filter((f): f is ProgramPhase => !isFullProgram(f))

      for (const phase of phases) {
        const base = bases.find((b) => b.id === phase.programId)
        if (!base) continue
        base.weeks = [...base.weeks, ...phase.weeks]
      }

      for (const base of bases) {
        base.weeks.sort((a, b) => a.weekNumber - b.weekNumber)
      }

      return bases
    })
  }
  return programsPromise
}

export function buildMovementIndex(movements: Movement[]): Map<string, Movement> {
  return new Map(movements.map((m) => [m.id, m]))
}

export function findStage(movement: Movement | undefined, stageId: string | null) {
  if (!movement || !stageId) return undefined
  return movement.stages?.find((s) => s.id === stageId)
}
