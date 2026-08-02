import type { BenchmarkWod } from '../types/benchmark'

// Hand-curated against the real movement library, same reasoning as the WOD
// generator's slot templates: RX/Intermediate/Scaled point at specific
// movement+stage combinations rather than being inferred, so each tier lands
// on something sensible. `loadNote` carries the actual prescribed
// weight/distance independent of whatever skill level the referenced stage
// happens to be internally tagged at — the stage reference is just "which
// movement pattern," not a source of truth for the number.
export const BENCHMARK_WODS: BenchmarkWod[] = [
  {
    id: 'fran',
    name: 'Fran',
    wodCategory: 'Girl',
    format: '21-15-9 for time',
    description:
      'One of the most well-known benchmarks in CrossFit — short, brutally intense, and a great one to repeat every few months to track real progress.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'thruster', stageId: 'thruster-elite', loadNote: '95/65 lb' },
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'thruster', stageId: 'thruster-loaded', loadNote: 'moderate load' },
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'thruster', stageId: 'thruster-empty-bar', loadNote: 'empty bar' },
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
        ],
      },
    },
  },
  {
    id: 'cindy',
    name: 'Cindy',
    wodCategory: 'Girl',
    format: '20 min AMRAP',
    repScheme: '5-10-15',
    description:
      'A steady, unglamorous grind — 20 minutes of the same 3 movements, rewarding pacing and consistency over raw power.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
          { movementId: 'push-up', stageId: 'hand-release-push-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
          { movementId: 'push-up', stageId: 'full-push-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
          { movementId: 'push-up', stageId: 'knee-push-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
    },
  },
  {
    id: 'grace',
    name: 'Grace',
    wodCategory: 'Girl',
    format: '30 reps for time',
    description:
      'Thirty clean & jerks, as fast as possible — pure barbell cycling speed under a moderate, fixed load.',
    tiers: {
      rx: {
        movements: [{ movementId: 'clean-and-jerk', loadNote: '135/95 lb' }],
      },
      intermediate: {
        movements: [
          {
            movementId: 'clean',
            stageId: 'power-clean-light',
            loadNote: 'moderate load, power clean + push press',
          },
        ],
      },
      scaled: {
        movements: [
          {
            movementId: 'clean',
            stageId: 'hang-power-clean-empty',
            loadNote: 'empty bar, hang power clean + push press',
          },
        ],
      },
    },
  },
  {
    id: 'helen',
    name: 'Helen',
    wodCategory: 'Girl',
    format: '3 rounds for time',
    description: 'A classic engine-and-grip test cycling through running, kettlebell swings, and pull-ups.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'running', loadNote: '400m' },
          { movementId: 'kettlebell-swing', stageId: 'american-swing', loadNote: '53/35 lb' },
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'running', loadNote: '400m' },
          { movementId: 'kettlebell-swing', stageId: 'russian-swing-mod' },
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'running', loadNote: '200m — brisk walk is fine too' },
          { movementId: 'kettlebell-swing', stageId: 'russian-swing' },
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
        ],
      },
    },
  },
  {
    id: 'annie',
    name: 'Annie',
    wodCategory: 'Girl',
    format: '50-40-30-20-10 for time',
    description: 'Descending reps of double-unders and sit-ups — a jump-rope skill test as much as a conditioning piece.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'double-unders', stageId: 'du-unbroken' },
          { movementId: 'sit-up' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'double-unders', stageId: 'du-attempts' },
          { movementId: 'sit-up' },
        ],
      },
      scaled: {
        movements: [{ movementId: 'single-unders' }, { movementId: 'sit-up' }],
      },
    },
  },
  {
    id: 'karen',
    name: 'Karen',
    wodCategory: 'Girl',
    format: 'For time',
    repScheme: '150 reps',
    description: 'One movement, 150 reps, nowhere to hide — a simple but honest test of wall ball capacity.',
    tiers: {
      rx: {
        movements: [{ movementId: 'wall-ball', stageId: 'wb-rx', loadNote: '20/14 lb' }],
      },
      intermediate: {
        movements: [{ movementId: 'wall-ball', stageId: 'wb-light-low' }],
      },
      scaled: {
        movements: [{ movementId: 'wall-ball', stageId: 'wb-separate-reps' }],
      },
    },
  },
  {
    id: 'diane',
    name: 'Diane',
    wodCategory: 'Girl',
    format: '21-15-9 for time',
    description: 'Heavy deadlifts paired with handstand push-ups — a real test of a strong posterior chain and shoulders.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'deadlift', stageId: 'deadlift-loaded', loadNote: '225/155 lb' },
          { movementId: 'strict-handstand-push-up', stageId: 'strict-hspu-full' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'deadlift', stageId: 'deadlift-empty-bar', loadNote: 'empty barbell' },
          { movementId: 'strict-handstand-push-up', stageId: 'box-hspu' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'deadlift', stageId: 'kb-deadlift', loadNote: 'light kettlebell deadlift' },
          {
            movementId: 'strict-handstand-push-up',
            stageId: 'wall-handstand-hold-hspu',
            loadNote: 'hold or negative reps',
          },
        ],
      },
    },
  },
  {
    id: 'isabel',
    name: 'Isabel',
    wodCategory: 'Girl',
    format: '30 reps for time',
    description: "Grace's sibling — thirty snatches for time, testing the same barbell cycling speed under load.",
    tiers: {
      rx: {
        movements: [{ movementId: 'snatch', stageId: 'squat-snatch-loaded', loadNote: '135/95 lb' }],
      },
      intermediate: {
        movements: [
          { movementId: 'snatch', stageId: 'power-snatch-light', loadNote: 'moderate load, power snatch' },
        ],
      },
      scaled: {
        movements: [
          {
            movementId: 'snatch',
            stageId: 'hang-power-snatch-empty',
            loadNote: 'empty bar, hang power snatch',
          },
        ],
      },
    },
  },
  {
    id: 'murph',
    name: 'Murph',
    wodCategory: 'Hero',
    format: 'For time',
    description:
      'A mile to open, a mile to close, and a huge volume of bodyweight work in between — one of the most demanding Hero WODs.',
    originNote:
      'Murph is performed in honor of Navy Lieutenant Michael P. Murphy, who was killed in Afghanistan on June 28, 2005, and posthumously awarded the Medal of Honor for his actions. It was one of his favorite workouts, originally called "Body Armor." The CrossFit community traditionally performs it every Memorial Day. Take a moment before you start.',
    memorialTribute: true,
    tiers: {
      rx: {
        movements: [
          { movementId: 'running', loadNote: '1 mile' },
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
          { movementId: 'push-up', stageId: 'hand-release-push-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
          { movementId: 'running', loadNote: '1 mile' },
        ],
        note: 'Traditionally done wearing a 20/14 lb weight vest — optional, especially your first time.',
      },
      intermediate: {
        movements: [
          { movementId: 'running', loadNote: '1 mile' },
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
          { movementId: 'push-up', stageId: 'full-push-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
          { movementId: 'running', loadNote: '1 mile' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'running', loadNote: '800m' },
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
          { movementId: 'push-up', stageId: 'knee-push-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
          { movementId: 'running', loadNote: '800m' },
        ],
        note: 'Partition into manageable rounds (e.g. 20 rounds of 5 pull-ups / 10 push-ups / 15 squats) and scale the running distance as needed.',
      },
    },
  },
  {
    id: 'dt',
    name: 'DT',
    wodCategory: 'Hero',
    format: '5 rounds for time',
    repScheme: '12-9-6',
    description: 'Five rounds of a barbell triplet — deadlifts, hang power cleans, and push jerks without setting the bar down more than necessary.',
    originNote:
      'DT is named in honor of Air Force Staff Sergeant Timothy P. Davis, who was killed in Afghanistan on February 20, 2009.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'deadlift', stageId: 'deadlift-loaded', loadNote: '155/105 lb' },
          { movementId: 'clean', stageId: 'hang-power-clean-empty', loadNote: '155/105 lb' },
          { movementId: 'push-jerk', stageId: 'push-jerk-loaded', loadNote: '155/105 lb' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'deadlift', stageId: 'deadlift-empty-bar', loadNote: 'moderate load' },
          { movementId: 'clean', stageId: 'hang-power-clean-empty', loadNote: 'moderate load' },
          { movementId: 'push-jerk', stageId: 'push-jerk-empty-bar', loadNote: 'moderate load' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'deadlift', stageId: 'kb-deadlift', loadNote: 'light kettlebell deadlift' },
          {
            movementId: 'clean',
            stageId: 'clean-position-drills',
            loadNote: 'empty bar or PVC, drill the position',
          },
          { movementId: 'push-jerk', stageId: 'push-jerk-empty-bar', loadNote: 'empty bar' },
        ],
      },
    },
  },
  {
    id: 'angie',
    name: 'Angie',
    wodCategory: 'Girl',
    format: 'For time, complete each movement fully before moving to the next',
    repScheme: '100-100-100-100, in order',
    description:
      '100 reps each of four bodyweight movements, done in order — a real test of pure work capacity and mental toughness rather than skill.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
          { movementId: 'push-up', stageId: 'full-push-up' },
          { movementId: 'sit-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
          { movementId: 'push-up', stageId: 'full-push-up' },
          { movementId: 'sit-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
          { movementId: 'push-up', stageId: 'knee-push-up' },
          { movementId: 'sit-up' },
          { movementId: 'back-squat', stageId: 'box-squat' },
        ],
      },
    },
  },
  {
    id: 'barbara',
    name: 'Barbara',
    wodCategory: 'Girl',
    format: '5 rounds for time, 3 min rest between rounds',
    repScheme: '20-30-40-50, x5 rounds, 3 min rest between',
    description:
      'Five identical rounds of the same four bodyweight movements as Angie, but broken up with mandatory rest — tests both output and recovery within a session.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
          { movementId: 'push-up', stageId: 'full-push-up' },
          { movementId: 'sit-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
          { movementId: 'push-up', stageId: 'full-push-up' },
          { movementId: 'sit-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
          { movementId: 'push-up', stageId: 'knee-push-up' },
          { movementId: 'sit-up' },
          { movementId: 'back-squat', stageId: 'box-squat' },
        ],
      },
    },
  },
  {
    id: 'elizabeth',
    name: 'Elizabeth',
    wodCategory: 'Girl',
    format: '21-15-9 for time',
    repScheme: '21-15-9',
    description:
      'A short, heavy pairing of a technical lift and a gymnastics push movement — similar shape to Fran, but with Clean and Ring Dip instead of Thruster and Pull-up.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'clean', stageId: 'squat-clean-loaded', loadNote: '135/95 lb' },
          { movementId: 'ring-dip', stageId: 'full-ring-dip' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'clean', stageId: 'power-clean-light', loadNote: 'moderate load' },
          { movementId: 'ring-dip', stageId: 'banded-ring-dip' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'clean', stageId: 'hang-power-clean-empty', loadNote: 'empty bar' },
          { movementId: 'dip', stageId: 'banded-dip' },
        ],
      },
    },
  },
  {
    id: 'kelly',
    name: 'Kelly',
    wodCategory: 'Girl',
    format: '5 rounds for time',
    repScheme: '5 rounds: run, 30 box jumps, 30 wall balls',
    description:
      'A longer, grindier benchmark pairing running with two loaded gymnastics/conditioning movements — a real engine test.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'running', loadNote: '400m' },
          { movementId: 'box-jump', stageId: 'box-jump-standard', loadNote: '24/20 in box' },
          { movementId: 'wall-ball', stageId: 'wb-rx', loadNote: '20/14 lb' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'running', loadNote: '400m' },
          { movementId: 'box-jump', stageId: 'box-jump-low' },
          { movementId: 'wall-ball', stageId: 'wb-light-low' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'running', loadNote: '200m' },
          { movementId: 'box-jump', stageId: 'step-up' },
          { movementId: 'back-squat', stageId: 'air-squat-full', loadNote: 'bodyweight, in place of wall ball' },
        ],
      },
    },
  },
  {
    id: 'mary',
    name: 'Mary',
    wodCategory: 'Girl',
    format: '20 min AMRAP',
    repScheme: '5-10-15, repeating for 20 min',
    description:
      'A demanding gymnastics-heavy AMRAP combining an inverted push movement, a single-leg squat, and a pull movement — genuinely advanced even at the RX tier.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'strict-handstand-push-up', stageId: 'strict-hspu-full' },
          { movementId: 'pistol-squat', stageId: 'pistol-full', loadNote: 'alternating legs' },
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'strict-handstand-push-up', stageId: 'box-hspu' },
          { movementId: 'pistol-squat', stageId: 'assisted-pistol' },
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'pike-push-up' },
          { movementId: 'pistol-squat', stageId: 'single-leg-box-squat' },
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
        ],
      },
    },
  },
  {
    id: 'eva',
    name: 'Eva',
    wodCategory: 'Girl',
    format: '5 rounds for time',
    repScheme: '5 rounds: 800m run, 30 KB swings, 30 pull-ups',
    description:
      'A long, punishing combination of running, heavy kettlebell swings, and pull-ups — one of the tougher Girl WODs by total volume.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'running', loadNote: '800m' },
          { movementId: 'kettlebell-swing', stageId: 'american-swing', loadNote: '70/53 lb' },
          { movementId: 'pull-up', stageId: 'kipping-pull-up' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'running', loadNote: '600m' },
          { movementId: 'kettlebell-swing', stageId: 'russian-swing-mod' },
          { movementId: 'pull-up', stageId: 'banded-pull-up' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'running', loadNote: '400m' },
          { movementId: 'kettlebell-swing', stageId: 'russian-swing' },
          { movementId: 'ring-row', stageId: 'ring-row-standard' },
        ],
      },
    },
  },
  {
    id: 'randy',
    name: 'Randy',
    wodCategory: 'Hero',
    format: '75 reps for time',
    repScheme: '75 reps straight through',
    description:
      'A short, brutally heavy single-movement test — one of the more purely strength-and-power focused Hero WODs.',
    tiers: {
      rx: {
        movements: [{ movementId: 'power-snatch', loadNote: '75/55 lb' }],
      },
      intermediate: {
        movements: [{ movementId: 'power-snatch', loadNote: 'moderate load' }],
      },
      scaled: {
        movements: [
          {
            movementId: 'snatch',
            stageId: 'muscle-snatch-empty',
            loadNote: 'empty bar or light dumbbell snatch',
          },
        ],
      },
    },
  },
  {
    id: 'jt',
    name: 'JT',
    wodCategory: 'Hero',
    format: '21-15-9 for time',
    repScheme: '21-15-9',
    description:
      'Three bodyweight pushing movements of increasing difficulty, in the classic 21-15-9 shape — a Navy SEAL tribute workout.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'strict-handstand-push-up', stageId: 'strict-hspu-full' },
          { movementId: 'ring-dip', stageId: 'full-ring-dip' },
          { movementId: 'push-up', stageId: 'full-push-up' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'strict-handstand-push-up', stageId: 'box-hspu' },
          { movementId: 'ring-dip', stageId: 'banded-ring-dip' },
          { movementId: 'push-up', stageId: 'full-push-up' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'pike-push-up' },
          { movementId: 'dip', stageId: 'banded-dip' },
          { movementId: 'push-up', stageId: 'knee-push-up' },
        ],
      },
    },
  },
  {
    id: 'nate',
    name: 'Nate',
    wodCategory: 'Hero',
    format: '20 min AMRAP',
    repScheme: '2-4-8, repeating for 20 min',
    description:
      'An advanced gymnastics-and-conditioning AMRAP built around the Muscle-Up — a genuine test even for experienced athletes, in tribute to a fallen Navy SEAL.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'bar-muscle-up', stageId: 'kipping-bmu' },
          { movementId: 'strict-handstand-push-up', stageId: 'strict-hspu-full' },
          { movementId: 'kettlebell-swing', stageId: 'american-swing', loadNote: '70/53 lb' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'bar-muscle-up', stageId: 'banded-bmu' },
          { movementId: 'strict-handstand-push-up', stageId: 'box-hspu' },
          { movementId: 'kettlebell-swing', stageId: 'russian-swing-mod' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'pull-up', stageId: 'kipping-pull-up', loadNote: 'in place of muscle-up' },
          { movementId: 'pike-push-up' },
          { movementId: 'kettlebell-swing', stageId: 'russian-swing' },
        ],
      },
    },
  },
  {
    id: 'ryan',
    name: 'Ryan',
    wodCategory: 'Hero',
    format: '5 rounds for time',
    repScheme: '5 rounds: 7 muscle-ups, 21 burpees',
    description:
      'A high-skill, high-intensity Hero WOD pairing Muscle-Ups with Burpees — short on paper, extremely demanding in practice.',
    tiers: {
      rx: {
        movements: [
          { movementId: 'ring-muscle-up', stageId: 'strict-rmu' },
          { movementId: 'burpee', stageId: 'burpee-rx' },
        ],
      },
      intermediate: {
        movements: [
          { movementId: 'ring-muscle-up', stageId: 'banded-rmu' },
          { movementId: 'burpee', stageId: 'burpee-standard' },
        ],
      },
      scaled: {
        movements: [
          { movementId: 'pull-up', stageId: 'kipping-pull-up', loadNote: 'in place of muscle-up' },
          { movementId: 'burpee', stageId: 'burpee-step-back' },
        ],
      },
    },
  },
]

export function getBenchmarkWod(id: string): BenchmarkWod | undefined {
  return BENCHMARK_WODS.find((b) => b.id === id)
}
