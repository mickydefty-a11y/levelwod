import { SpeakerOffIcon, SpeakerOnIcon } from './icons'
import { useVoiceSettings } from '../lib/useVoiceSettings'

// One-tap toggle usable mid-session without leaving the timer/breathing
// screen, per the spec's "never requires leaving the screen" requirement.
export default function VoiceModeToggle() {
  const { settings, toggleEnabled } = useVoiceSettings()
  const Icon = settings.voiceModeEnabled ? SpeakerOnIcon : SpeakerOffIcon

  return (
    <button
      onClick={toggleEnabled}
      aria-label={settings.voiceModeEnabled ? 'Turn voice guidance off' : 'Turn voice guidance on'}
      aria-pressed={settings.voiceModeEnabled}
      className={`flex h-8 w-8 items-center justify-center rounded-full ${
        settings.voiceModeEnabled ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  )
}
