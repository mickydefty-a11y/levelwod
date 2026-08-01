# Workout Timer — Feature Spec v1

## Why this matters
Every program we built has blocks with prescriptions like "5 rounds: 30 sec on, 60 sec off" or "AMRAP 12 minutes." Right now those are just text — the timer turns them into something you actually use mid-workout, one-handed, sweaty, from a few feet away.

## Timer types needed

| Type | Behavior | Example from our programs |
|---|---|---|
| **Stopwatch (For Time)** | Counts up, optionally with a cap | "Row 2000m for time" |
| **AMRAP** | Counts down from a set time, tracks rounds completed | "AMRAP 12 minutes" |
| **EMOM** | Repeating countdown per minute (or custom interval), tracks which round you're on | "Every minute for 10 minutes" |
| **Intervals (on/off)** | Alternating work/rest countdown, repeating for a set number of rounds | "6 rounds: 30 sec on, 60 sec off" — this is the most common one across our programs |
| **Simple rest timer** | Basic countdown between sets, no rounds | "Rest 90 sec between sets" |

## How it connects to the program data
Right now, program blocks just have a `prescription` string like `"6 rounds: 40 sec on, 50 sec off"` — readable by a person, but not usable by a timer without parsing free text. I'd recommend adding an optional structured field to each block:

```json
"timerConfig": {
  "type": "intervals",
  "workSeconds": 40,
  "restSeconds": 50,
  "rounds": 6
}
```

This sits alongside the existing `prescription` text (which stays as the human-readable version), so a block in a program can look like:

```json
{
  "blockType": "metcon",
  "movementId": "assault-bike",
  "prescription": "6 rounds: 40 sec on, 50 sec off",
  "timerConfig": { "type": "intervals", "workSeconds": 40, "restSeconds": 50, "rounds": 6 },
  "notes": null
}
```

Tapping that block in the app would launch a pre-filled timer, rather than the person setting it up by hand every time. For "AMRAP 12 minutes" it'd be `{ "type": "amrap", "durationSeconds": 720 }`, and so on for each type.

## Must-have behaviors
- **Screen stays awake** while a timer is running — nobody wants their phone locking mid-AMRAP
- **Audio/vibration cues**: a countdown beep in the final 3 seconds before start, and a clear signal on every round change (interval switch, EMOM minute mark)
- **Big, glanceable numbers** — readable from a few feet away, not something you need to pick up and squint at
- **Large tap targets** for start/pause/reset — usable with chalky or gloved hands, no precision tapping
- **Manual override** — always let the person adjust or start a timer manually too, in case they want to freestyle something not in a program

## Suggested UI flow
1. Person taps a workout block → timer opens pre-configured
2. Big countdown/count-up display, current round indicator if applicable (e.g. "Round 3 of 6")
3. Start / Pause / Reset controls, large and thumb-friendly
4. When it finishes, a clear "done" state — not just silence

## Retrofitting existing programs
Since our program JSON already has clean, structured prescriptions for every interval-style piece (all the assault bike/rowing/running interval blocks across all 7 programs), adding `timerConfig` to those specific blocks is mechanical, not a redesign — worth doing as a pass over the existing files once the timer itself is built, rather than rebuilding programs from scratch.
