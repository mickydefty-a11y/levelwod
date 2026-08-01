import { useEffect, useState } from 'react'
import { getAvailableVoices, onVoicesChanged } from '../lib/speechQueue'
import { useVoiceSettings } from '../lib/useVoiceSettings'

export default function VoiceSettingsPanel() {
  const { settings, update } = useVoiceSettings()
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => getAvailableVoices())

  useEffect(() => {
    return onVoicesChanged(() => setVoices(getAvailableVoices()))
  }, [])

  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-accent">Voice guidance</h2>
      <p className="mt-1 text-xs text-ink-muted">
        Speaks countdowns, round changes, and breathing cues out loud during the timer and
        breathing exercise — nobody has to glance at their phone mid-set.
      </p>

      <div className="mt-2 flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2.5">
        <span className="text-sm">Voice guidance</span>
        <button
          onClick={() => update({ voiceModeEnabled: !settings.voiceModeEnabled })}
          aria-pressed={settings.voiceModeEnabled}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            settings.voiceModeEnabled ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
          }`}
        >
          {settings.voiceModeEnabled ? 'On' : 'Off'}
        </button>
      </div>

      {settings.voiceModeEnabled && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-bg-surface px-3 py-2.5">
            <span className="text-sm">Announce movement names</span>
            <button
              onClick={() => update({ announceMovementNames: !settings.announceMovementNames })}
              aria-pressed={settings.announceMovementNames}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                settings.announceMovementNames ? 'bg-accent text-bg' : 'bg-bg-raised text-ink-muted'
              }`}
            >
              {settings.announceMovementNames ? 'On' : 'Off'}
            </button>
          </div>

          <div className="rounded-lg bg-bg-surface px-3 py-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="speech-rate" className="text-sm">
                Speech rate
              </label>
              <span className="text-xs text-ink-muted">{settings.speechRate.toFixed(2)}x</span>
            </div>
            <input
              id="speech-rate"
              type="range"
              min={0.75}
              max={1.5}
              step={0.05}
              value={settings.speechRate}
              onChange={(e) => update({ speechRate: Number(e.target.value) })}
              className="mt-2 w-full accent-accent"
            />
          </div>

          {voices.length > 0 && (
            <div className="rounded-lg bg-bg-surface px-3 py-2.5">
              <label htmlFor="voice-picker" className="text-sm">
                Voice
              </label>
              <select
                id="voice-picker"
                value={settings.preferredVoice ?? ''}
                onChange={(e) => update({ preferredVoice: e.target.value || null })}
                className="mt-2 w-full rounded-md bg-bg-raised px-2 py-1.5 text-sm"
              >
                <option value="">System default</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
