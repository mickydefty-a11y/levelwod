export interface GlossaryTerm {
  term: string
  full: string
  definition: string
}

export interface GlossaryCategoryGroup {
  category: string
  terms: GlossaryTerm[]
}
