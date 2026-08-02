import type { WodFormat, WodTier } from '../types/wod'

export type WodEquipmentTag =
  | 'bodyweight'
  | 'kettlebell'
  | 'dumbbell'
  | 'jump-rope'
  | 'machine'
  | 'wall-ball'
  | 'medicine-ball'

interface TierMovement {
  movementId: string
  stageId?: string
  loadNote?: string
}

// One amount per tier, per format. Reps for most slots; a distance/calorie
// string for monostructural pieces (running, rowing, assault bike).
type TierAmounts = Record<WodTier, number | string>

export interface WodSlotTemplate {
  subcategory: string
  equipmentTag: WodEquipmentTag
  tiers: Record<WodTier, TierMovement>
  amounts: Record<WodFormat, TierAmounts>
}

// Hand-curated so RX/Intermediate/Scaled always land on a sensible,
// non-technical movement or stage for daily WOD use — deliberately not
// inferred from the prerequisite graph, since a subcategory like Pulling
// Movements also contains Rope Climb and Muscle-Ups, which are specialty
// branches off Pull-Up, not "harder pulling."
export const WOD_SLOT_TEMPLATES: WodSlotTemplate[] = [
  {
    subcategory: 'Pulling Movements',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'pull-up', stageId: 'kipping-pull-up' },
      intermediate: { movementId: 'pull-up', stageId: 'banded-pull-up' },
      scaled: { movementId: 'ring-row', stageId: 'ring-row-standard' },
    },
    amounts: {
      amrap: { rx: 10, intermediate: 8, scaled: 8 },
      forTime: { rx: 10, intermediate: 8, scaled: 8 },
      emom: { rx: 6, intermediate: 5, scaled: 6 },
      chipper: { rx: 20, intermediate: 16, scaled: 15 },
    },
  },
  {
    subcategory: 'Pushing Movements',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'push-up', stageId: 'hand-release-push-up' },
      intermediate: { movementId: 'push-up', stageId: 'full-push-up' },
      scaled: { movementId: 'push-up', stageId: 'knee-push-up' },
    },
    amounts: {
      amrap: { rx: 10, intermediate: 10, scaled: 8 },
      forTime: { rx: 10, intermediate: 10, scaled: 8 },
      emom: { rx: 8, intermediate: 8, scaled: 6 },
      chipper: { rx: 20, intermediate: 20, scaled: 15 },
    },
  },
  {
    subcategory: 'Squatting',
    equipmentTag: 'wall-ball',
    tiers: {
      rx: { movementId: 'wall-ball', stageId: 'wb-rx', loadNote: '9/6 kg (20/14 lb)' },
      intermediate: {
        movementId: 'wall-ball',
        stageId: 'wb-light-low',
        loadNote: '6/4 kg (14/9 lb)',
      },
      scaled: {
        movementId: 'wall-ball',
        stageId: 'wb-separate-reps',
        loadNote: '4/3 kg (9/6 lb)',
      },
    },
    amounts: {
      amrap: { rx: 15, intermediate: 15, scaled: 12 },
      forTime: { rx: 15, intermediate: 15, scaled: 12 },
      emom: { rx: 10, intermediate: 10, scaled: 8 },
      chipper: { rx: 30, intermediate: 30, scaled: 20 },
    },
  },
  {
    subcategory: 'Hinging',
    equipmentTag: 'kettlebell',
    tiers: {
      rx: {
        movementId: 'kettlebell-swing',
        stageId: 'american-swing',
        loadNote: '24/16 kg (53/35 lb)',
      },
      intermediate: {
        movementId: 'kettlebell-swing',
        stageId: 'russian-swing-mod',
        loadNote: '16/12 kg (35/26 lb)',
      },
      scaled: {
        movementId: 'kettlebell-swing',
        stageId: 'russian-swing',
        loadNote: '12/8 kg (26/18 lb)',
      },
    },
    amounts: {
      amrap: { rx: 15, intermediate: 15, scaled: 12 },
      forTime: { rx: 15, intermediate: 15, scaled: 12 },
      emom: { rx: 12, intermediate: 12, scaled: 10 },
      chipper: { rx: 30, intermediate: 30, scaled: 20 },
    },
  },
  {
    subcategory: 'Jumping',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'box-jump', stageId: 'box-jump-standard' },
      intermediate: { movementId: 'box-jump', stageId: 'box-jump-low' },
      scaled: { movementId: 'box-jump', stageId: 'step-up' },
    },
    amounts: {
      amrap: { rx: 12, intermediate: 12, scaled: 10 },
      forTime: { rx: 12, intermediate: 12, scaled: 10 },
      emom: { rx: 8, intermediate: 8, scaled: 6 },
      chipper: { rx: 25, intermediate: 25, scaled: 15 },
    },
  },
  {
    subcategory: 'Running',
    equipmentTag: 'machine',
    tiers: {
      rx: { movementId: 'running' },
      intermediate: { movementId: 'running' },
      scaled: { movementId: 'running', loadNote: 'brisk walk is fine too' },
    },
    amounts: {
      amrap: { rx: '400m', intermediate: '400m', scaled: '200m' },
      forTime: { rx: '400m', intermediate: '400m', scaled: '200m' },
      emom: { rx: '200m', intermediate: '200m', scaled: '150m' },
      chipper: { rx: '800m', intermediate: '800m', scaled: '400m' },
    },
  },
  {
    subcategory: 'Rowing',
    equipmentTag: 'machine',
    tiers: {
      rx: { movementId: 'rowing' },
      intermediate: { movementId: 'rowing' },
      scaled: { movementId: 'rowing', loadNote: 'easy pace' },
    },
    amounts: {
      amrap: { rx: '15 cal', intermediate: '15 cal', scaled: '10 cal' },
      forTime: { rx: '15 cal', intermediate: '15 cal', scaled: '10 cal' },
      emom: { rx: '12 cal', intermediate: '12 cal', scaled: '8 cal' },
      chipper: { rx: '30 cal', intermediate: '30 cal', scaled: '20 cal' },
    },
  },
  {
    subcategory: 'Assault Bike / Echo Bike',
    equipmentTag: 'machine',
    tiers: {
      rx: { movementId: 'assault-bike' },
      intermediate: { movementId: 'assault-bike' },
      scaled: { movementId: 'assault-bike', loadNote: 'easy pace' },
    },
    amounts: {
      amrap: { rx: '15 cal', intermediate: '15 cal', scaled: '10 cal' },
      forTime: { rx: '15 cal', intermediate: '15 cal', scaled: '10 cal' },
      emom: { rx: '12 cal', intermediate: '12 cal', scaled: '8 cal' },
      chipper: { rx: '30 cal', intermediate: '30 cal', scaled: '20 cal' },
    },
  },
  {
    subcategory: 'Jump Rope',
    equipmentTag: 'jump-rope',
    tiers: {
      rx: { movementId: 'double-unders', stageId: 'du-unbroken' },
      intermediate: { movementId: 'double-unders', stageId: 'du-attempts' },
      scaled: { movementId: 'single-unders' },
    },
    amounts: {
      amrap: { rx: 30, intermediate: 20, scaled: 40 },
      forTime: { rx: 30, intermediate: 20, scaled: 40 },
      emom: { rx: 20, intermediate: 15, scaled: 30 },
      chipper: { rx: 60, intermediate: 40, scaled: 80 },
    },
  },
  {
    subcategory: 'Dumbbells',
    equipmentTag: 'dumbbell',
    tiers: {
      rx: {
        movementId: 'dumbbell-clean',
        stageId: 'db-clean-rx',
        loadNote: '22.5/15 kg (50/35 lb)',
      },
      intermediate: {
        movementId: 'dumbbell-clean',
        stageId: 'db-clean-full',
        loadNote: '17.5/10 kg (40/22 lb)',
      },
      scaled: {
        movementId: 'dumbbell-clean',
        stageId: 'db-clean-hip',
        loadNote: '10/5 kg (22/11 lb)',
      },
    },
    amounts: {
      amrap: { rx: 12, intermediate: 10, scaled: 10 },
      forTime: { rx: 12, intermediate: 10, scaled: 10 },
      emom: { rx: 8, intermediate: 8, scaled: 6 },
      chipper: { rx: 24, intermediate: 20, scaled: 16 },
    },
  },
  {
    subcategory: 'Kettlebells',
    equipmentTag: 'kettlebell',
    tiers: {
      rx: {
        movementId: 'turkish-get-up',
        stageId: 'getup-moderate-kb',
        loadNote: '16/8 kg (35/18 lb)',
      },
      intermediate: {
        movementId: 'turkish-get-up',
        stageId: 'getup-light-kb',
        loadNote: '12/6 kg (26/13 lb)',
      },
      scaled: {
        movementId: 'turkish-get-up',
        stageId: 'getup-bodyweight',
        loadNote: 'bodyweight only, no kettlebell',
      },
    },
    amounts: {
      amrap: { rx: 6, intermediate: 6, scaled: 6 },
      forTime: { rx: 6, intermediate: 6, scaled: 6 },
      emom: { rx: 4, intermediate: 4, scaled: 4 },
      chipper: { rx: 10, intermediate: 10, scaled: 10 },
    },
  },
  {
    subcategory: 'Conditioning Fundamentals',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'burpee', stageId: 'burpee-rx' },
      intermediate: { movementId: 'burpee', stageId: 'burpee-standard' },
      scaled: { movementId: 'burpee', stageId: 'burpee-step-back' },
    },
    amounts: {
      amrap: { rx: 12, intermediate: 10, scaled: 8 },
      forTime: { rx: 12, intermediate: 10, scaled: 8 },
      emom: { rx: 8, intermediate: 7, scaled: 6 },
      chipper: { rx: 25, intermediate: 20, scaled: 15 },
    },
  },
  {
    subcategory: 'Lunging',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'walking-lunge' },
      intermediate: { movementId: 'walking-lunge' },
      scaled: { movementId: 'walking-lunge', loadNote: 'shorter steps, pause as needed' },
    },
    amounts: {
      amrap: { rx: 20, intermediate: 16, scaled: 12 },
      forTime: { rx: 20, intermediate: 16, scaled: 12 },
      emom: { rx: 12, intermediate: 10, scaled: 8 },
      chipper: { rx: 40, intermediate: 32, scaled: 20 },
    },
  },
  {
    subcategory: 'Carries',
    equipmentTag: 'dumbbell',
    tiers: {
      rx: { movementId: 'farmer-carry', loadNote: '24/16 kg per hand (53/35 lb)' },
      intermediate: {
        movementId: 'farmer-carry',
        loadNote: '16/12 kg per hand (35/26 lb)',
      },
      scaled: {
        movementId: 'farmer-carry',
        loadNote: '10/6 kg per hand (22/13 lb), lighter load, shorter distance',
      },
    },
    amounts: {
      amrap: { rx: '100m', intermediate: '100m', scaled: '50m' },
      forTime: { rx: '100m', intermediate: '100m', scaled: '50m' },
      emom: { rx: '50m', intermediate: '50m', scaled: '25m' },
      chipper: { rx: '200m', intermediate: '200m', scaled: '100m' },
    },
  },
  {
    subcategory: 'Core & Midline',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'sit-up' },
      intermediate: { movementId: 'sit-up' },
      scaled: { movementId: 'sit-up', loadNote: 'feet anchored is fine' },
    },
    amounts: {
      amrap: { rx: 15, intermediate: 12, scaled: 10 },
      forTime: { rx: 15, intermediate: 12, scaled: 10 },
      emom: { rx: 10, intermediate: 8, scaled: 8 },
      chipper: { rx: 30, intermediate: 25, scaled: 20 },
    },
  },
  {
    subcategory: 'Medicine Ball',
    equipmentTag: 'medicine-ball',
    tiers: {
      rx: { movementId: 'medicine-ball-slam', loadNote: '9/6 kg (20/14 lb)' },
      intermediate: {
        movementId: 'medicine-ball-slam',
        loadNote: '6/4 kg (14/9 lb)',
      },
      scaled: {
        movementId: 'medicine-ball-slam',
        loadNote: '4/3 kg (9/6 lb), lighter ball',
      },
    },
    amounts: {
      amrap: { rx: 15, intermediate: 12, scaled: 10 },
      forTime: { rx: 15, intermediate: 12, scaled: 10 },
      emom: { rx: 10, intermediate: 8, scaled: 8 },
      chipper: { rx: 30, intermediate: 25, scaled: 20 },
    },
  },
  {
    subcategory: 'Crawling',
    equipmentTag: 'bodyweight',
    tiers: {
      rx: { movementId: 'bear-crawl' },
      intermediate: { movementId: 'bear-crawl' },
      scaled: { movementId: 'bear-crawl', loadNote: 'shorter distance, rest as needed' },
    },
    amounts: {
      amrap: { rx: '20m', intermediate: '20m', scaled: '10m' },
      forTime: { rx: '20m', intermediate: '20m', scaled: '10m' },
      emom: { rx: '10m', intermediate: '10m', scaled: '10m' },
      chipper: { rx: '40m', intermediate: '40m', scaled: '20m' },
    },
  },
]
