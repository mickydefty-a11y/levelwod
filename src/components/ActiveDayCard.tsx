import { useEffect, useState } from 'react'
import CoachsBriefBanner from './CoachsBriefBanner'
import ProgramBlockRow from './ProgramBlockRow'
import RpeGrid from './RpeGrid'
import { resolveLoadContext } from '../lib/trainingMax'
import { useActiveProgram } from '../lib/useActiveProgram'
import { useCoachsBrief } from '../lib/useCoachsBrief'
import { useProgramHistory } from '../lib/useProgramHistory'
import { useTrainingMax } from '../lib/useTrainingMax'
import { useWorkoutLog } from '../lib/useWorkoutLog'
import type { Movement } from '../types/movement'
import type { Program, ProgramDay, ProgramWeek } from '../types/program'

export default function ActiveDayCard({
  program,
  week,
  day,
  movementIndex,
  isFinalDay,
  onCompleted,
}: {
  program: Program
  week: ProgramWeek
  day: ProgramDay
  movementIndex: Map<string, Movement>
  isFinalDay: boolean
  // fired after a day is marked complete — used by Home to offer a
  // post-workout breathing session; has no effect on the completion logic
  // itself
  onCompleted?: () => void
}) {
  const { advanceDay, stopProgram } = useActiveProgram()
  const { markCompleted } = useProgramHistory()
  const { addEntry } = useWorkoutLog()
  const { dataFor } = useTrainingMax()
  const [results, setResults] = useState<Record<number, string>>({})
  const [done, setDone] = useState<Record<number, boolean>>({})
  const [showRpeGrid, setShowRpeGrid] = useState(false)

  const trainingMaxData = dataFor(program.id)
  const loadContext = trainingMaxData
    ? resolveLoadContext(trainingMaxData, week.weekNumber, program)
    : null

  const isRetestDay = week.focus.toLowerCase().includes('test')
  const mainBlock = day.blocks.find((b) => b.blockType === 'strength' || b.blockType === 'skill')
  const retestMovementName = isRetestDay
    ? (movementIndex.get(mainBlock?.movementId ?? '')?.name ?? null)
    : null
  const sessionMovementIds = [...new Set(day.blocks.map((b) => b.movementId))]
  const briefLines = useCoachsBrief({
    sessionName: program.name,
    isRetestDay,
    retestMovementName,
    sessionMovementIds,
    weekFocus: week.focus,
    movementIndex,
  })

  // Clear any typed-in results when the current day changes underneath us
  // (e.g. after marking the previous day complete).
  useEffect(() => {
    setResults({})
    setDone({})
    setShowRpeGrid(false)
  }, [program.id, week.weekNumber, day.dayNumber])

  function handleComplete(rpe?: number) {
    const loggedResults = day.blocks
      .map((block, i) => {
        const text = (results[i] ?? '').trim()
        const isDone = done[i] ?? false
        return {
          blockIndex: i,
          movementId: block.movementId,
          movementName: movementIndex.get(block.movementId)?.name ?? block.movementId,
          prescription: block.prescription,
          result: text || (isDone ? 'Done' : ''),
        }
      })
      .filter((r) => r.result.length > 0)

    addEntry({
      programId: program.id,
      programName: program.name,
      weekNumber: week.weekNumber,
      dayNumber: day.dayNumber,
      dayName: day.name,
      completedAt: new Date().toISOString(),
      results: loggedResults,
      rpe,
    })

    if (isFinalDay) {
      markCompleted(program.id)
      stopProgram()
    } else {
      advanceDay(program)
    }

    onCompleted?.()
  }

  return (
    <div>
      <div className="mb-3">
        <CoachsBriefBanner lines={briefLines} />
      </div>
      <ul className="space-y-1.5">
        {day.blocks.map((block, i) => (
          <ProgramBlockRow
            key={i}
            block={block}
            index={movementIndex}
            logValue={results[i] ?? ''}
            onLogChange={(value) => setResults((prev) => ({ ...prev, [i]: value }))}
            done={done[i] ?? false}
            onToggleDone={() => setDone((prev) => ({ ...prev, [i]: !prev[i] }))}
            programContext={`${program.id} / week ${week.weekNumber} / day ${day.dayNumber}`}
            loadContext={loadContext}
          />
        ))}
      </ul>
      {showRpeGrid ? (
        <div className="mt-2">
          <RpeGrid onSelect={(rpe) => handleComplete(rpe)} onSkip={() => handleComplete(undefined)} />
        </div>
      ) : (
        <button
          onClick={() => setShowRpeGrid(true)}
          className="mt-2 w-full rounded-lg bg-accent py-2 text-sm font-medium text-bg"
        >
          {isFinalDay ? 'Finish program 🎉' : 'Mark day complete'}
        </button>
      )}
    </div>
  )
}
