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
