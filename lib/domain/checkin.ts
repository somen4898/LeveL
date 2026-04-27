// Weight trend analysis and calorie adjustment decision logic.
// Pure functions, no I/O. Implements the weekly check-in adjustment rules.

import { Goal, Sex, ExercisePlan, calculateExercisePlan } from "@/lib/domain/calculator";

export type { Goal, Sex, ExercisePlan };

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

/**
 * Computes weight trend from an array of data points.
 * Uses the last two data points; weeksOfData is derived from day_index range / 7.
 */
export function computeWeightTrend(dataPoints: WeightDataPoint[]): WeightTrend {
  if (dataPoints.length === 0) {
    throw new Error("At least one data point is required");
  }

  const sorted = [...dataPoints].sort((a, b) => a.day_index - b.day_index);

  if (sorted.length === 1) {
    return {
      currentWeight: sorted[0].weight_kg,
      previousWeight: sorted[0].weight_kg,
      changeKg: 0,
      changePercent: 0,
      direction: "stable",
      weeksOfData: 1,
    };
  }

  const prev = sorted[sorted.length - 2];
  const curr = sorted[sorted.length - 1];

  const changeKg = curr.weight_kg - prev.weight_kg;
  const changePercent = (changeKg / prev.weight_kg) * 100;

  let direction: "gaining" | "losing" | "stable";
  if (Math.abs(changeKg) <= STABILITY_TOLERANCE_KG) {
    direction = "stable";
  } else if (changeKg > 0) {
    direction = "gaining";
  } else {
    direction = "losing";
  }

  const daySpan = sorted[sorted.length - 1].day_index - sorted[0].day_index;
  const weeksOfData = Math.max(1, Math.round(daySpan / 7));

  return {
    currentWeight: curr.weight_kg,
    previousWeight: prev.weight_kg,
    changeKg,
    changePercent,
    direction,
    weeksOfData,
  };
}

/**
 * Computes an adjustment decision based on current trend vs. goal.
 * Enforces hard limits: ceiling = TDEE + 800, floor = 1500 (male) / 1200 (female),
 * max adjustment per check-in = ±200 kcal.
 * Requires at least 2 weeks of data before suggesting any adjustment.
 */
export function computeAdjustmentDecision(input: AdjustmentInput): AdjustmentDecision {
  const { goal, currentCalories, changePercent, direction, weeksOfData, tdee, sex } = input;

  const floor = sex === "male" ? 1500 : 1200;
  const ceiling = tdee + 800;
  const absChange = Math.abs(changePercent);

  // Baseline rule: not enough data yet
  if (weeksOfData < 2) {
    return {
      shouldAdjust: false,
      suggestedCalories: currentCalories,
      suggestedExercise: null,
      reasoning:
        "Not enough data yet. At least 2 weeks of check-ins are needed before adjusting calories.",
      rule: "baseline",
    };
  }

  let delta = 0;
  let rule = "";
  let reasoning = "";

  if (goal === "gain") {
    const stalled = direction === "stable" && weeksOfData >= 2;
    const tooSlow = direction !== "gaining" || absChange < 0.25;
    const onTrack = direction === "gaining" && absChange >= 0.25 && absChange <= 0.5;
    const tooFast = direction === "gaining" && absChange > 0.5;

    if (stalled && direction === "stable") {
      delta = 175; // midpoint of 150–200
      rule = "gain_stalled";
      reasoning = `Weight has stalled for ${weeksOfData} weeks. Suggesting +175 kcal to restart progress.`;
    } else if (tooFast) {
      // CORE RULE: weight increasing at or above target — hold or reduce
      delta = -75; // midpoint of hold (0) to -100; use -75 as representative reduction
      rule = "gain_too_fast";
      reasoning = `Gaining ${changePercent.toFixed(2)}%/week — above the 0.5% target. Reducing by 75 kcal to slow the rate.`;
    } else if (onTrack) {
      delta = 0;
      rule = "gain_on_track";
      reasoning = `Gaining ${changePercent.toFixed(2)}%/week — within the 0.25–0.5% target range. No change needed.`;
    } else if (tooSlow) {
      delta = 125; // midpoint of 100–150
      rule = "gain_too_slow";
      reasoning = `Gaining ${changePercent.toFixed(2)}%/week — below the 0.25% target. Suggesting +125 kcal to accelerate progress.`;
    }
  } else if (goal === "lose") {
    const stalled = direction === "stable" && weeksOfData >= 2;
    const tooFast = direction === "losing" && absChange > 1.0;
    const onTrack = direction === "losing" && absChange >= 0.5 && absChange <= 1.0;
    const tooSlow = !stalled && (direction !== "losing" || absChange < 0.5);

    if (stalled) {
      delta = -150;
      rule = "lose_stalled";
      reasoning = `Weight has stalled for ${weeksOfData} weeks. Suggesting -150 kcal to restart fat loss.`;
    } else if (tooFast) {
      delta = 150; // midpoint of 100–200
      rule = "lose_too_fast";
      reasoning = `Losing ${absChange.toFixed(2)}%/week — above the 1.0% limit. Increasing by 150 kcal to protect muscle.`;
    } else if (onTrack) {
      delta = 0;
      rule = "lose_on_track";
      reasoning = `Losing ${absChange.toFixed(2)}%/week — within the 0.5–1.0% target range. No change needed.`;
    } else if (tooSlow) {
      delta = -100;
      rule = "lose_too_slow";
      reasoning = `Losing ${absChange.toFixed(2)}%/week — below the 0.5% target. Suggesting -100 kcal to increase the deficit.`;
    }
  } else {
    // maintain
    return {
      shouldAdjust: false,
      suggestedCalories: currentCalories,
      suggestedExercise: null,
      reasoning: "Maintenance goal — no calorie adjustment needed.",
      rule: "maintain_no_change",
    };
  }

  if (delta === 0) {
    return {
      shouldAdjust: false,
      suggestedCalories: currentCalories,
      suggestedExercise: null,
      reasoning,
      rule,
    };
  }

  // Cap delta to ±200 per check-in
  const cappedDelta = Math.max(-200, Math.min(200, delta));

  // Compute raw suggested calories and enforce hard limits
  const rawSuggested = currentCalories + cappedDelta;
  const suggestedCalories = Math.max(floor, Math.min(ceiling, rawSuggested));

  const actuallyChanged = suggestedCalories !== currentCalories;

  const suggestedExercise = actuallyChanged ? calculateExercisePlan(goal, suggestedCalories) : null;

  return {
    shouldAdjust: actuallyChanged,
    suggestedCalories,
    suggestedExercise,
    reasoning,
    rule,
  };
}
