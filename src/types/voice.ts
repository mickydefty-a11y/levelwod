export interface VoiceSettings {
  voiceModeEnabled: boolean
  announceMovementNames: boolean
  speechRate: number
  preferredVoice: string | null
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceModeEnabled: false,
  announceMovementNames: true,
  speechRate: 1.0,
  preferredVoice: null,
}
