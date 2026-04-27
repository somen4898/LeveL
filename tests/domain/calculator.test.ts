import { describe, it, expect } from "vitest";
import { calculateBMR, calculateTDEE, calculateTargets } from "@/lib/domain/calculator";

describe("calculateBMR", () => {
  it("calculates male BMR correctly", () => {
    // 25yo male, 75kg, 175cm
    // 10*75 + 6.25*175 - 5*25 + 5 = 750 + 1093.75 - 125 + 5 = 1723.75
    expect(calculateBMR("male", 75, 175, 25)).toBeCloseTo(1723.75);
  });

  it("calculates female BMR correctly", () => {
    // 25yo female, 60kg, 165cm
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
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
    expect(result.exercise.strengthDays).toBe(4);
    expect(result.exercise.stepsTarget).toBe(7500);
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
    // BMI > 30 should use adjusted weight
    const result = calculateTargets({
      age: 30,
      sex: "male",
      weightKg: 120,
      heightCm: 175,
      goal: "gain",
    });
    // Protein should be less than 120 * 1.8 = 216 because adjusted weight is used
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
});
