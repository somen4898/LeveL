/**
 * Dev-mode defaults for the onboarding flow.
 * When NEXT_PUBLIC_APP_MODE=dev, the onboarding form auto-fills with these values
 * so you can skip straight to signing.
 */
export const DEV_ONBOARDING = {
  anchorText:
    "I want to build discipline across body, nutrition, and craft. This 90-day contract is my commitment to showing up every single day, no exceptions. I know the compound effect of consistency will transform my habits.",
  age: 25,
  sex: "male" as const,
  weightKg: 75,
  heightCm: 175,
  goal: "gain" as const,
  activityLevel: "moderate" as const,
  trainingExperience: "intermediate" as const,
  additionalContext: "",
  calorieTarget: 2800,
  proteinTarget: 150,
  bodyMinutes: 45,
  craftSubtasks: [
    { label: "One LeetCode problem (any difficulty)", measurement: "binary" as const },
    { label: "One focused 60-min project session", measurement: "binary" as const },
  ],
  fuelSubtasks: [
    { label: "Calories", measurement: "numeric" as const, target: 2800, unit: "kcal" },
    { label: "Protein", measurement: "numeric" as const, target: 150, unit: "g" },
  ],
  bodyDays: [1, 2, 4, 6],
  craftDays: [1, 2, 3, 4, 5],
  rewards: [
    { scheduledDay: 15, tier: "small" as const, name: "New running shoes" },
    { scheduledDay: 30, tier: "big" as const, name: "Weekend trip" },
    { scheduledDay: 45, tier: "small" as const, name: "New book collection" },
    { scheduledDay: 60, tier: "big" as const, name: "Noise-cancelling headphones" },
    { scheduledDay: 75, tier: "small" as const, name: "Favourite restaurant dinner" },
    { scheduledDay: 90, tier: "big" as const, name: "New mechanical keyboard" },
  ],
};

export function isDevMode() {
  return process.env.NEXT_PUBLIC_APP_MODE === "dev";
}
