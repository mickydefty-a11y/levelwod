import type { Program, ProgramCategory } from '../types/program'

export type SortOption = 'duration-shortest' | 'duration-longest' | 'level' | 'alphabetical'

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'duration-shortest', label: 'Shortest first' },
  { id: 'duration-longest', label: 'Longest first' },
  { id: 'level', label: 'Level' },
  { id: 'alphabetical', label: 'A–Z' },
]

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced']

// Filters are OR'd within a facet (selecting Hyrox + CrossFit Open shows
// programs from either) and AND'd across facets (category + level narrows
// together) — the standard faceted-filtering convention, and consistent
// with how the existing Programs page's single-select filters already
// combine category and level. An empty set for a facet means "no filter."
export function filterPrograms(
  programs: Program[],
  categories: Set<ProgramCategory>,
  levels: Set<string>,
): Program[] {
  return programs.filter((p) => {
    if (categories.size > 0 && (!p.category || !categories.has(p.category))) return false
    if (levels.size > 0 && !levels.has(p.level)) return false
    return true
  })
}

export function sortPrograms(programs: Program[], sort: SortOption): Program[] {
  const sorted = [...programs]
  switch (sort) {
    case 'duration-shortest':
      sorted.sort((a, b) => a.durationWeeks - b.durationWeeks)
      break
    case 'duration-longest':
      sorted.sort((a, b) => b.durationWeeks - a.durationWeeks)
      break
    case 'level':
      sorted.sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level))
      break
    case 'alphabetical':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  return sorted
}

// First sentence of the description, for the card's one-line focus — falls
// back to the full description if no sentence boundary is found.
export function oneLineFocus(description: string): string {
  const match = description.match(/^[^.!?]+[.!?]/)
  return match ? match[0].trim() : description
}
