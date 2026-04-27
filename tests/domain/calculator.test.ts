import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  calculateTargets,
  calculateExercisePlan,
  shouldUpdateExercise,
} from "@/lib/domain/calculator";

describe("calculateBMR", () => {
  it("calculates male BMR correctly", () => {
    expect(calculateBMR("male", 75, 175, 25)).toBeCloseTo(1723.75);
  });

  it("calculates female BMR correctly", () => {
    expect(calculateBMR("female", 60, 165, 25)).toBeCloseTo(1345.25);
  });
});

describe("calculateTDEE", () => {
  it("applies sedentary multiplier", () => {
    expect(calculateTDEE(1700, "sedentary")).toBeCloseTo(2040);
  });

  it("applies moderate multiplier", () => {
    expect(calculateTDEE(1700, "moderate")).toBeCloseTo(2635);
  });
});

describe("calculateExercisePlan", () => {
  // Weight gain: frequency scales with calories
  it("gain: 3x strength at low surplus", () => {
    const plan = calculateExercisePlan("gain", 2400);
    expect(plan.strengthDays).toBe(3);
    expect(plan.cardioDays).toBe(0);
  });

  it("gain: 4x strength at moderate surplus", () => {
    const plan = calculateExercisePlan("gain", 2800);
    expect(plan.strengthDays).toBe(4);
    expect(plan.cardioDays).toBe(0);
  });

  it("gain: 5x strength at high surplus", () => {
    const plan = calculateExercisePlan("gain", 3500);
    expect(plan.strengthDays).toBe(5);
    expect(plan.cardioDays).toBe(0);
  });

  it("gain: zero cardio at all calorie levels", () => {
    expect(calculateExercisePlan("gain", 2400).cardioDays).toBe(0);
    expect(calculateExercisePlan("gain", 3000).cardioDays).toBe(0);
    expect(calculateExercisePlan("gain", 3500).cardioDays).toBe(0);
  });

  // Weight loss: strength + cardio
  it("lose: 3x strength in steep deficit", () => {
    const plan = calculateExercisePlan("lose", 1600);
    expect(plan.strengthDays).toBe(3);
    expect(plan.stepsTarget).toBe(10000);
  });

  it("lose: 4x strength in mild deficit", () => {
    const plan = calculateExercisePlan("lose", 2300);
    expect(plan.strengthDays).toBe(4);
    expect(plan.cardioDays).toBe(2);
  });

  // Maintenance
  it("maintain: 3x strength baseline", () => {
    const plan = calculateExercisePlan("maintain", 2500);
    expect(plan.strengthDays).toBe(3);
    expect(plan.cardioDays).toBe(1);
  });

  // Every plan has reasoning
  it("every plan includes reasoning", () => {
    expect(calculateExercisePlan("gain", 2800).reasoning.length).toBeGreaterThan(20);
    expect(calculateExercisePlan("lose", 1800).reasoning.length).toBeGreaterThan(20);
    expect(calculateExercisePlan("maintain", 2500).reasoning.length).toBeGreaterThan(20);
  });
});

describe("shouldUpdateExercise", () => {
  it("detects when frequency should increase", () => {
    const currentPlan = calculateExercisePlan("gain", 2800); // 4x
    const { shouldUpdate, newPlan } = shouldUpdateExercise(currentPlan, 3500, "gain");
    expect(shouldUpdate).toBe(true);
    expect(newPlan.strengthDays).toBe(5);
  });

  it("no update when calories stay in same band", () => {
    const currentPlan = calculateExercisePlan("gain", 2800); // 4x
    const { shouldUpdate } = shouldUpdateExercise(currentPlan, 2900, "gain");
    expect(shouldUpdate).toBe(false);
  });
});

describe("calculateTargets", () => {
  it("returns correct targets for weight gain", () => {
    const result = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 75,
      heightCm: 175,
      goal: "gain",
    });
    expect(result.calorieTarget).toBeGreaterThan(2000);
    expect(result.proteinG).toBe(Math.min(Math.round(75 * 1.8), 250));
    // Exercise derived from calories, not static
    expect(result.exercise.strengthDays).toBeGreaterThanOrEqual(3);
    expect(result.exercise.cardioDays).toBe(0);
  });

  it("returns correct targets for weight loss", () => {
    const result = calculateTargets({
      age: 30,
      sex: "female",
      weightKg: 70,
      heightCm: 165,
      goal: "lose",
    });
    expect(result.calorieTarget).toBeGreaterThanOrEqual(1200);
    expect(result.proteinG).toBe(Math.min(Math.round(70 * 2.2), 250));
    expect(result.exercise.stepsTarget).toBe(10000);
  });

  it("enforces calorie floor for females", () => {
    const result = calculateTargets({
      age: 50,
      sex: "female",
      weightKg: 45,
      heightCm: 150,
      goal: "lose",
      rate: "aggressive",
    });
    expect(result.calorieTarget).toBeGreaterThanOrEqual(1200);
  });

  it("enforces calorie floor for males", () => {
    const result = calculateTargets({
      age: 50,
      sex: "male",
      weightKg: 50,
      heightCm: 160,
      goal: "lose",
      rate: "aggressive",
    });
    expect(result.calorieTarget).toBeGreaterThanOrEqual(1500);
  });

  it("adjusts protein for obese individuals", () => {
    const result = calculateTargets({
      age: 30,
      sex: "male",
      weightKg: 120,
      heightCm: 175,
      goal: "gain",
    });
    expect(result.proteinG).toBeLessThan(216);
  });

  it("caps protein at 250g", () => {
    const result = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 150,
      heightCm: 190,
      goal: "lose",
    });
    expect(result.proteinG).toBeLessThanOrEqual(250);
  });

  it("calculates water target", () => {
    const result = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 75,
      heightCm: 175,
      goal: "maintain",
    });
    expect(result.waterLiters).toBeCloseTo(2.5, 0);
  });

  it("uses aggressive rate when specified", () => {
    const moderate = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 75,
      heightCm: 175,
      goal: "gain",
      rate: "moderate",
    });
    const aggressive = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 75,
      heightCm: 175,
      goal: "gain",
      rate: "aggressive",
    });
    expect(aggressive.calorieTarget).toBeGreaterThan(moderate.calorieTarget);
  });

  it("exercise frequency increases with higher calorie target", () => {
    const low = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 60,
      heightCm: 170,
      goal: "gain",
      rate: "moderate",
    });
    const high = calculateTargets({
      age: 25,
      sex: "male",
      weightKg: 95,
      heightCm: 185,
      goal: "gain",
      rate: "aggressive",
    });
    expect(high.exercise.strengthDays).toBeGreaterThanOrEqual(low.exercise.strengthDays);
  });
});
