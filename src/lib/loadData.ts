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
