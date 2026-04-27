// Smart target calculator — pure functions, no I/O.
// Based on Mifflin-St Jeor (BMR), standard activity multipliers,
// and evidence-based protein recommendations.

export type Sex = "male" | "female";
export type Goal = "gain" | "lose" | "maintain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active" | "extra_active";
export type Rate = "moderate" | "aggressive";

export interface BiometricInput {
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  goal: Goal;
  activityLevel?: ActivityLevel;
  rate?: Rate;
}

export interface CalculatedTargets {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  proteinG: number;
  waterLiters: number;
  exercise: {
    strengthDays: number;
    cardioDays: number;
    minutesPerWeek: number;
    minutesPerSession: number;
    stepsTarget: number;
  };
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const CALORIE_ADJUSTMENTS: Record<`${Goal}_${Rate}`, number> = {
  lose_moderate: -300,
  lose_aggressive: -500,
  gain_moderate: 250,
  gain_aggressive: 500,
  maintain_moderate: 0,
  maintain_aggressive: 0,
};

const PROTEIN_MULTIPLIERS: Record<Goal, number> = {
  gain: 1.8,
  lose: 2.2,
  maintain: 1.4,
};

const EXERCISE_DEFAULTS: Record<Goal, CalculatedTargets["exercise"]> = {
  gain: {
    strengthDays: 4,
    cardioDays: 1,
    minutesPerWeek: 180,
    minutesPerSession: 45,
    stepsTarget: 7500,
  },
  lose: {
    strengthDays: 3,
    cardioDays: 2,
    minutesPerWeek: 225,
    minutesPerSession: 45,
    stepsTarget: 10000,
  },
  maintain: {
    strengthDays: 2,
    cardioDays: 1,
    minutesPerWeek: 135,
    minutesPerSession: 45,
    stepsTarget: 8000,
  },
};

export function calculateBMR(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  if (sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

function idealBodyweight(sex: Sex, heightCm: number): number {
  if (sex === "male") return 50 + 0.91 * (heightCm - 152.4);
  return 45.5 + 0.91 * (heightCm - 152.4);
}

function effectiveWeight(sex: Sex, weightKg: number, heightCm: number): number {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  if (bmi > 30) {
    const ideal = idealBodyweight(sex, heightCm);
    return ideal + 0.4 * (weightKg - ideal);
  }
  return weightKg;
}

export function calculateTargets(input: BiometricInput): CalculatedTargets {
  const activityLevel = input.activityLevel ?? "light";
  const rate = input.rate ?? "moderate";

  // BMR
  const bmr = calculateBMR(input.sex, input.weightKg, input.heightCm, input.age);

  // TDEE
  const tdee = calculateTDEE(bmr, activityLevel);

  // Calorie target
  const adjustment = CALORIE_ADJUSTMENTS[`${input.goal}_${rate}`];
  const floor = input.sex === "male" ? 1500 : 1200;
  const calorieTarget = Math.max(Math.round(tdee + adjustment), floor);

  // Protein
  const effWeight = effectiveWeight(input.sex, input.weightKg, input.heightCm);
  const proteinG = Math.min(Math.round(effWeight * PROTEIN_MULTIPLIERS[input.goal]), 250);

  // Water
  const waterLiters = Math.round(input.weightKg * 0.033 * 10) / 10;

  // Exercise
  const exercise = { ...EXERCISE_DEFAULTS[input.goal] };

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinG,
    waterLiters,
    exercise,
  };
}
