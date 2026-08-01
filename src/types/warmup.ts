export interface WarmupItem {
  movementId: string
  prescription: string
  // lift-specific percentage ramp, appended after the general mobility set
  isRamp?: boolean
}
