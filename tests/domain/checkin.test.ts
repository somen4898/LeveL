import { describe, it, expect } from "vitest";
import {
  computeWeightTrend,
  computeAdjustmentDecision,
  WeightDataPoint,
  AdjustmentInput,
} from "@/lib/domain/checkin";

// ── computeWeightTrend ─────────────────────────────────────────────────────

describe("computeWeightTrend", () => {
  it("detects gaining direction", () => {
    const points: WeightDataPoint[] = [
      { weight_kg: 75.0, day_index: 0 },
      { weight_kg: 75.5, day_index: 7 },
    ];
    const trend = computeWeightTrend(points);
    expect(trend.direction).toBe("gaining");
    expect(trend.changeKg).toBeCloseTo(0.5);
    expect(trend.changePercent).toBeCloseTo((0.5 / 75.0) * 100);
    expect(trend.currentWeight).toBe(75.5);
    expect(trend.previousWeight).toBe(75.0);
  });

  it("detects losing direction", () => {
    const points: WeightDataPoint[] = [
      { weight_kg: 80.0, day_index: 0 },
      { weight_kg: 79.2, day_index: 7 },
    ];
    const trend = computeWeightTrend(points);
    expect(trend.direction).toBe("losing");
    expect(trend.changeKg).toBeCloseTo(-0.8);
    expect(trend.changePercent).toBeCloseTo((-0.8 / 80.0) * 100);
  });

  it("detects stable when change is within ±0.1 kg", () => {
    const points: WeightDataPoint[] = [
      { weight_kg: 70.0, day_index: 0 },
      { weight_kg: 70.05, day_index: 7 },
    ];
    const trend = computeWeightTrend(points);
    expect(trend.direction).toBe("stable");
  });

  it("detects stable when change is exactly 0.1 kg", () => {
    const points: WeightDataPoint[] = [
      { weight_kg: 70.0, day_index: 0 },
      { weight_kg: 70.1, day_index: 7 },
    ];
    const trend = computeWeightTrend(points);
    expect(trend.direction).toBe("stable");
  });

  it("handles a single data point (no change)", () => {
    const points: WeightDataPoint[] = [{ weight_kg: 72.0, day_index: 0 }];
    const trend = computeWeightTrend(points);
    expect(trend.direction).toBe("stable");
    expect(trend.changeKg).toBe(0);
    expect(trend.changePercent).toBe(0);
    expect(trend.weeksOfData).toBe(1);
  });

  it("uses the last two data points when more than two are provided", () => {
    const points: WeightDataPoint[] = [
      { weight_kg: 75.0, day_index: 0 },
      { weight_kg: 75.3, day_index: 7 },
      { weight_kg: 75.6, day_index: 14 },
    ];
    const trend = computeWeightTrend(points);
    // Should use day_index 7 and 14 — not day 0
    expect(trend.previousWeight).toBe(75.3);
    expect(trend.currentWeight).toBe(75.6);
    expect(trend.changeKg).toBeCloseTo(0.3);
  });

  it("computes weeksOfData from the full day_index span", () => {
    const points: WeightDataPoint[] = [
      { weight_kg: 75.0, day_index: 0 },
      { weight_kg: 75.5, day_index: 7 },
      { weight_kg: 76.0, day_index: 14 },
    ];
    const trend = computeWeightTrend(points);
    expect(trend.weeksOfData).toBe(2);
  });
});

// ── computeAdjustmentDecision — baseline ──────────────────────────────────

describe("computeAdjustmentDecision — baseline (< 2 weeks)", () => {
  it("returns no adjustment with rule=baseline when weeksOfData < 2", () => {
    const input: AdjustmentInput = {
      goal: "gain",
      currentCalories: 2800,
      currentWeight: 75,
      changePercent: 0.1,
      direction: "gaining",
      weeksOfData: 1,
      tdee: 2500,
      sex: "male",
    };
    const decision = computeAdjustmentDecision(input);
    expect(decision.shouldAdjust).toBe(false);
    expect(decision.rule).toBe("baseline");
    expect(decision.suggestedCalories).toBe(2800);
    expect(decision.suggestedExercise).toBeNull();
  });
});

// ── computeAdjustmentDecision — gain goal ─────────────────────────────────

describe("computeAdjustmentDecision — gain goal", () => {
  const base: AdjustmentInput = {
    goal: "gain",
    currentCalories: 2800,
    currentWeight: 75,
    changePercent: 0,
    direction: "gaining",
    weeksOfData: 3,
    tdee: 2500,
    sex: "male",
  };

  it("on track (0.25–0.5%/week) — no change", () => {
    const input = { ...base, changePercent: 0.35, direction: "gaining" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(false);
    expect(d.rule).toBe("gain_on_track");
    expect(d.suggestedCalories).toBe(2800);
  });

  it("too slow (<0.25%/week) — suggests increase", () => {
    const input = { ...base, changePercent: 0.1, direction: "gaining" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(true);
    expect(d.rule).toBe("gain_too_slow");
    expect(d.suggestedCalories).toBeGreaterThan(2800);
  });

  it("too fast (>0.5%/week) — holds or reduces (CORE RULE: never increase when above target)", () => {
    const input = { ...base, changePercent: 0.7, direction: "gaining" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(true);
    expect(d.rule).toBe("gain_too_fast");
    expect(d.suggestedCalories).toBeLessThan(2800);
  });

  it("stalled (stable for 2+ weeks) — suggests increase", () => {
    const input = { ...base, changePercent: 0, direction: "stable" as const, weeksOfData: 3 };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(true);
    expect(d.rule).toBe("gain_stalled");
    expect(d.suggestedCalories).toBeGreaterThan(2800);
  });

  it("never exceeds ceiling (TDEE + 800)", () => {
    // currentCalories is already at ceiling
    const input: AdjustmentInput = {
      ...base,
      currentCalories: 3300, // tdee(2500) + 800
      changePercent: 0.1,
      direction: "gaining" as const,
    };
    const d = computeAdjustmentDecision(input);
    expect(d.suggestedCalories).toBeLessThanOrEqual(3300);
  });

  it("caps adjustment at +200 kcal per check-in", () => {
    const input: AdjustmentInput = {
      ...base,
      currentCalories: 2800,
      changePercent: 0,
      direction: "stable" as const, // stalled → would try +175
    };
    const d = computeAdjustmentDecision(input);
    expect(d.suggestedCalories).toBeLessThanOrEqual(2800 + 200);
  });
});

// ── computeAdjustmentDecision — lose goal ─────────────────────────────────

describe("computeAdjustmentDecision — lose goal", () => {
  const base: AdjustmentInput = {
    goal: "lose",
    currentCalories: 1900,
    currentWeight: 80,
    changePercent: 0,
    direction: "losing",
    weeksOfData: 3,
    tdee: 2400,
    sex: "male",
  };

  it("on track (0.5–1.0%/week loss) — no change", () => {
    const input = { ...base, changePercent: -0.7, direction: "losing" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(false);
    expect(d.rule).toBe("lose_on_track");
  });

  it("too fast (>1.0%/week loss) — increases calories", () => {
    const input = { ...base, changePercent: -1.3, direction: "losing" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(true);
    expect(d.rule).toBe("lose_too_fast");
    expect(d.suggestedCalories).toBeGreaterThan(1900);
  });

  it("too slow (<0.5%/week loss) — decreases calories", () => {
    const input = { ...base, changePercent: -0.2, direction: "losing" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(true);
    expect(d.rule).toBe("lose_too_slow");
    expect(d.suggestedCalories).toBeLessThan(1900);
  });

  it("stalled — decreases calories", () => {
    const input = { ...base, changePercent: 0, direction: "stable" as const };
    const d = computeAdjustmentDecision(input);
    expect(d.shouldAdjust).toBe(true);
    expect(d.rule).toBe("lose_stalled");
    expect(d.suggestedCalories).toBeLessThan(1900);
  });

  it("never goes below floor of 1500 for male", () => {
    const input: AdjustmentInput = {
      ...base,
      currentCalories: 1550,
      changePercent: 0,
      direction: "stable" as const,
      sex: "male",
    };
    const d = computeAdjustmentDecision(input);
    expect(d.suggestedCalories).toBeGreaterThanOrEqual(1500);
  });

  it("floor is 1200 for female", () => {
    const input: AdjustmentInput = {
      ...base,
      currentCalories: 1250,
      changePercent: 0,
      direction: "stable" as const,
      sex: "female",
    };
    const d = computeAdjustmentDecision(input);
    expect(d.suggestedCalories).toBeGreaterThanOrEqual(1200);
  });

  it("caps adjustment at -200 kcal per check-in", () => {
    const input: AdjustmentInput = {
      ...base,
      currentCalories: 1900,
      changePercent: 0,
      direction: "stable" as const, // stalled → -150
    };
    const d = computeAdjustmentDecision(input);
    expect(d.suggestedCalories).toBeGreaterThanOrEqual(1900 - 200);
  });
});
