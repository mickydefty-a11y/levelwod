import type { TimerConfig } from '../types/timer'

export function timerConfigToParams(config: TimerConfig): URLSearchParams {
  const params = new URLSearchParams()
  params.set('type', config.type)
  switch (config.type) {
    case 'stopwatch':
      if (config.capSeconds) params.set('cap', String(config.capSeconds))
      break
    case 'amrap':
      params.set('duration', String(config.durationSeconds))
      break
    case 'emom':
      params.set('interval', String(config.intervalSeconds))
      params.set('rounds', String(config.rounds))
      break
    case 'intervals':
      params.set('work', String(config.workSeconds))
      params.set('rest', String(config.restSeconds))
      params.set('rounds', String(config.rounds))
      break
    case 'rest':
      params.set('duration', String(config.durationSeconds))
      break
  }
  return params
}

export function timerConfigToPath(config: TimerConfig): string {
  return `/timer?${timerConfigToParams(config).toString()}`
}

export function paramsToTimerConfig(params: URLSearchParams): TimerConfig | null {
  const type = params.get('type')
  const num = (key: string): number | undefined => {
    const v = params.get(key)
    return v ? Number(v) : undefined
  }

  switch (type) {
    case 'stopwatch':
      return { type: 'stopwatch', capSeconds: num('cap') }
    case 'amrap': {
      const duration = num('duration')
      return duration == null ? null : { type: 'amrap', durationSeconds: duration }
    }
    case 'emom': {
      const interval = num('interval')
      const rounds = num('rounds')
      return interval == null || rounds == null
        ? null
        : { type: 'emom', intervalSeconds: interval, rounds }
    }
    case 'intervals': {
      const work = num('work')
      const rest = num('rest')
      const rounds = num('rounds')
      return work == null || rest == null || rounds == null
        ? null
        : { type: 'intervals', workSeconds: work, restSeconds: rest, rounds }
    }
    case 'rest': {
      const duration = num('duration')
      return duration == null ? null : { type: 'rest', durationSeconds: duration }
    }
    default:
      return null
  }
}
