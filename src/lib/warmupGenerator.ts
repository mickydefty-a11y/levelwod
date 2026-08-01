import type { Movement } from '../types/movement'
import type { WarmupItem } from '../types/warmup'

// Subcategory -> warm-up movement ids. Deliberately keyed off the real
// schema's subcategory strings rather than enumerating individual
// movements, per the spec's own reasoning: every movement already has a
// subcategory, so this table only needs to cover the groupings.
const WARMUP_LOOKUP: Record<string, string[]> = {
  Squatting: ['hip-mobility', 'ankle-mobility'],
  Hinging: ['hip-mobility', 'hollow-hold'],
  'Pulling Movements': ['shoulder-stability', 'scapular-push-ups'],
  'Pushing Movements': ['shoulder-stability', 'thoracic-mobility'],
  'Inversions & Balance': ['thoracic-mobility', 'overhead-stability'],
  'Olympic Weightlifting': ['hip-mobility', 'thoracic-mobility', 'overhead-stability'],
  Carries: ['shoulder-stability', 'plank'],
  Lunging: ['hip-mobility', 'single-leg-balance'],
  Jumping: ['ankle-mobility', 'single-leg-balance'],
  'Strongman / Odd Objects': ['hip-mobility', 'shoulder-stability'],
  'Core & Midline': ['hollow-hold'],
}

const WARMUP_PRESCRIPTIONS: Record<string, string> = {
  'hip-mobility': '30 sec/side',
  'ankle-mobility': '30 sec/side',
  'hollow-hold': '20 sec',
  'shoulder-stability': '15 reps',
  'scapular-push-ups': '10 reps',
  'thoracic-mobility': '10 reps/side',
  'overhead-stability': '20 sec hold',
  plank: '20 sec hold',
  'single-leg-balance': '20 sec/side',
}

// The real library tags Back Squat, Deadlift, and their barbell relatives
// under "Powerlifting" rather than "Squatting"/"Hinging" — only Wall Ball
// and Pistol Squat actually carry the "Squatting" tag. Without this, heavy
// barbell squats/hinges/presses would get a percentage ramp but zero
// mobility prep, even though they're exactly the movements that need it
// most. Maps each to whichever existing lookup row matches its pattern.
const PATTERN_OVERRIDE: Record<string, string> = {
  'back-squat': 'Squatting',
  'front-squat': 'Squatting',
  'overhead-squat': 'Squatting',
  deadlift: 'Hinging',
  'bench-press': 'Pushing Movements',
  'strict-press': 'Pushing Movements',
  'push-press': 'Pushing Movements',
  'push-jerk': 'Pushing Movements',
  'split-jerk': 'Pushing Movements',
}

const MONOSTRUCTURAL_CATEGORY = 'Monostructural Conditioning'
const MOBILITY_CAP = 4

function isBarbellOrKettlebell(movement: Movement): boolean {
  return movement.equipment.some((e) => e.includes('Barbell') || e.includes('Kettlebell'))
}

// Pure and feature-agnostic: takes the actual Movement objects involved in
// a selected tier (already resolved by the caller) and returns a short,
// relevant warm-up — general mobility first (capped at 4, deduplicated),
// lift-specific percentage ramps last so the sequence builds toward the
// working weight rather than jumping straight to a number.
export function generateWarmup(movements: Movement[]): WarmupItem[] {
  const candidates: WarmupItem[] = []
  const seenMobilityIds = new Set<string>()

  function addCandidate(movementId: string, prescription: string) {
    if (seenMobilityIds.has(movementId)) return
    seenMobilityIds.add(movementId)
    candidates.push({ movementId, prescription })
  }

  for (const movement of movements) {
    if (movement.category === MONOSTRUCTURAL_CATEGORY) {
      addCandidate('hip-mobility', WARMUP_PRESCRIPTIONS['hip-mobility'])
      addCandidate(movement.id, '2 min easy pace')
      continue
    }
    const lookupKey = PATTERN_OVERRIDE[movement.id] ?? movement.subcategory
    for (const id of WARMUP_LOOKUP[lookupKey] ?? []) {
      addCandidate(id, WARMUP_PRESCRIPTIONS[id] ?? '30 sec')
    }
  }

  const mobilityItems = candidates.slice(0, MOBILITY_CAP)

  const rampItems: WarmupItem[] = []
  const seenRampIds = new Set<string>()
  for (const movement of movements) {
    if (!isBarbellOrKettlebell(movement) || seenRampIds.has(movement.id)) continue
    seenRampIds.add(movement.id)
    rampItems.push({ movementId: movement.id, prescription: '40% x 5 (ramp)', isRamp: true })
    rampItems.push({ movementId: movement.id, prescription: '60% x 3 (ramp)', isRamp: true })
  }

  return [...mobilityItems, ...rampItems]
}
