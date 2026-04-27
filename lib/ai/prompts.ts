// ── All AI prompts in one file. Edit here, nothing else changes. ──

export const PROMPTS = {
  formatActivity: (
    input: string
  ) => `Convert this habit/activity description into a structured format for a daily tracker.

Input: "${input}"

Return ONLY valid JSON:
{
  "label": "Short activity name with target",
  "measurement": "numeric" or "binary",
  "target": number or null,
  "unit": "min" or "kcal" or "g" or "steps" or "sec" or "words" or null
}

Rules:
- If the input mentions a number and unit, use "numeric"
- If it's a yes/no activity, use "binary" with target and unit as null
- Keep the label concise (e.g. "Morning meditation · 10 min")
- Use · separator when combining activity and target`,

  suggestTighten: (
    name: string,
    currentValue: string,
    unit: string,
    kind: string
  ) => `A user is leveling up in their 90-day habit tracker. They chose to strengthen "${name}" (currently ${currentValue} ${unit}, type: ${kind}).

Suggest exactly 3 ways to tighten this target. Small, incremental increases.

Return ONLY a JSON array:
[{ "label": "Name", "adjustment": "+50 kcal", "newValue": "3,000 kcal", "reasoning": "One sentence." }]

Rules:
- Increments: 5-15% of current value
- Three magnitudes: easy / moderate / stretch
- Voice: brief, factual, contract-like. Not a coach.`,

  suggestUnlock: (
    input: string,
    existingOptionals: string[]
  ) => `A user wants to add a new Optional habit to their 90-day tracker.

They wrote: "${input}"
Existing optionals: ${existingOptionals.length > 0 ? existingOptionals.join(", ") : "none yet"}

Return ONLY valid JSON:
{
  "label": "Short name · target",
  "measurement": "numeric" or "binary",
  "target": number or null,
  "unit": "min" or "kcal" or "g" or "steps" or "sec" or "words" or null,
  "suggestion": "One sentence explaining how this fits their system"
}

Rules:
- Don't duplicate existing optionals
- Keep it specific and measurable
- Label uses · separator (e.g. "Cold shower · 60 sec")`,

  calculateFromQuestionnaire: (data: {
    age: number;
    sex: string;
    weightKg: number;
    heightCm: number;
    goal: string;
    activityLevel: string;
    trainingExperience: string;
    context: string;
  }) => `Based on this user's profile, calculate their optimal daily targets for a 90-day fitness contract.

Profile:
- Age: ${data.age}
- Sex: ${data.sex}
- Weight: ${data.weightKg} kg
- Height: ${data.heightCm} cm
- Goal: ${data.goal}
- Activity level: ${data.activityLevel}
- Training experience: ${data.trainingExperience}
${data.context ? `- Additional context: "${data.context}"` : ""}

Calculate using Mifflin-St Jeor for BMR, apply the activity multiplier, then adjust for their goal.

Return ONLY valid JSON:
{
  "calorieTarget": number (rounded to nearest 25),
  "proteinG": number (rounded to nearest 5),
  "bodyMinutes": number (session length in minutes),
  "bodyDaysPerWeek": number,
  "waterLiters": number (1 decimal),
  "stepsTarget": number,
  "reasoning": "3-4 sentences explaining each number. Cite the formula. Be specific about why these numbers for THIS person.",
  "warnings": ["any safety notes or caveats, empty array if none"]
}`,

  refineTargets: (
    calculated: { calories: number; protein: number; exercise: string },
    context: string
  ) => `A user is setting up their 90-day fitness contract. The calculator produced these baseline targets:
- Calories: ${calculated.calories} kcal/day
- Protein: ${calculated.protein}g/day
- Exercise: ${calculated.exercise}

The user added this context: "${context}"

Based on their context, suggest adjusted targets if the baseline doesn't fit. If the baseline is fine, confirm it.

Return ONLY valid JSON:
{
  "calorieTarget": number,
  "proteinG": number,
  "bodyMinutes": number,
  "bodyDaysPerWeek": number,
  "reasoning": "2-3 sentences explaining the recommendation in contract voice. Brief, factual."
}

Rules:
- Stay within safe ranges (calories: 1200-4500, protein: 80-250g)
- Don't make dramatic changes from the baseline unless the context demands it
- Voice: contract-like, not a coach. State facts.`,
} as const;
