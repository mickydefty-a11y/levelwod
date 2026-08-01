import { WOD_SLOT_TEMPLATES, type WodSlotTemplate } from './wodSlotTemplates'
import type { WodDay, WodFormat, WodSlot, WodTier } from '../types/wod'

const FORMATS: WodFormat[] = ['amrap', 'forTime', 'emom', 'chipper']

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h >>> 0
}

// Deterministic PRNG (mulberry32) seeded from the date string — same date
// always produces the same sequence of draws, so "today's WOD" is stable
// across refreshes.
function mulberry32(seed: number) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickIndex(rng: () => number, length: number): number {
  return Math.floor(rng() * length)
}

function slotCountRange(format: WodFormat): [number, number] {
  switch (format) {
    case 'emom':
      return [2, 2]
    case 'amrap':
      return [3, 4]
    case 'forTime':
      return [3, 4]
    case 'chipper':
      return [4, 6]
  }
}

function amountFor(template: WodSlotTemplate, format: WodFormat, tier: WodTier) {
  return template.amounts[format][tier]
}

// recentSubcategoriesByDate: actual subcategories LevelWOD generated on
// each of the last ~7 real calendar dates (from the WOD history store) —
// most recent first. Missing/unknown dates just contribute no exclusions,
// which is fine: a gap in history only means slightly less effective
// variety, never an incorrect result, since generation is fully
// deterministic from (date, template pool) regardless.
export function generateWod(date: string, recentSubcategoriesByDate: string[][] = []): WodDay {
  const rng = mulberry32(hashSeed(date))
  const format = FORMATS[pickIndex(rng, FORMATS.length)]
  const [min, max] = slotCountRange(format)
  const slotCount = min + pickIndex(rng, max - min + 1)

  // Rank subcategories by how many days ago they were actually last used
  // (index 0 in recentSubcategoriesByDate = yesterday); missing = never
  // used in the window, i.e. the best/freshest option.
  const recency = new Map<string, number>()
  recentSubcategoriesByDate.forEach((subs, i) => {
    for (const sub of subs) {
      if (!recency.has(sub)) recency.set(sub, i + 1)
    }
  })

  const preferred = WOD_SLOT_TEMPLATES.filter((t) => !recency.has(t.subcategory))
  const fallback = WOD_SLOT_TEMPLATES.filter((t) => recency.has(t.subcategory)).sort(
    (a, b) => recency.get(b.subcategory)! - recency.get(a.subcategory)!,
  )

  const usedEquipment = new Set<string>()
  const chosen: WodSlotTemplate[] = []

  // Random among equally-fresh candidates so the pick still feels generated,
  // not mechanically round-robin.
  function drawRandomFrom(pool: WodSlotTemplate[]) {
    const candidates = [...pool]
    while (chosen.length < slotCount && candidates.length > 0) {
      const idx = pickIndex(rng, candidates.length)
      const candidate = candidates[idx]
      candidates.splice(idx, 1)
      if (usedEquipment.has(candidate.equipmentTag)) continue
      usedEquipment.add(candidate.equipmentTag)
      chosen.push(candidate)
    }
  }

  // Deterministic order (stalest-first) once we're forced into recently
  // used subcategories, so a forced repeat always reaches for whichever one
  // has gone longest without appearing.
  function drawInOrderFrom(pool: WodSlotTemplate[]) {
    for (const candidate of pool) {
      if (chosen.length >= slotCount) break
      if (usedEquipment.has(candidate.equipmentTag)) continue
      usedEquipment.add(candidate.equipmentTag)
      chosen.push(candidate)
    }
  }

  drawRandomFrom(preferred)
  drawInOrderFrom(fallback)

  // Last resort: if the equipment-collision rule left us short even after
  // trying every template once, fill the rest ignoring that rule rather
  // than serving an under-filled WOD.
  if (chosen.length < slotCount) {
    const remaining = WOD_SLOT_TEMPLATES.filter((t) => !chosen.includes(t))
    while (chosen.length < slotCount && remaining.length > 0) {
      const idx = pickIndex(rng, remaining.length)
      chosen.push(remaining[idx])
      remaining.splice(idx, 1)
    }
  }

  const slots: WodSlot[] = chosen.map((template) => ({
    subcategory: template.subcategory,
    tiers: {
      rx: { ...template.tiers.rx, amount: amountFor(template, format, 'rx') },
      intermediate: { ...template.tiers.intermediate, amount: amountFor(template, format, 'intermediate') },
      scaled: { ...template.tiers.scaled, amount: amountFor(template, format, 'scaled') },
    },
  }))

  const wod: WodDay = { date, format, slots }
  if (format === 'amrap') wod.durationMinutes = 10 + pickIndex(rng, 11) // 10-20
  if (format === 'emom') wod.durationMinutes = 12 + pickIndex(rng, 9) // 12-20
  if (format === 'forTime') wod.rounds = 3 + pickIndex(rng, 3) // 3-5

  return wod
}

export function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10)
}
