import { useEffect, useState } from 'react'
import BackLink from '../components/BackLink'
import OneRepMaxCalculator from '../components/OneRepMaxCalculator'
import { buildMovementIndex, loadMovements } from '../lib/loadData'
import type { Movement } from '../types/movement'

export default function OneRepMaxCalculatorPage() {
  const [movements, setMovements] = useState<Movement[] | null>(null)

  useEffect(() => {
    loadMovements().then(setMovements)
  }, [])

  const movementIndex = movements ? buildMovementIndex(movements) : null

  return (
    <div>
      <BackLink to="/progress" label="Progress" />

      <h1 className="mt-2 text-2xl font-semibold">1RM Calculator</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Enter reps and weight from a recent set to estimate your one-rep max, plus a full rep-max
        table from 1RM through 10RM — using the Brzycki formula.
      </p>

      {!movementIndex ? (
        <p className="mt-4 text-ink-muted">Loading…</p>
      ) : (
        <div className="mt-4">
          <OneRepMaxCalculator movementIndex={movementIndex} />
        </div>
      )}
    </div>
  )
}
