// Declares what kind of result a workout produces, so the app knows what to
// ask for after a session — a finish time, rounds+reps, or nothing
// comparable at all (EMOM).
export type ScoreType = 'time' | 'rounds_and_reps' | 'none'
