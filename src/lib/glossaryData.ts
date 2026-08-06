import type { GlossaryCategoryGroup } from '../types/glossary'

// Curated, fixed glossary — no user-submitted terms, per the spec (keeps
// quality consistent). Copy is intentionally kept to one line per
// definition; this is a quick lookup tool, not a textbook.
export const GLOSSARY: GlossaryCategoryGroup[] = [
  {
    category: 'Workout Formats',
    terms: [
      { term: 'WOD', full: 'Workout of the Day', definition: 'The workout scheduled for a given day — the term used across the whole sport.' },
      { term: 'AMRAP', full: 'As Many Rounds (or Reps) As Possible', definition: 'Complete as many full rounds, or reps, as you can within a set time cap.' },
      { term: 'EMOM', full: 'Every Minute On the Minute', definition: 'Start a prescribed amount of work at the top of every minute, resting with whatever time is left.' },
      { term: 'For Time', full: 'For Time', definition: 'Complete the prescribed work as fast as possible — the clock keeps running until you finish.' },
      { term: 'Chipper', full: 'Chipper', definition: "A long list of movements done once each, in order, usually 'chipping away' at high total reps." },
      { term: 'Tabata', full: 'Tabata Interval', definition: '8 rounds of 20 seconds of work followed by 10 seconds of rest.' },
      { term: 'Ladder', full: 'Ladder', definition: 'Reps increase or decrease each round, e.g. 21-15-9.' },
      { term: 'Metcon', full: 'Metabolic Conditioning', definition: 'General term for a workout designed to build conditioning/work capacity, as opposed to pure strength work.' },
      { term: 'Cash-Out / Buy-In', full: 'Cash-Out / Buy-In', definition: 'A fixed piece of work done at the very end (cash-out) or very start (buy-in) of a workout, separate from the main set.' },
      { term: 'GPP', full: 'General Physical Preparedness', definition: 'Broad, foundational fitness work not aimed at one specific skill or sport — building an all-round base.' },
    ],
  },
  {
    category: 'Scoring & Scaling',
    terms: [
      { term: 'RX', full: 'As Prescribed', definition: 'Completing the workout exactly as written — full weights, full movement standards, no scaling.' },
      { term: 'Scaled', full: 'Scaled', definition: 'A modified, more accessible version of a workout — lighter loads, easier movement variations, or reduced volume.' },
      { term: 'PR / PB', full: 'Personal Record / Personal Best', definition: 'Your best-ever result for a given lift, movement, or workout.' },
      { term: '1RM', full: 'One-Rep Max', definition: 'The heaviest weight you can lift for a single rep of a given movement.' },
      { term: 'RM', full: 'Rep Max', definition: "The heaviest weight liftable for a given number of reps, e.g. '5RM' means your 5-rep max." },
      { term: 'TM', full: 'Training Max', definition: 'A slightly reduced percentage of your true 1RM (often 90%), used as the basis for percentage-based programs like 5/3/1.' },
      { term: 'RPE', full: 'Rate of Perceived Exertion', definition: 'A 1-10 self-rated scale of how hard a set or session felt.' },
      { term: 'BW', full: 'Bodyweight', definition: 'Using your own bodyweight as the load, or a load expressed relative to your bodyweight.' },
    ],
  },
  {
    category: 'Common Movement Abbreviations',
    terms: [
      { term: 'T2B', full: 'Toes-to-Bar', definition: 'Hanging from a bar and raising the toes to touch it.' },
      { term: 'K2E', full: 'Knees-to-Elbows', definition: 'A regression of Toes-to-Bar, raising the knees to the elbows instead of the full range.' },
      { term: 'HSPU', full: 'Handstand Push-Up', definition: 'A push-up performed in an inverted handstand position.' },
      { term: 'MU', full: 'Muscle-Up', definition: 'A transition from a pull-up into a dip on top of a bar or rings.' },
      { term: 'C2B', full: 'Chest-to-Bar Pull-Up', definition: 'A pull-up where the chest makes contact with the bar at the top.' },
      { term: 'OHS', full: 'Overhead Squat', definition: 'A squat performed with the barbell locked out overhead throughout.' },
      { term: 'BS / FS', full: 'Back Squat / Front Squat', definition: 'The two primary barbell squat variations, differing in where the bar rests.' },
      { term: 'DL', full: 'Deadlift', definition: 'Lifting a loaded barbell from the floor to a standing position.' },
      { term: 'C&J', full: 'Clean and Jerk', definition: 'An Olympic lift combining a Clean (floor to shoulders) and a Jerk (shoulders to overhead).' },
      { term: 'DU', full: 'Double Under', definition: 'A jump rope skill where the rope passes under the feet twice per jump.' },
      { term: 'GHD', full: 'Glute-Ham Developer', definition: 'A piece of equipment used for GHD sit-ups and hip extension work.' },
    ],
  },
  {
    category: 'Culture & Community',
    terms: [
      { term: 'Box', full: 'The Box', definition: 'Common slang for a CrossFit-style gym.' },
      { term: 'Rig', full: 'The Rig', definition: 'The pull-up bar structure found in most boxes.' },
      { term: 'Girl WODs', full: 'Girl WODs', definition: 'A set of classic, named benchmark workouts (Fran, Cindy, Grace, etc.) used across the community to track progress over time.' },
      { term: 'Hero WODs', full: 'Hero WODs', definition: 'Benchmark workouts named in tribute to fallen military, police, or firefighters — typically longer and more demanding than Girl WODs.' },
      { term: 'The Open', full: 'The CrossFit Open', definition: 'An annual, worldwide online competition — a series of workouts released over several weeks that anyone can complete and submit a score for.' },
      { term: 'Strict vs. Kipping', full: 'Strict vs. Kipping', definition: 'Strict means no body momentum is used (e.g. strict pull-up); kipping uses a controlled hip/leg swing to move more efficiently, common in competitive settings.' },
    ],
  },
]

// Where a term maps unambiguously to a single real movement in the
// Library, link through to it — skipped for terms with multiple variants
// (HSPU, MU) or that name two movements at once (BS / FS), since guessing
// which one would be worse than not linking at all.
export const GLOSSARY_MOVEMENT_LINKS: Record<string, string> = {
  T2B: 'toes-to-bar',
  K2E: 'knees-to-elbows',
  C2B: 'chest-to-bar-pull-up',
  OHS: 'overhead-squat',
  DL: 'deadlift',
  'C&J': 'clean-and-jerk',
  DU: 'double-unders',
}
