# Movement Data Schema — v1

This is the structure every movement in the app will follow. It's written so you can review the *shape* of the data without needing to read code — the actual file (`movements.example.json`, alongside this one) shows it fully populated with real examples.

## Every movement has these core fields

| Field | What it means | Example |
|---|---|---|
| `id` | Unique short code for this movement | `"back-squat"` |
| `name` | Display name | `"Back Squat"` |
| `category` | Top-level bucket | `"Strength & Weightlifting"` |
| `subcategory` | Your groupings | `"Powerlifting"` |
| `type` | `progression`, `tutorial`, or `composite` | `"progression"` |
| `equipment` | What's needed | `["Barbell", "Squat Rack"]` |
| `prerequisites` | Other movement IDs that should come first | `["air-squat"]` |
| `variantOf` | If this is a variant of another movement, its ID | `"clean"` (for Power Clean) |
| `description` | Short plain-English summary | *"The foundational squat pattern..."* |
| `commonFaults` | Things to watch for, with fixes | *"Knees caving in — cue: 'knees out'"* |
| `media` | Slots for your video + thumbnail | filled in once you upload footage |

### Filling in `media.video` once you've recorded and uploaded a movement

The app already knows how to embed a YouTube video the moment `media.video` is set — paste in any of these and it'll work:
- a bare video ID, e.g. `"dQw4w9WgXcQ"`
- a share link, e.g. `"https://youtu.be/dQw4w9WgXcQ"`
- a full watch link, e.g. `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`

Leave it `null` until you have real footage — that's what every movement has today.

## Then, depending on `type`:

**If `type: "progression"`** — has a `stages` list. Each stage has:
- `level` (Beginner / Intermediate / RX / Elite)
- `name` and `description`
- `graduationCriteria` — what "ready for next stage" looks like (e.g. "15 unbroken reps")

**If `type: "tutorial"`** — has a `scaling` list instead of stages. Each entry has:
- `level` (Beginner / RX / Elite)
- `description` — how load/distance/reps scale at that level

**If `type: "composite"`** — has a `requiredMovements` list: the IDs of parent movements that must reach RX before this one unlocks, e.g. Clean & Jerk requires Clean (RX) + Split Jerk (RX).

## Why this matters for the app later
- **Progressions screen**: filters/sorts by `category` → `subcategory` → shows `stages` as a visual ladder.
- **Programs**: a structured program just references a list of movement IDs + which stage/level to use each week — it doesn't duplicate content.
- **Search/filter**: `equipment` and `level` tags power a "show me bodyweight-only, beginner movements" type filter.
- **Progress tracking**: user's saved progress is just "movement ID → current stage reached" — small and simple to store, even fully local with no account.

See `movements.example.json` for three fully worked examples — one of each type — showing exactly how this looks as real data.
