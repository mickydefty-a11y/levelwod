import { activeProgramStore } from './useActiveProgram'
import { programHistoryStore } from './useProgramHistory'
import { progressStore } from './useProgress'
import { workoutLogStore } from './useWorkoutLog'

const BACKUP_VERSION = 1

export interface BackupData {
  version: number
  exportedAt: string
  progress: ReturnType<typeof progressStore.getSnapshot>
  activeProgram: ReturnType<typeof activeProgramStore.getSnapshot>
  completedPrograms: ReturnType<typeof programHistoryStore.getSnapshot>
  workoutLog: ReturnType<typeof workoutLogStore.getSnapshot>
}

export function buildBackup(): BackupData {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress: progressStore.getSnapshot(),
    activeProgram: activeProgramStore.getSnapshot(),
    completedPrograms: programHistoryStore.getSnapshot(),
    workoutLog: workoutLogStore.getSnapshot(),
  }
}

export function downloadBackup() {
  const data = buildBackup()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `levelwod-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Only overwrites fields that look like the right shape, so a partial or
// slightly malformed file doesn't wipe out data it didn't actually contain.
export function restoreBackup(data: unknown): { ok: true } | { ok: false; error: string } {
  if (typeof data !== 'object' || data === null) {
    return { ok: false, error: 'That file is not a valid LevelWOD backup.' }
  }
  const d = data as Partial<BackupData>

  if (d.progress && typeof d.progress === 'object') {
    progressStore.set(d.progress)
  }
  if (d.activeProgram === null || (d.activeProgram && typeof d.activeProgram === 'object')) {
    activeProgramStore.set(d.activeProgram ?? null)
  }
  if (Array.isArray(d.completedPrograms)) {
    programHistoryStore.set(d.completedPrograms)
  }
  if (Array.isArray(d.workoutLog)) {
    workoutLogStore.set(d.workoutLog)
  }

  return { ok: true }
}

export function resetAllData() {
  progressStore.set({})
  activeProgramStore.set(null)
  programHistoryStore.set([])
  workoutLogStore.set([])
}
