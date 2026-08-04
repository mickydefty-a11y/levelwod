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
import type { Program, ProgramBlock, ProgramDay, ProgramWeek } from '../types/program'

const ACCESSORY_TYPES = new Set<ProgramBlock['blockType']>(['warmup', 'cooldown'])

// Splits off a leading run of warmup blocks and a trailing run of cooldown
// blocks, so they can collapse into one compact strip each — the middle
// (skill/strength/metcon) always stays fully visible since that's the actual
// work someone opened the day to see. Keeps each block's original index (i)
// so results/done state, keyed positionally, still lines up correctly.
function splitAccessoryRuns(blocks: ProgramBlock[]) {
  const indexed = blocks.map((block, i) => ({ block, i }))
  let start = 0
  while (start < indexed.length && ACCESSORY_TYPES.has(indexed[start].block.blockType)) start++
  let end = indexed.length
  while (end > start && ACCESSORY_TYPES.has(indexed[end - 1].block.blockType)) end--
  return { leading: indexed.slice(0, start), middle: indexed.slice(start, end), trailing: indexed.slice(end) }
}

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
  const { pointer, advanceDay, stopProgram } = useActiveProgram()
  const { markCompleted } = useProgramHistory()
  const { addEntry } = useWorkoutLog()
  const { dataFor } = useTrainingMax()
  const [results, setResults] = useState<Record<number, string>>({})
  const [done, setDone] = useState<Record<number, boolean>>({})
  const [showRpeGrid, setShowRpeGrid] = useState(false)
  const [showWarmup, setShowWarmup] = useState(false)
  const [showCooldown, setShowCooldown] = useState(false)

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
  const isFirstSession = week.weekNumber === 1 && day.dayNumber === 1
  const briefLines = useCoachsBrief({
    sessionName: program.name,
    isRetestDay,
    retestMovementName,
    sessionMovementIds,
    weekFocus: week.focus,
    movementIndex,
    isFirstSession,
    startReason: pointer?.startReason ?? null,
  })

  // Clear any typed-in results when the current day changes underneath us
  // (e.g. after marking the previous day complete).
  useEffect(() => {
    setResults({})
    setDone({})
    setShowRpeGrid(false)
    setShowWarmup(false)
    setShowCooldown(false)
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

  const { leading, middle, trailing } = splitAccessoryRuns(day.blocks)

  function renderBlock({ block, i }: { block: ProgramBlock; i: number }) {
    return (
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
        sessionId={
          block.scoreType ? `metcon:${program.id}:w${week.weekNumber}d${day.dayNumber}:${i}` : null
        }
      />
    )
  }

  function accessoryStrip(
    label: string,
    items: { block: ProgramBlock; i: number }[],
    expanded: boolean,
    onExpand: () => void,
  ) {
    if (items.length === 0) return null
    if (expanded) return <>{items.map(renderBlock)}</>
    const names = items
      .map(({ block }) => movementIndex.get(block.movementId)?.name ?? block.movementId)
      .join(', ')
    return (
      <li className="rounded-lg bg-bg-surface px-3 py-2">
        <button onClick={onExpand} className="flex w-full items-center justify-between gap-2 text-left">
          <span className="text-sm text-ink-muted">
            <span className="font-medium text-ink">{label}</span> · {names}
          </span>
          <span className="shrink-0 text-xs text-ink-muted">Show</span>
        </button>
      </li>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <CoachsBriefBanner lines={briefLines} />
      </div>
      <ul className="space-y-1.5">
        {accessoryStrip('Warm-up', leading, showWarmup, () => setShowWarmup(true))}
        {middle.map(renderBlock)}
        {accessoryStrip('Cooldown', trailing, showCooldown, () => setShowCooldown(true))}
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
