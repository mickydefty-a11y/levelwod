export type TimerConfig =
  | { type: 'stopwatch'; capSeconds?: number }
  | { type: 'amrap'; durationSeconds: number }
  | { type: 'emom'; intervalSeconds: number; rounds: number }
  | { type: 'intervals'; workSeconds: number; restSeconds: number; rounds: number }
  | { type: 'rest'; durationSeconds: number }

export type TimerType = TimerConfig['type']
