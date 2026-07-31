# Structured Program Schema — v1

Programs don't contain movement content themselves — they just **reference** movement IDs and stages from the library we already built. This means editing a movement's content never breaks a program, and one movement update improves every program that uses it.

## Program-level fields

| Field | What it means | Example |
|---|---|---|
| `id` | Unique code | `"beginner-foundations-12wk"` |
| `name` | Display name | `"Beginner Foundations"` |
| `level` | Target audience | `"Beginner"` |
| `durationWeeks` | Length of the program | `12` |
| `description` | Plain-English summary | *"A 12-week on-ramp covering the core movement patterns..."* |
| `daysPerWeek` | How many training days | `3` |
| `weeks` | The actual week-by-week content | *(see below)* |

## Each week has

- `weekNumber`
- `focus` — short theme for the week (e.g. "Squat mechanics + conditioning base")
- `days` — a list of training days

## Each day has

- `dayNumber` / `name` (e.g. "Day 1 — Lower Body")
- `blocks` — an ordered list of what to actually do

## Each block has

| Field | Meaning |
|---|---|
| `blockType` | `warmup`, `skill`, `strength`, `metcon`, `mobility`, or `cooldown` |
| `movementId` | Which movement this references |
| `targetStageId` | Which specific stage to work (optional — omit for tutorials) |
| `prescription` | Sets/reps/time/load, in plain text | e.g. `"3 sets x 8 reps, moderate load"` |
| `notes` | Any coaching note specific to this placement in the program |

## Why this structure works well

- **A "beginner" program can only reference Beginner/Intermediate stage IDs** — so as a user progresses through the movement library, later programs can safely reference RX stages without duplicating any content.
- **Progress tracking becomes simple**: the app just needs to know "user is on Program X, Week Y, Day Z" plus their per-movement stage progress — both very small, simple things to store, even fully local with no account.
- **Swapping movements is easy**: if a program calls for Pistol Squats but a user can't do them yet, the app can suggest an easier movement from the same subcategory (Squatting) without a program rewrite — it just needs the category/subcategory tags we already built in.
- **Programs can be short or long**: a "6-week mobility reset" and a "12-week beginner foundations" program use the exact same schema, just different lengths and block choices.

See `program.example.json` for one fully worked week, showing exactly how a real day looks assembled from blocks.
