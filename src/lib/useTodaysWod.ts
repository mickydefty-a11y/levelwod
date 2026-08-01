import { useEffect } from 'react'
import { generateWod, todayDateStr } from './wodGenerator'
import { useWodHistory } from './useWodHistory'
import type { WodDay } from '../types/wod'

const LOOKBACK_DAYS = 7

export function useTodaysWod(): WodDay {
  const { recentSubcategories, recordWod } = useWodHistory()
  const date = todayDateStr()
  const wod = generateWod(date, recentSubcategories(date, LOOKBACK_DAYS))

  useEffect(() => {
    recordWod(
      date,
      wod.slots.map((s) => s.subcategory),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return wod
}
