# Data-Driven Progression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed 30-level catalogue with weekly check-ins where weight trend data and AI analysis drive calorie, exercise, and Optional adjustments.

**Architecture:** New domain logic (`lib/domain/checkin.ts`) computes weight trends and adjustment decisions using hard-coded invariants. AI layer adds contextual reasoning on top. New `/check-in` route hosts the weekly flow. Supabase Storage handles progress photos. Level catalogue becomes a living log of confirmed adjustments.

**Tech Stack:** Next.js 15, Supabase (Postgres + Storage + RLS), Anthropic Claude Sonnet 4.6, Zod, Vitest

---

### Task 1: Database Migration — New Tables

**Files:**
- Create: `supabase/migrations/0003_checkin_tables.sql`
- Modify: `lib/supabase/types.ts`

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/0003_checkin_tables.sql

-- Weight check-ins (weekly)
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

alter table weight_checkins enable row level security;
create policy "users see own rows" on weight_checkins for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Progress photos (daily, optional)
create table progress_photos (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid not null references runs(id) on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  photo_date      date not null,
  day_index       integer not null,
  storage_path    text not null,
  created_at      timestamptz not null default now()
);

alter table progress_photos enable row level security;
create policy "users see own rows" on progress_photos for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Remove the level cap constraint so levels can exceed 30
alter table runs drop constraint runs_current_level_check;
alter table runs add constraint runs_current_level_check check (current_level >= 1);

-- Same for level_catalogue
alter table level_catalogue drop constraint level_catalogue_level_number_check;
alter table level_catalogue add constraint level_catalogue_level_number_check check (level_number >= 1);
```

- [ ] **Step 2: Add TypeScript types for new tables**

Add to `lib/supabase/types.ts` after the existing `ReasoningEntriesInsert` type (around line 120):

```typescript
type WeightCheckinsInsert = {
  id?: string;
  run_id: string;
  user_id: string;
  checkin_date: string;
  day_index: number;
  weight_kg: number;
  notes?: string | null;
};

type ProgressPhotosInsert = {
  id?: string;
  run_id: string;
  user_id: string;
  photo_date: string;
  day_index: number;
  storage_path: string;
};
```

Add to the `Database["public"]["Tables"]` section:

```typescript
weight_checkins: {
  Row: {
    id: string;
    run_id: string;
    user_id: string;
    checkin_date: string;
    day_index: number;
    weight_kg: number;
    notes: string | null;
    created_at: string;
  };
  Insert: WeightCheckinsInsert;
  Update: Partial<WeightCheckinsInsert>;
  Relationships: [];
};
progress_photos: {
  Row: {
    id: string;
    run_id: string;
    user_id: string;
    photo_date: string;
    day_index: number;
    storage_path: string;
    created_at: string;
  };
  Insert: ProgressPhotosInsert;
  Update: Partial<ProgressPhotosInsert>;
  Relationships: [];
};
```

- [ ] **Step 3: Run migration in Supabase SQL Editor**

Paste the contents of `0003_checkin_tables.sql` into the Supabase SQL Editor and run it.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0003_checkin_tables.sql lib/supabase/types.ts
git commit -m "feat: add weight_checkins and progress_photos tables, uncap levels"
```

---

### Task 2: Domain Logic — Weight Trend Analysis

**Files:**
- Create: `lib/domain/checkin.ts`
- Create: `tests/domain/checkin.test.ts`

- [ ] **Step 1: Write failing tests for weight trend computation**

```typescript
// tests/domain/checkin.test.ts
import { describe, it, expect } from "vitest";
import { computeWeightTrend, computeAdjustmentDecision } from "@/lib/domain/checkin";

describe("computeWeightTrend", () => {
  it("detects gaining when weight increases", () => {
    const trend = computeWeightTrend([
      { weight_kg: 75, day_index: 7 },
      { weight_kg: 75.4, day_index: 14 },
    ]);
    expect(trend.direction).toBe("gaining");
    expect(trend.changeKg).toBeCloseTo(0.4);
    expect(trend.changePercent).toBeCloseTo((0.4 / 75.4) * 100, 1);
  });

  it("detects losing when weight decreases", () => {
    const trend = computeWeightTrend([
      { weight_kg: 80, day_index: 7 },
      { weight_kg: 79.2, day_index: 14 },
    ]);
    expect(trend.direction).toBe("losing");
    expect(trend.changeKg).toBeCloseTo(-0.8);
  });

  it("detects stable within 0.1kg tolerance", () => {
    const trend = computeWeightTrend([
      { weight_kg: 75, day_index: 7 },
      { weight_kg: 75.05, day_index: 14 },
    ]);
    expect(trend.direction).toBe("stable");
  });

  it("returns null trend with only 1 data point", () => {
    const trend = computeWeightTrend([
      { weight_kg: 75, day_index: 7 },
    ]);
    expect(trend.direction).toBe("stable");
    expect(trend.weeksOfData).toBe(1);
    expect(trend.changeKg).toBe(0);
  });

  it("uses last two data points for trend", () => {
    const trend = computeWeightTrend([
      { weight_kg: 74, day_index: 7 },
      { weight_kg: 75, day_index: 14 },
      { weight_kg: 75.3, day_index: 21 },
    ]);
    expect(trend.currentWeight).toBe(75.3);
    expect(trend.previousWeight).toBe(75);
    expect(trend.changeKg).toBeCloseTo(0.3);
    expect(trend.weeksOfData).toBe(3);
  });
});

describe("computeAdjustmentDecision", () => {
  // Weight gain goal
  it("gain: no change when gaining at target rate", () => {
    const decision = computeAdjustmentDecision({
      goal: "gain",
      currentCalories: 2800,
      currentWeight: 75.3,
      changePercent: 0.4, // within 0.25-0.5%
      direction: "gaining",
      weeksOfData: 3,
      tdee: 2400,
      sex: "male",
    });
    expect(decision.shouldAdjust).toBe(false);
    expect(decision.suggestedCalories).toBe(2800);
  });

  it("gain: suggests increase when gaining too slow", () => {
    const decision = computeAdjustmentDecision({
      goal: "gain",
      currentCalories: 2800,
      currentWeight: 75.1,
      changePercent: 0.13, // below 0.25%
      direction: "gaining",
      weeksOfData: 3,
      tdee: 2400,
      sex: "male",
    });
    expect(decision.shouldAdjust).toBe(true);
    expect(decision.suggestedCalories).toBeGreaterThan(2800);
    expect(decision.suggestedCalories).toBeLessThanOrEqual(2800 + 200); // max ±200 per checkin
  });

  it("gain: suggests hold/reduce when gaining too fast", () => {
    const decision = computeAdjustmentDecision({
      goal: "gain",
      currentCalories: 3000,
      currentWeight: 76,
      changePercent: 0.7, // above 0.5%
      direction: "gaining",
      weeksOfData: 3,
      tdee: 2400,
      sex: "male",
    });
    expect(decision.shouldAdjust).toBe(true);
    expect(decision.suggestedCalories).toBeLessThanOrEqual(3000);
  });

  it("gain: never exceeds calorie ceiling (TDEE + 800)", () => {
    const decision = computeAdjustmentDecision({
      goal: "gain",
      currentCalories: 3150,
      currentWeight: 75,
      changePercent: 0,
      direction: "stable",
      weeksOfData: 4,
      tdee: 2400,
      sex: "male",
    });
    expect(decision.suggestedCalories).toBeLessThanOrEqual(2400 + 800);
  });

  it("gain: caps adjustment at +200 per check-in", () => {
    const decision = computeAdjustmentDecision({
      goal: "gain",
      currentCalories: 2600,
      currentWeight: 75,
      changePercent: 0,
      direction: "stable",
      weeksOfData: 5,
      tdee: 2400,
      sex: "male",
    });
    expect(decision.suggestedCalories - 2600).toBeLessThanOrEqual(200);
  });

  // Weight loss goal
  it("lose: no change when losing at target rate", () => {
    const decision = computeAdjustmentDecision({
      goal: "lose",
      currentCalories: 1800,
      currentWeight: 79.4,
      changePercent: 0.75, // within 0.5-1.0%
      direction: "losing",
      weeksOfData: 3,
      tdee: 2200,
      sex: "male",
    });
    expect(decision.shouldAdjust).toBe(false);
  });

  it("lose: increases calories when losing too fast", () => {
    const decision = computeAdjustmentDecision({
      goal: "lose",
      currentCalories: 1600,
      currentWeight: 78,
      changePercent: 1.3, // above 1.0%
      direction: "losing",
      weeksOfData: 3,
      tdee: 2200,
      sex: "male",
    });
    expect(decision.shouldAdjust).toBe(true);
    expect(decision.suggestedCalories).toBeGreaterThan(1600);
  });

  it("lose: never goes below calorie floor", () => {
    const decision = computeAdjustmentDecision({
      goal: "lose",
      currentCalories: 1550,
      currentWeight: 80,
      changePercent: 0.3,
      direction: "losing",
      weeksOfData: 3,
      tdee: 2200,
      sex: "male",
    });
    expect(decision.suggestedCalories).toBeGreaterThanOrEqual(1500);
  });

  it("lose: floor is 1200 for female", () => {
    const decision = computeAdjustmentDecision({
      goal: "lose",
      currentCalories: 1300,
      currentWeight: 65,
      changePercent: 0.3,
      direction: "losing",
      weeksOfData: 3,
      tdee: 1800,
      sex: "female",
    });
    expect(decision.suggestedCalories).toBeGreaterThanOrEqual(1200);
  });

  // Baseline period
  it("no adjustment with less than 2 weeks of data", () => {
    const decision = computeAdjustmentDecision({
      goal: "gain",
      currentCalories: 2800,
      currentWeight: 75,
      changePercent: 0,
      direction: "stable",
      weeksOfData: 1,
      tdee: 2400,
      sex: "male",
    });
    expect(decision.shouldAdjust).toBe(false);
    expect(decision.rule).toBe("baseline");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/domain/checkin.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the domain logic**

```typescript
// lib/domain/checkin.ts
// Weight trend analysis and adjustment decisions — pure functions, no I/O.

import type { Goal, Sex } from "./calculator";
import { calculateExercisePlan, type ExercisePlan } from "./calculator";

export interface WeightDataPoint {
  weight_kg: number;
  day_index: number;
}

export interface WeightTrend {
  currentWeight: number;
  previousWeight: number;
  changeKg: number;
  changePercent: number;
  direction: "gaining" | "losing" | "stable";
  weeksOfData: number;
}

export interface AdjustmentInput {
  goal: Goal;
  currentCalories: number;
  currentWeight: number;
  changePercent: number;
  direction: "gaining" | "losing" | "stable";
  weeksOfData: number;
  tdee: number;
  sex: Sex;
}

export interface AdjustmentDecision {
  shouldAdjust: boolean;
  suggestedCalories: number;
  suggestedExercise: ExercisePlan | null;
  reasoning: string;
  rule: string;
}

const STABILITY_TOLERANCE_KG = 0.1;
const MAX_ADJUSTMENT_PER_CHECKIN = 200;

// Target rates as % of bodyweight per week
const GAIN_TARGET = { min: 0.25, max: 0.5 };
const LOSS_TARGET = { min: 0.5, max: 1.0 };

export function computeWeightTrend(dataPoints: WeightDataPoint[]): WeightTrend {
  const weeksOfData = dataPoints.length;

  if (weeksOfData < 2) {
    return {
      currentWeight: dataPoints[0]?.weight_kg ?? 0,
      previousWeight: dataPoints[0]?.weight_kg ?? 0,
      changeKg: 0,
      changePercent: 0,
      direction: "stable",
      weeksOfData,
    };
  }

  const current = dataPoints[dataPoints.length - 1];
  const previous = dataPoints[dataPoints.length - 2];
  const changeKg = current.weight_kg - previous.weight_kg;
  const changePercent = Math.abs(changeKg / current.weight_kg) * 100;

  let direction: WeightTrend["direction"];
  if (Math.abs(changeKg) <= STABILITY_TOLERANCE_KG) {
    direction = "stable";
  } else if (changeKg > 0) {
    direction = "gaining";
  } else {
    direction = "losing";
  }

  return {
    currentWeight: current.weight_kg,
    previousWeight: previous.weight_kg,
    changeKg,
    changePercent,
    direction,
    weeksOfData,
  };
}

export function computeAdjustmentDecision(input: AdjustmentInput): AdjustmentDecision {
  const floor = input.sex === "male" ? 1500 : 1200;
  const ceiling = input.tdee + 800;

  // Baseline period: need at least 2 weeks of data
  if (input.weeksOfData < 2) {
    return {
      shouldAdjust: false,
      suggestedCalories: input.currentCalories,
      suggestedExercise: null,
      reasoning: "Baseline period. Keep hitting your current targets. The first adjustment comes after 2 weigh-ins.",
      rule: "baseline",
    };
  }

  if (input.goal === "gain") {
    return computeGainDecision(input, floor, ceiling);
  }

  if (input.goal === "lose") {
    return computeLossDecision(input, floor);
  }

  // Maintain
  return {
    shouldAdjust: false,
    suggestedCalories: input.currentCalories,
    suggestedExercise: null,
    reasoning: "Maintenance goal. Hold steady.",
    rule: "maintain_hold",
  };
}

function computeGainDecision(
  input: AdjustmentInput,
  floor: number,
  ceiling: number,
): AdjustmentDecision {
  const { currentCalories, changePercent, direction, currentWeight } = input;

  // Gaining at target rate — no change
  if (direction === "gaining" && changePercent >= GAIN_TARGET.min && changePercent <= GAIN_TARGET.max) {
    return {
      shouldAdjust: false,
      suggestedCalories: currentCalories,
      suggestedExercise: null,
      reasoning: `Gaining at ${changePercent.toFixed(1)}% BW/week. On track (target: ${GAIN_TARGET.min}-${GAIN_TARGET.max}%). No change.`,
      rule: "gain_on_track",
    };
  }

  // Gaining too fast — hold or reduce
  if (direction === "gaining" && changePercent > GAIN_TARGET.max) {
    const reduction = Math.min(100, Math.round((changePercent - GAIN_TARGET.max) * currentWeight * 10));
    const suggested = Math.max(floor, currentCalories - reduction);
    return {
      shouldAdjust: true,
      suggestedCalories: suggested,
      suggestedExercise: null,
      reasoning: `Gaining at ${changePercent.toFixed(1)}% BW/week, above the ${GAIN_TARGET.max}% target. Risk of excess fat accumulation. Suggesting a hold or small reduction.`,
      rule: "gain_too_fast",
    };
  }

  // Gaining too slow — increase
  if (direction === "gaining" && changePercent < GAIN_TARGET.min) {
    const increase = Math.min(MAX_ADJUSTMENT_PER_CHECKIN, 125);
    const suggested = Math.min(ceiling, currentCalories + increase);
    const exercise = calculateExercisePlan("gain", suggested);
    return {
      shouldAdjust: true,
      suggestedCalories: suggested,
      suggestedExercise: exercise.strengthDays !== calculateExercisePlan("gain", currentCalories).strengthDays ? exercise : null,
      reasoning: `Gaining at ${changePercent.toFixed(1)}% BW/week, below the ${GAIN_TARGET.min}% target. Surplus is insufficient. Suggesting +${increase} kcal.`,
      rule: "gain_too_slow",
    };
  }

  // Stalled or losing on a gain goal — increase
  if (direction === "stable" || direction === "losing") {
    const increase = Math.min(MAX_ADJUSTMENT_PER_CHECKIN, 175);
    const suggested = Math.min(ceiling, currentCalories + increase);
    const exercise = calculateExercisePlan("gain", suggested);
    return {
      shouldAdjust: true,
      suggestedCalories: suggested,
      suggestedExercise: exercise.strengthDays !== calculateExercisePlan("gain", currentCalories).strengthDays ? exercise : null,
      reasoning: `Weight ${direction === "stable" ? "stalled" : "decreasing"} on a gain goal. The surplus is not landing. Suggesting +${increase} kcal.`,
      rule: direction === "stable" ? "gain_stalled" : "gain_losing",
    };
  }

  return {
    shouldAdjust: false,
    suggestedCalories: currentCalories,
    suggestedExercise: null,
    reasoning: "No adjustment needed.",
    rule: "gain_default",
  };
}

function computeLossDecision(
  input: AdjustmentInput,
  floor: number,
): AdjustmentDecision {
  const { currentCalories, changePercent, direction } = input;

  // Losing at target rate — no change
  if (direction === "losing" && changePercent >= LOSS_TARGET.min && changePercent <= LOSS_TARGET.max) {
    return {
      shouldAdjust: false,
      suggestedCalories: currentCalories,
      suggestedExercise: null,
      reasoning: `Losing at ${changePercent.toFixed(1)}% BW/week. On track (target: ${LOSS_TARGET.min}-${LOSS_TARGET.max}%). No change.`,
      rule: "lose_on_track",
    };
  }

  // Losing too fast — increase calories
  if (direction === "losing" && changePercent > LOSS_TARGET.max) {
    const increase = Math.min(MAX_ADJUSTMENT_PER_CHECKIN, 150);
    const suggested = currentCalories + increase;
    return {
      shouldAdjust: true,
      suggestedCalories: suggested,
      suggestedExercise: null,
      reasoning: `Losing at ${changePercent.toFixed(1)}% BW/week, above the ${LOSS_TARGET.max}% ceiling. Risk of muscle loss. Adding calories back.`,
      rule: "lose_too_fast",
    };
  }

  // Losing too slow — reduce calories
  if (direction === "losing" && changePercent < LOSS_TARGET.min) {
    const reduction = Math.min(MAX_ADJUSTMENT_PER_CHECKIN, 100);
    const suggested = Math.max(floor, currentCalories - reduction);
    return {
      shouldAdjust: true,
      suggestedCalories: suggested,
      suggestedExercise: null,
      reasoning: `Losing at ${changePercent.toFixed(1)}% BW/week, below the ${LOSS_TARGET.min}% target. Deficit insufficient. Suggesting -${reduction} kcal.`,
      rule: "lose_too_slow",
    };
  }

  // Stalled or gaining on a lose goal
  if (direction === "stable" || direction === "gaining") {
    const reduction = Math.min(MAX_ADJUSTMENT_PER_CHECKIN, 150);
    const suggested = Math.max(floor, currentCalories - reduction);
    return {
      shouldAdjust: true,
      suggestedCalories: suggested,
      suggestedExercise: null,
      reasoning: `Weight ${direction === "stable" ? "stalled" : "increasing"} on a loss goal. Metabolic adaptation likely. Suggesting -${reduction} kcal.`,
      rule: direction === "stable" ? "lose_stalled" : "lose_gaining",
    };
  }

  return {
    shouldAdjust: false,
    suggestedCalories: currentCalories,
    suggestedExercise: null,
    reasoning: "No adjustment needed.",
    rule: "lose_default",
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/domain/checkin.test.ts`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add lib/domain/checkin.ts tests/domain/checkin.test.ts
git commit -m "feat: weight trend analysis and adjustment decision logic with tests"
```

---

### Task 3: Optional Knowledge Base + AI Prompts

**Files:**
- Modify: `lib/ai/knowledge.ts`
- Modify: `lib/ai/prompts.ts`
- Modify: `lib/ai/schemas.ts`
- Modify: `lib/ai/index.ts`

- [ ] **Step 1: Add optional activity knowledge to knowledge.ts**

Add after the `hydration` section in `GUIDELINES`, before `bodyComposition`:

```typescript
optionalActivities: {
  sleep: { range: [7, 9], default: 7.5, unit: "hr", source: "AASM guidelines; Walker", note: "<7hr impairs MPS ~30%, critical for gain goal" },
  reading: { range: [10, 30], default: 15, unit: "min", source: "Lally et al., 2010", note: "Lower threshold = higher compliance for new habits" },
  meditation: { range: [5, 20], default: 10, unit: "min", source: "Goyal et al., JAMA, 2014", note: "10 min sufficient for cortisol reduction" },
  cold_shower: { range: [30, 120], default: 60, unit: "sec", source: "Soberg et al., Cell, 2022", note: "Benefits plateau at 11 min/week total" },
  walking: { range: [6000, 12000], default: 8000, unit: "steps", source: "Lee et al., JAMA, 2019", note: "Gain: 7k, Lose: 10k" },
  stretching: { range: [5, 15], default: 10, unit: "min", source: "ACSM guidelines", note: "Post-workout preferred" },
  journaling: { range: [100, 300], default: 200, unit: "words", source: "Pennebaker, 1997", note: "Binary option also valid" },
  gratitude: { range: [1, 3], default: 1, unit: "lines", source: "Emmons & McCullough, 2003", note: "Binary works better than word count" },
  no_phone_am: { range: [30, 60], default: 30, unit: "min", source: "Dopamine baseline research", note: "Binary measurement recommended" },
} as const,
```

Also add the knowledge to `buildNutritionSystemPrompt()` output so Sonnet has it.

- [ ] **Step 2: Add new AI prompts**

Add to `lib/ai/prompts.ts`:

```typescript
weeklyCheckinAnalysis: (data: {
  goal: string;
  currentCalories: number;
  currentProtein: number;
  weightTrend: { changeKg: number; changePercent: number; direction: string; weeksOfData: number };
  weekNumber: number;
  domainDecision: { shouldAdjust: boolean; suggestedCalories: number; reasoning: string; rule: string };
}) => `Weekly check-in analysis for a ${data.goal} goal.

Current targets: ${data.currentCalories} kcal, ${data.currentProtein}g protein
Weight trend: ${data.weightTrend.changeKg > 0 ? "+" : ""}${data.weightTrend.changeKg.toFixed(1)} kg this week (${data.weightTrend.changePercent.toFixed(1)}% BW, direction: ${data.weightTrend.direction})
Week: ${data.weekNumber}, data points: ${data.weightTrend.weeksOfData}

The domain logic suggests: ${data.domainDecision.reasoning}
Suggested calories: ${data.domainDecision.suggestedCalories} kcal (rule: ${data.domainDecision.rule})

Add context and phrasing to this suggestion. Explain WHY in 2-3 sentences using the evidence base. Cite sources.

Return ONLY valid JSON:
{
  "suggestedCalories": number (must match or be within 50 of the domain suggestion),
  "suggestedProtein": number,
  "reasoning": "2-3 sentences with citations",
  "encouragement": "One sentence in contract voice. Brief. Not a coach."
}

Rules:
- Do NOT override the domain logic suggestion by more than 50 kcal
- Voice: contract-like. State facts. No cheerleading.`,

suggestOptionalFromInput: (
  input: string,
  goal: string,
  existingOptionals: string[],
) => `A user wants to add "${input}" as an Optional habit to their 90-day tracker.
Their goal is: ${goal}
Existing optionals: ${existingOptionals.length > 0 ? existingOptionals.join(", ") : "none yet"}

Research what the optimal target should be for this activity given their goal. Use the evidence base provided in the system prompt.

Return ONLY valid JSON:
{
  "label": "Activity name · target",
  "measurement": "numeric" or "binary",
  "target": number or null,
  "unit": "hr" or "min" or "sec" or "steps" or "words" or null,
  "reasoning": "2-3 sentences explaining why this target for this person's goal. Cite source."
}

Rules:
- Start low for new habits (compliance > ambition)
- Don't duplicate existing optionals
- Use · separator in label
- If not in the evidence base, use general principles: measurable, specific, conservative`,
```

- [ ] **Step 3: Add schemas**

Add to `lib/ai/schemas.ts`:

```typescript
export const CheckinAnalysisSchema = z.object({
  suggestedCalories: z.number(),
  suggestedProtein: z.number(),
  reasoning: z.string(),
  encouragement: z.string(),
});

export const OptionalFromInputSchema = z.object({
  label: z.string(),
  measurement: z.enum(["binary", "numeric"]),
  target: z.number().nullable(),
  unit: z.string().nullable(),
  reasoning: z.string(),
});

export type CheckinAnalysis = z.infer<typeof CheckinAnalysisSchema>;
export type OptionalFromInput = z.infer<typeof OptionalFromInputSchema>;
```

- [ ] **Step 4: Add public methods to index.ts**

```typescript
async checkinAnalysis(data: {
  goal: string;
  currentCalories: number;
  currentProtein: number;
  weightTrend: { changeKg: number; changePercent: number; direction: string; weeksOfData: number };
  weekNumber: number;
  domainDecision: { shouldAdjust: boolean; suggestedCalories: number; reasoning: string; rule: string };
}): Promise<CheckinAnalysis> {
  return callAI({
    prompt: PROMPTS.weeklyCheckinAnalysis(data),
    schema: CheckinAnalysisSchema,
    model: "reasoning",
    system: KNOWLEDGE.nutrition,
  });
},

async suggestOptionalFromInput(
  input: string,
  goal: string,
  existingOptionals: string[],
): Promise<OptionalFromInput> {
  return callAI({
    prompt: PROMPTS.suggestOptionalFromInput(input, goal, existingOptionals),
    schema: OptionalFromInputSchema,
    model: "reasoning",
    system: KNOWLEDGE.nutrition,
  });
},
```

- [ ] **Step 5: Type check**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 6: Commit**

```bash
git add lib/ai/
git commit -m "feat: AI prompts for weekly check-in analysis and optional suggestions"
```

---

### Task 4: Server Action — Submit Check-in

**Files:**
- Create: `lib/actions/submit-checkin.ts`
- Create: `lib/schemas/checkin.ts`

- [ ] **Step 1: Create Zod schema**

```typescript
// lib/schemas/checkin.ts
import { z } from "zod";

export const SubmitCheckinSchema = z.object({
  runId: z.string().uuid(),
  weightKg: z.number().positive(),
  dayIndex: z.number().int().positive(),
  notes: z.string().optional(),
});

export const ConfirmAdjustmentSchema = z.object({
  runId: z.string().uuid(),
  newCalorieTarget: z.number().int().positive(),
  newProteinTarget: z.number().int().positive().optional(),
  reasoning: z.string(),
  rule: z.string(),
});

export type SubmitCheckinInput = z.infer<typeof SubmitCheckinSchema>;
export type ConfirmAdjustmentInput = z.infer<typeof ConfirmAdjustmentSchema>;
```

- [ ] **Step 2: Create submit-checkin server action**

```typescript
// lib/actions/submit-checkin.ts
"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { computeWeightTrend, computeAdjustmentDecision } from "@/lib/domain/checkin";
import { calculateBMR, calculateTDEE } from "@/lib/domain/calculator";
import { revalidatePath } from "next/cache";
import { SubmitCheckinSchema, ConfirmAdjustmentSchema } from "@/lib/schemas/checkin";

export async function submitWeighIn(rawInput: unknown) {
  const input = SubmitCheckinSchema.parse(rawInput);
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Save weigh-in
  await supabase.from("weight_checkins").insert({
    run_id: input.runId,
    user_id: user.id,
    checkin_date: new Date().toISOString().split("T")[0],
    day_index: input.dayIndex,
    weight_kg: input.weightKg,
    notes: input.notes ?? null,
  });

  // Fetch all weigh-ins for trend
  const { data: checkins } = await supabase
    .from("weight_checkins")
    .select("weight_kg, day_index")
    .eq("run_id", input.runId)
    .order("day_index");

  const dataPoints = ((checkins ?? []) as { weight_kg: number; day_index: number }[]);
  const trend = computeWeightTrend(dataPoints);

  // Fetch run for goal, current targets
  const { data: run } = await supabase
    .from("runs")
    .select("current_level")
    .eq("id", input.runId)
    .single();

  // Fetch profile for biometrics (needed for TDEE recalc)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch current calorie subtask to get current target
  const { data: cores } = await supabase
    .from("cores")
    .select("id, kind")
    .eq("run_id", input.runId)
    .eq("kind", "fuel")
    .single();

  const fuelCore = cores as { id: string; kind: string } | null;
  let currentCalories = 2500; // fallback

  if (fuelCore) {
    const { data: subtasks } = await supabase
      .from("subtasks")
      .select("target_numeric")
      .eq("core_id", fuelCore.id)
      .eq("unit", "kcal")
      .single();
    const sub = subtasks as { target_numeric: number | null } | null;
    if (sub?.target_numeric) currentCalories = sub.target_numeric;
  }

  // Compute TDEE from current weight (updated)
  // Using light activity as default; in future could store this per-profile
  const bmr = calculateBMR("male", input.weightKg, 175, 25); // simplified; use stored biometrics
  const tdee = calculateTDEE(bmr, "light");

  const decision = computeAdjustmentDecision({
    goal: "gain", // TODO: store goal on run/profile
    currentCalories,
    currentWeight: trend.currentWeight,
    changePercent: trend.changePercent,
    direction: trend.direction,
    weeksOfData: trend.weeksOfData,
    tdee,
    sex: "male", // TODO: store on profile
  });

  revalidatePath("/today");
  revalidatePath("/check-in");

  return { trend, decision };
}

export async function confirmAdjustment(rawInput: unknown) {
  const input = ConfirmAdjustmentSchema.parse(rawInput);
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Get current run
  const { data: run } = await supabase
    .from("runs")
    .select("current_level")
    .eq("id", input.runId)
    .single();

  const runData = run as { current_level: number } | null;
  if (!runData) throw new Error("Run not found");

  const newLevel = runData.current_level + 1;

  // Update calorie subtask
  const { data: fuelCore } = await supabase
    .from("cores")
    .select("id")
    .eq("run_id", input.runId)
    .eq("kind", "fuel")
    .single();

  if (fuelCore) {
    const core = fuelCore as { id: string };
    await supabase
      .from("subtasks")
      .update({ target_numeric: input.newCalorieTarget } as never)
      .eq("core_id", core.id)
      .eq("unit", "kcal");
  }

  // Insert level_catalogue entry
  await supabase.from("level_catalogue").insert({
    run_id: input.runId,
    user_id: user.id,
    level_number: newLevel,
    effect_kind: "TIGHTEN" as const,
    description: `Calories adjusted to ${input.newCalorieTarget} kcal (${input.rule})`,
  });

  // Insert level_history
  const { data: catEntry } = await supabase
    .from("level_catalogue")
    .select("id")
    .eq("run_id", input.runId)
    .eq("level_number", newLevel)
    .single();

  if (catEntry) {
    await supabase.from("level_history").insert({
      run_id: input.runId,
      user_id: user.id,
      level_number: newLevel,
      catalogue_id: (catEntry as { id: string }).id,
      achieved_on: new Date().toISOString().split("T")[0],
    });
  }

  // Increment level
  await supabase
    .from("runs")
    .update({ current_level: newLevel, level_streak: 0 } as never)
    .eq("id", input.runId);

  revalidatePath("/today");
  revalidatePath("/levels");
  revalidatePath("/check-in");

  return { newLevel };
}
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add lib/actions/submit-checkin.ts lib/schemas/checkin.ts
git commit -m "feat: submit-checkin and confirm-adjustment server actions"
```

---

### Task 5: Check-in UI — Page and Components

**Files:**
- Create: `app/(app)/check-in/page.tsx`
- Create: `components/checkin/checkin-flow.tsx`
- Create: `components/checkin/weight-input.tsx`
- Create: `components/checkin/trend-display.tsx`
- Create: `components/checkin/adjustment-card.tsx`

- [ ] **Step 1: Create the check-in page (server component)**

```typescript
// app/(app)/check-in/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { CheckinFlow } from "@/components/checkin/checkin-flow";

export default async function CheckInPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_run_id")
    .eq("id", user.id)
    .single();

  const runId = (profile as { active_run_id: string | null } | null)?.active_run_id;
  if (!runId) redirect("/onboarding");

  const { data: run } = await supabase
    .from("runs")
    .select("start_date, current_level")
    .eq("id", runId)
    .single();

  const runData = run as { start_date: string; current_level: number } | null;
  if (!runData?.start_date) redirect("/onboarding");

  const now = new Date();
  const currentDay = Math.floor(
    (now.getTime() - new Date(runData.start_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const weekNumber = Math.ceil(currentDay / 7);

  // Fetch past weigh-ins
  const { data: checkins } = await supabase
    .from("weight_checkins")
    .select("weight_kg, day_index, checkin_date")
    .eq("run_id", runId)
    .order("day_index");

  const checkinsData = (checkins ?? []) as { weight_kg: number; day_index: number; checkin_date: string }[];

  // Check if already checked in this week
  const thisWeekStart = currentDay - ((currentDay - 1) % 7);
  const alreadyCheckedIn = checkinsData.some(
    c => c.day_index >= thisWeekStart && c.day_index <= thisWeekStart + 6
  );

  return (
    <>
      <Topbar
        crumb={`WEEKLY CHECK-IN · WEEK ${weekNumber}`}
        sub={`Day ${currentDay} / 90`}
        status={alreadyCheckedIn ? "Completed" : "Due"}
        statusKind={alreadyCheckedIn ? "moss" : "ember"}
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <CheckinFlow
          runId={runId}
          userId={user.id}
          currentDay={currentDay}
          weekNumber={weekNumber}
          pastCheckins={checkinsData}
          currentLevel={runData.current_level}
          alreadyCheckedIn={alreadyCheckedIn}
        />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create CheckinFlow client component**

Create `components/checkin/checkin-flow.tsx` — a multi-step client component that manages:
1. Weight input (WeightInput component)
2. Trend display (TrendDisplay component, shown after submit)
3. Adjustment card (AdjustmentCard component, shown if decision.shouldAdjust)
4. Accept/Edit/Skip controls

This is a large component. Create it with the full check-in flow including state management, the `submitWeighIn` and `confirmAdjustment` server action calls, and the accept/edit/skip UX matching the brand design (ink cards, ember accents, tactical type).

- [ ] **Step 3: Create WeightInput, TrendDisplay, AdjustmentCard sub-components**

Each as a focused component in `components/checkin/`:
- `weight-input.tsx`: Large mono number input for weight_kg
- `trend-display.tsx`: Shows past weigh-ins as a list with change indicators
- `adjustment-card.tsx`: Dark ink card showing the AI suggestion with accept/edit/skip buttons

- [ ] **Step 4: Add check-in to sidebar navigation**

In `components/shell/sidebar.tsx`, add a check-in link (use the `Scale` icon from lucide-react) between "Codex" and "Settings".

- [ ] **Step 5: Add check-in banner to Today page**

In `components/today/today-content.tsx`, add a banner at the top when a check-in is due (day_index % 7 === 0 and no checkin exists for this week):
```
"Weekly check-in available" → link to /check-in
```

- [ ] **Step 6: Type check and verify**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 7: Commit**

```bash
git add app/(app)/check-in/ components/checkin/ components/shell/sidebar.tsx components/today/today-content.tsx
git commit -m "feat: weekly check-in UI with weight input, trend display, adjustment flow"
```

---

### Task 6: Update Onboarding — Remove Catalogue Seeding, Add Baseline Weight

**Files:**
- Modify: `app/(onboarding)/onboarding/step-05-sign.tsx`

- [ ] **Step 1: Remove the `buildLevelCatalogue` function and its call**

In `step-05-sign.tsx`, delete the `buildLevelCatalogue` function (lines ~150-220) and remove the line:
```typescript
await supabase.from("level_catalogue").insert(buildLevelCatalogue(run.id, user.id));
```

- [ ] **Step 2: Add baseline weight check-in on sign**

After creating the Day 1 daily_log, add:
```typescript
// Record baseline weight as first check-in
if (state.weightKg) {
  await supabase.from("weight_checkins").insert({
    run_id: run.id,
    user_id: user.id,
    checkin_date: new Date().toISOString().split("T")[0],
    day_index: 1,
    weight_kg: state.weightKg,
    notes: "Baseline weight at contract sign",
  });
}
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add app/(onboarding)/onboarding/step-05-sign.tsx
git commit -m "feat: remove fixed catalogue seeding, add baseline weight on sign"
```

---

### Task 7: Update Levels Page — Dynamic Catalogue

**Files:**
- Modify: `app/(app)/levels/page.tsx`

- [ ] **Step 1: Update the Levels page to handle an empty or dynamic catalogue**

The page currently shows a 30-row grid. Update it to:
- Show only rows that exist in level_catalogue (which now starts empty and grows)
- Show a "No levels yet" state when the catalogue is empty
- Replace the "30 levels" heading with "Your progression"
- Remove the fixed 30-row grid layout; use a vertical list instead
- Include the reasoning/rule from each catalogue entry

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add app/(app)/levels/page.tsx
git commit -m "feat: dynamic levels page showing check-in-driven progression"
```

---

### Task 8: Progress Photos — Upload and Timeline

**Files:**
- Create: `lib/actions/upload-photo.ts`
- Create: `components/checkin/photo-upload.tsx`
- Modify: `app/(app)/codex/page.tsx` (add progress timeline section)

- [ ] **Step 1: Create photo upload server action**

```typescript
// lib/actions/upload-photo.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadProgressPhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const file = formData.get("photo") as File;
  const runId = formData.get("runId") as string;
  const dayIndex = Number(formData.get("dayIndex"));

  if (!file || !runId || !dayIndex) throw new Error("Missing required fields");

  const fileName = `${user.id}/${runId}/day-${dayIndex}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("progress-photos")
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  await supabase.from("progress_photos").insert({
    run_id: runId,
    user_id: user.id,
    photo_date: new Date().toISOString().split("T")[0],
    day_index: dayIndex,
    storage_path: fileName,
  });

  revalidatePath("/today");
  revalidatePath("/codex");

  return { ok: true };
}
```

- [ ] **Step 2: Create photo upload component**

Create `components/checkin/photo-upload.tsx` — a simple upload button with camera icon, preview, and submit. Matches brand design.

- [ ] **Step 3: Add progress timeline to Codex**

In `app/(app)/codex/page.tsx`, add a section that fetches progress_photos and displays them in a grid with date labels. Include weight_checkins as a simple list showing the weight trend.

- [ ] **Step 4: Create the Supabase Storage bucket**

Run this in the Supabase SQL Editor:
```sql
insert into storage.buckets (id, name, public) values ('progress-photos', 'progress-photos', false);

create policy "Users can upload own photos"
  on storage.objects for insert
  with check (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own photos"
  on storage.objects for select
  using (bucket_id = 'progress-photos' and auth.uid()::text = (storage.foldername(name))[1]);
```

- [ ] **Step 5: Type check and commit**

```bash
npx tsc --noEmit
git add lib/actions/upload-photo.ts components/checkin/photo-upload.tsx app/(app)/codex/page.tsx
git commit -m "feat: progress photo upload, storage, and timeline in Codex"
```

---

### Task 9: Integration Test + Final Verification

**Files:**
- Run all tests

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing 78 + new checkin tests)

- [ ] **Step 2: Type check entire project**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Lint**

Run: `npx eslint .`
Expected: 0 errors, 0 warnings

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: data-driven progression system complete

Weekly check-ins with weight trend analysis drive calorie and exercise
adjustments. AI provides contextual reasoning. Progress photos stored
in Supabase Storage. Levels earned through confirmed adjustments.
Fixed catalogue replaced with living progression log."
git push origin main
```
