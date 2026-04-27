# Data-Driven Progression System

**Date:** 2026-04-27
**Status:** Design
**Replaces:** Fixed 30-level catalogue (level_catalogue seeded at onboarding)

## Summary

Replace the predetermined 30-level progression with a data-driven system where weekly check-ins (weigh-ins + AI analysis) drive calorie, exercise, and Optional adjustments. Daily progress photos provide visual accountability. Levels are earned through confirmed adjustments, not arbitrary streaks.

## Data Collection

### Daily
- **Task completions** (existing, unchanged)
- **Progress photo** (optional). Stored in Supabase Storage. Tagged with date and day_index. Missing a photo does not affect day qualification.

### Weekly (every 7 days, starting Day 7)
- **Weigh-in**: single number in kg, submitted by user
- **Trend computation**: weekly average, rate of change (% BW/week), direction

### New DB Tables

```sql
create table weight_checkins (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  checkin_date    date not null,
  day_index       integer not null,
  weight_kg       numeric not null check (weight_kg > 0),
  notes           text,
  created_at      timestamptz not null default now(),
  unique(run_id, checkin_date)
);

create table progress_photos (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  photo_date      date not null,
  day_index       integer not null,
  storage_path    text not null,
  created_at      timestamptz not null default now()
);
```

RLS policies follow the same `user_id = auth.uid()` pattern as all other tables.

## Weekly Check-in Flow

### Part 1: Body Data
- Weight input (large mono number input)
- If week 2+: weight trend line (last N weigh-ins)
- If photos exist: side-by-side Day 1 vs latest
- Current targets displayed for reference

### Part 2: AI Analysis + Adjustment
1. **Pure math** computes the trend (no AI):
   - Weight change this week (kg)
   - Rate as % of bodyweight
   - Direction: gaining / losing / stable (within 0.1kg tolerance)

2. **Sonnet** receives: current targets, goal, weight trend, week number, nutrition knowledge base. Returns: suggested calorie adjustment with reasoning.

3. **User sees** the suggestion with clear reasoning and can:
   - **Accept** the suggested number
   - **Edit** to their own number
   - **Skip** this week (no change applied)

4. **If accepted or edited**: new target saved, level increments, level_catalogue gets a new row.

### Part 3: Optional Suggestions (every 3rd confirmed check-in)
When user has completed 3 check-ins where they accepted or edited an adjustment (not skipped):
- AI suggests 2-3 Optionals based on goal + existing optionals
- User can also type their own (e.g., "sleep")
- AI researches optimal target for that activity and returns a specific, evidence-based suggestion
- User confirms or skips

### Baseline Period
- Day 7: First weigh-in. Informational only ("Here's your baseline").
- Day 14: First real adjustment opportunity (2 data points = a trend).
- Weekly check-in habit starts from week 1 regardless.

## Adjustment Invariants (Hard Rules)

These are enforced in domain logic, not left to AI discretion.

### Weight Gain Goal

| Weight Trend | Action | Rationale |
|---|---|---|
| Gaining at target rate (0.25-0.5% BW/wk) | No change | Working as intended |
| Gaining above target (>0.5% BW/wk) | Hold or reduce by 50-100 kcal | Excessive fat accumulation |
| Gaining below target (<0.25% BW/wk) | Suggest +100-150 kcal | Surplus insufficient |
| Stalled (no gain in 2+ weeks) | Suggest +150-200 kcal | Surplus not landing |

### Weight Loss Goal

| Weight Trend | Action | Rationale |
|---|---|---|
| Losing at target rate (0.5-1.0% BW/wk) | No change | Working as intended |
| Losing too fast (>1.0% BW/wk) | Increase by 100-200 kcal | Muscle loss risk |
| Losing too slow (<0.5% BW/wk) | Suggest -100 kcal or +1k steps | Deficit insufficient |
| Stalled (no loss in 2+ weeks) | Suggest -150 kcal or +2k steps | Metabolic adaptation |

### Hard Ceilings and Floors

```
Weight Gain:
  Max calorie target = TDEE + 600 (lean) or TDEE + 800 (absolute max)
  AI cannot suggest above the ceiling regardless of trend

Weight Loss:
  Min calorie target = 1500 (male) / 1200 (female)
  AI cannot suggest below the floor

Both:
  Max protein = 250g or 2.5 g/kg (whichever is lower)
  Calorie adjustment per check-in capped at ±200 kcal (no wild swings)
```

### The Core Rule
**Calories only increase when weight is stalling or below target rate.** If weight is increasing at or above the target rate, the system never suggests adding more calories. This prevents runaway surplus.

## Exercise Auto-Adjustment

Exercise frequency is derived from calorie target (existing `calculateExercisePlan()`). When a calorie adjustment crosses a threshold, the check-in also suggests updating exercise days.

Example flow:
- Week 4 check-in: calories go from 2,900 → 3,050
- `shouldUpdateExercise()` detects threshold crossing (3,000)
- Check-in shows: "Your calories now support a 4th gym day. Adjust schedule?"
- User confirms → schedule updated, separate level_catalogue entry

## Progression System (replaces fixed catalogue)

### How Levels Work
- Level 1: Starting state (onboarding complete)
- Each confirmed calorie/exercise adjustment = +1 level
- Each confirmed Optional addition = +1 level
- Skipping a check-in = no change
- No hard cap (can exceed 30 if adjustments are frequent)

### Level Catalogue Evolution
Starts empty at onboarding (no more seeding 30 rows). Each check-in confirmation inserts a row:

```
Level 2: TIGHTEN — Calories 2,800 → 2,950 (weight stalled 2 weeks, +150)
Level 3: UNLOCK  — Sleep · 7.5 hr (AI suggested based on recovery data)
Level 4: TIGHTEN — Calories 2,950 → 3,050 (below target gain rate)
Level 5: TIGHTEN — Exercise 3x → 4x/wk (calories crossed 3,000 threshold)
Level 6: UNLOCK  — Reading · 15 min (user initiated, AI set target)
```

### Consistency Floor
If someone's targets are perfectly dialed (no adjustments needed for 3 consecutive weeks), the system offers an Optional unlock opportunity. Ensures progression doesn't stall when the body data says "hold steady."

## Optional Knowledge Base

When a user types an activity, the AI matches it against this evidence base to suggest specific targets:

| Activity | Range | Default | Source | Goal Note |
|---|---|---|---|---|
| Sleep | 7-9 hr | 7.5 hr | AASM guidelines; Walker | <7hr impairs MPS ~30% |
| Reading | 10-30 min | 15 min | Lally et al., 2010 | Lower threshold = higher compliance |
| Meditation | 5-20 min | 10 min | Goyal et al., JAMA, 2014 | 10 min sufficient for cortisol reduction |
| Cold shower | 30-120 sec | 60 sec | Soberg et al., Cell, 2022 | Benefits plateau at 11 min/week total |
| Walking | 6k-12k steps | goal-based | Lee et al., JAMA, 2019 | Gain: 7k, Lose: 10k |
| Stretching | 5-15 min | 10 min | ACSM guidelines | Post-workout preferred |
| Journaling | 100-300 words | 200 words | Pennebaker, 1997 | Binary also valid |
| Hydration | 30-40 mL/kg | 33 mL/kg | IOM DRI, 2004 | +500mL per hour exercise |
| Gratitude | 1-3 lines | binary | Emmons & McCullough, 2003 | Binary better than word count |
| No phone AM | 30-60 min | 30 min | binary | Dopamine baseline research |

For activities not in this list, AI uses general principles: start low, make it measurable, binary if not quantifiable.

## Onboarding Changes

### What Changes
- **Step 05 (Sign)**: No longer seeds 30 level_catalogue rows. Catalogue starts empty.
- **Step 03 (Targets)**: Unchanged (biometric questionnaire still calculates initial targets)
- **Step 04 (Schedule)**: Exercise days now auto-computed from calorie target, shown as recommendation user can accept

### What's Added
- Onboarding stores initial weight as the first weight_checkin (baseline)
- Photo upload prompt on onboarding completion: "Take your Day 1 photo" (optional)

## New UI Surfaces

### Weekly Check-in Page (/check-in)
- Triggered when day_index % 7 === 0 and no checkin exists for this week
- Banner on Today page: "Weekly check-in available"
- Full-screen flow: weight input → trend → AI suggestion → confirm/edit/skip → optional suggestions

### Progress Timeline (in Codex or /progress)
- Photo grid: all progress photos in chronological order
- Weight chart: line graph of all weigh-ins
- Level history: timeline of all adjustments with reasoning

## Domain Logic (Pure Functions)

### Weight Trend Analysis
```typescript
interface WeightTrend {
  currentWeight: number;
  previousWeight: number;
  changeKg: number;
  changePercent: number;  // as % of bodyweight
  direction: "gaining" | "losing" | "stable";
  weeksOfData: number;
}
```

### Adjustment Decision
```typescript
interface AdjustmentDecision {
  shouldAdjust: boolean;
  suggestedCalories: number;
  suggestedExercise: ExercisePlan | null;
  reasoning: string;
  rule: string;  // which invariant triggered this
}
```

The pure function computes the decision. The AI adds context and phrasing. The domain logic has veto power over the AI (ceiling/floor enforcement).

## AI Additions

### New Prompts
- `weeklyCheckinAnalysis`: weight trend + current targets → adjustment suggestion
- `suggestOptionalFromInput`: user text (e.g., "sleep") → evidence-based Optional with specific target

### Model Usage
- Trend computation: pure math (no AI)
- Adjustment suggestion: Sonnet with nutrition knowledge
- Optional structuring: Sonnet with optional knowledge base

## Migration Path

1. Add new tables (weight_checkins, progress_photos)
2. Add Supabase Storage bucket for photos
3. Update onboarding to not seed level_catalogue
4. Build check-in flow
5. Update Levels page to show dynamic catalogue
6. Existing runs with seeded catalogues continue to work (backward compatible)

## What We're NOT Building

- AI analysis of progress photos (no computer vision)
- Meal tracking or food logging
- Workout programming (we track frequency, not exercises)
- Social features or sharing progress photos
- Automated daily reminders (in-app prompt only)
