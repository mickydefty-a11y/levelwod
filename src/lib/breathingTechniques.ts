import type { BreathingTechnique } from '../types/breathing'

export const BREATHING_TECHNIQUES: BreathingTechnique[] = [
  {
    id: '4-7-8',
    label: '4-7-8',
    patternLabel: '4:7:8',
    description: 'A well-known relaxation pattern — the long exhale relative to the inhale is the defining feature.',
    visual: 'circle',
    phases: [
      { name: 'inhale', seconds: 4 },
      { name: 'hold', seconds: 7 },
      { name: 'exhale', seconds: 8 },
    ],
  },
  {
    id: 'box',
    label: 'Box breathing',
    patternLabel: '4:4:4:4',
    description: 'Equal on all four sides, hence "box" — used widely for calm, steady focus.',
    visual: 'circle',
    phases: [
      { name: 'inhale', seconds: 4 },
      { name: 'hold', seconds: 4 },
      { name: 'exhale', seconds: 4 },
      { name: 'hold', seconds: 4 },
    ],
  },
  {
    id: 'ujjayi',
    label: 'Ujjayi',
    patternLabel: '5:5',
    description: 'A yogic "ocean breath" — no holds, paced entirely by a slight throat constriction.',
    visual: 'circle',
    phases: [
      { name: 'inhale', seconds: 5 },
      { name: 'exhale', seconds: 5 },
    ],
    firstTimeNote:
      'Ujjayi involves a slight constriction at the back of the throat, creating a soft "ocean" sound as you breathe — the timer paces you, but the sound is the technique. Try gently tightening your throat as if fogging up a mirror, with your mouth closed.',
  },
  {
    id: 'rectangle',
    label: 'Rectangle breathing',
    patternLabel: '4:6',
    description:
      'Traditionally traced around a rectangular object — inhale along a short edge, exhale (for longer) along a long edge.',
    visual: 'rectangle',
    phases: [
      { name: 'inhale', seconds: 4 },
      { name: 'exhale', seconds: 6 },
    ],
  },
]

export function getBreathingTechnique(id: string): BreathingTechnique | undefined {
  return BREATHING_TECHNIQUES.find((t) => t.id === id)
}
