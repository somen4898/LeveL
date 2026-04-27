// Smart target calculator — pure functions, no I/O.
// Based on Mifflin-St Jeor (BMR), standard activity multipliers,
// and evidence-based protein recommendations.
// Exercise frequency is computed from calorie target, not chosen independently.

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
  exercise: ExercisePlan;
}

export interface ExercisePlan {
  strengthDays: number;
  cardioDays: number;
  minutesPerSession: number;
  stepsTarget: number;
  reasoning: string;
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

// ── Exercise frequency derived from calorie target and goal ──
// For weight gain: more calories = body can recover from more sessions.
// For weight loss: strength is non-negotiable, cardio supplements the deficit.

export function calculateExercisePlan(goal: Goal, calorieTarget: number): ExercisePlan {
  if (goal === "gain") {
    // Weight gain: frequency scales with surplus.
    // Lower surplus = fewer sessions (body can't recover without fuel).
    // Zero dedicated cardio — surplus should build muscle, not get burned.
    if (calorieTarget < 2600) {
      return {
        strengthDays: 3,
        cardioDays: 0,
        minutesPerSession: 45,
        stepsTarget: 6000,
        reasoning:
          "3x/week strength at this calorie level. Your surplus is modest — recovery is limited. No dedicated cardio; walking is sufficient. Focus on compound lifts.",
      };
    }
    if (calorieTarget < 3000) {
      return {
        strengthDays: 4,
        cardioDays: 0,
        minutesPerSession: 45,
        stepsTarget: 7000,
        reasoning:
          "4x/week strength. Enough fuel to recover from a 4-day split. Still no dedicated cardio — preserve the surplus. Add a session when calories rise above 3,000.",
      };
    }
    if (calorieTarget < 3400) {
      return {
        strengthDays: 4,
        cardioDays: 0,
        minutesPerSession: 50,
        stepsTarget: 7500,
        reasoning:
          "4x/week strength with slightly longer sessions. You have the fuel. One light walk day if recovery feels good, but don't force cardio — it burns surplus.",
      };
    }
    // 3400+
    return {
      strengthDays: 5,
      cardioDays: 0,
      minutesPerSession: 50,
      stepsTarget: 7500,
      reasoning:
        "5x/week strength. At 3,400+ kcal you have enough fuel for high-frequency training. Upper/lower or push/pull/legs split. Still no dedicated cardio.",
    };
  }

  if (goal === "lose") {
    // Weight loss: strength is non-negotiable (preserves muscle in deficit).
    // Steps/NEAT is the primary fat-loss lever, not intense cardio.
    if (calorieTarget < 1800) {
      return {
        strengthDays: 3,
        cardioDays: 1,
        minutesPerSession: 40,
        stepsTarget: 10000,
        reasoning:
          "3x/week strength in a steep deficit. Maintain intensity, reduce volume. 1x light cardio. Steps are your primary burn — 10k target. Don't overtrain in a deficit.",
      };
    }
    if (calorieTarget < 2200) {
      return {
        strengthDays: 3,
        cardioDays: 2,
        minutesPerSession: 45,
        stepsTarget: 10000,
        reasoning:
          "3x/week strength + 2x cardio. Moderate deficit allows more activity. Keep strength intensity high to signal muscle preservation. Steps remain the primary lever.",
      };
    }
    // 2200+
    return {
      strengthDays: 4,
      cardioDays: 2,
      minutesPerSession: 45,
      stepsTarget: 10000,
      reasoning:
        "4x/week strength + 2x cardio. Mild deficit with solid recovery capacity. Full-body or upper/lower split. Cardio should be low-intensity steady state, not HIIT.",
    };
  }

  // Maintenance
  return {
    strengthDays: 3,
    cardioDays: 1,
    minutesPerSession: 40,
    stepsTarget: 8000,
    reasoning:
      "3x/week strength is the minimum effective dose to maintain. 1x cardio for cardiovascular health. 8k steps for longevity baseline.",
  };
}

// ── Recalculate exercise when calorie target changes (e.g. at level-up) ──

export function shouldUpdateExercise(
  currentPlan: ExercisePlan,
  newCalorieTarget: number,
  goal: Goal
): { shouldUpdate: boolean; newPlan: ExercisePlan } {
  const newPlan = calculateExercisePlan(goal, newCalorieTarget);
  const shouldUpdate = newPlan.strengthDays !== currentPlan.strengthDays;
  return { shouldUpdate, newPlan };
}

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

  const bmr = calculateBMR(input.sex, input.weightKg, input.heightCm, input.age);
  const tdee = calculateTDEE(bmr, activityLevel);

  const adjustment = CALORIE_ADJUSTMENTS[`${input.goal}_${rate}`];
  const floor = input.sex === "male" ? 1500 : 1200;
  const calorieTarget = Math.max(Math.round(tdee + adjustment), floor);

  const effWeight = effectiveWeight(input.sex, input.weightKg, input.heightCm);
  const proteinG = Math.min(Math.round(effWeight * PROTEIN_MULTIPLIERS[input.goal]), 250);

  const waterLiters = Math.round(input.weightKg * 0.033 * 10) / 10;

  // Exercise computed from calorie target, not static defaults
  const exercise = calculateExercisePlan(input.goal, calorieTarget);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    proteinG,
    waterLiters,
    exercise,
  };
}
