import { useVoiceSettings } from '../lib/useVoiceSettings'

// One-tap toggle usable mid-session without leaving the timer/breathing
// screen, per the spec's "never requires leaving the screen" requirement.
export default function VoiceModeToggle() {
  const { settings, toggleEnabled } = useVoiceSettings()

  return (
    <button
      onClick={toggleEnabled}
      aria-label={settings.voiceModeEnabled ? 'Turn voice guidance off' : 'Turn voice guidance on'}
      aria-pressed={settings.voiceModeEnabled}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
        settings.voiceModeEnabled ? 'bg-accent text-bg' : 'bg-bg-surface text-ink-muted'
      }`}
    >
      {settings.voiceModeEnabled ? '🔊' : '🔇'}
    </button>
  )
}
