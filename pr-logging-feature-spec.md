# PR Logging & History — Feature Spec v1

## Why this matters
Every program we built ends with a retest week, and plenty of individual days include lines like "work up to a new heavy set of 3 reps" or "test max unbroken reps." Right now those are just instructions — this feature is what actually captures the number, so the payoff (seeing real progress) becomes visible rather than just a feeling.

## What counts as a loggable number
Different movements need different kinds of numbers, so this isn't one-size-fits-all:

| Metric type | Example | Unit |
|---|---|---|
| **Weight** | Back Squat 1RM, Deadlift working set | kg or lb |
| **Time** | 2k row, 5k run, "for time" pieces | mm:ss |
| **Reps** | Max unbroken strict pull-ups, max double unders | count |
| **Hold time** | Max freestanding handstand hold, plank hold | mm:ss |
| **Distance** | Max handstand walk distance, broad jump | m or ft |

A single movement can have more than one metric worth tracking (e.g. Back Squat could log both a working weight and, later, a true 1RM) — so entries are tagged by metric type, not just attached blindly to a movement.

## Data model

```json
{
  "id": "pr_20260731_backsquat_weight",
  "movementId": "back-squat",
  "metricType": "weight",
  "value": 70,
  "unit": "kg",
  "date": "2026-07-31",
  "programContext": "strength-focus-8wk / week 8 / day 1",
  "notes": null
}
```

- `programContext` is optional but useful — it lets the app show "this PR was set during your Strength Focus testing week" rather than just a bare number
- Entries are stored per-movement, so a movement's page can pull its full history with one lookup (storage key pattern: `pr-history:{movementId}`, storing an array of entries — keeps it to one read/write per movement rather than one per entry)

## How it connects to the program data
Similar to the timer's `timerConfig`, I'd suggest adding a small optional flag to relevant blocks:

```json
{
  "blockType": "strength",
  "movementId": "back-squat",
  "prescription": "Work up to a new heavy set of 3 reps",
  "logPrompt": { "metricType": "weight", "suggestedLabel": "New 3-rep back squat" }
}
```

When someone completes a block with `logPrompt` present, the app can surface a quick "log your number?" prompt right there — rather than expecting people to remember to go find the movement page later. This is a mechanical pass over the existing test-week blocks across all 7 programs (they already read like PR prompts in plain English — e.g. "Work up to a new 1-rep max," "Test max unbroken double unders") — nothing needs to be rewritten, just tagged.

## Must-have behaviors
- **Fast logging** — 2 taps max from finishing a lift to a number being saved (open prompt → type number → done). No multi-screen forms.
- **Auto-filled context** — date defaults to today, movement is pre-selected when logged from a program block
- **Manual logging too** — a "+ Log a number" option on any movement page, not just from programmed retests, for people who PR outside the program's schedule
- **Simple history view per movement** — a short list (most recent first) plus a basic trend line if there are 3+ entries; no need for anything more elaborate than that for v1
- **Unit consistency per movement** — once someone logs in kg, keep defaulting to kg for that movement (avoid mixed-unit confusion in the history)

## What to deliberately leave out of v1
- No comparing PRs against other users (no accounts, no leaderboard — fits the "hobby, not a business" scope)
- No auto-calculated 1RM estimates from rep-max formulas — just log what actually happened, keep it honest
- No editing history entries after the fact beyond basic delete — keeps the data model simple

## Suggested UI flow
1. Person finishes a block with `logPrompt` → sees "Log your back squat?" with a number input pre-focused
2. Enters the number, taps save → done, toast confirms
3. Movement page now shows an updated "Personal bests" section: current best number, small history list below it, trend line if enough data points exist
