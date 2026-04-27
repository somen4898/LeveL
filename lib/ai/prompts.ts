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

  weeklyCheckinAnalysis: (data: {
    goal: string;
    currentCalories: number;
    currentProtein: number;
    weightTrend: {
      changeKg: number;
      changePercent: number;
      direction: string;
      weeksOfData: number;
    };
    weekNumber: number;
    domainDecision: {
      shouldAdjust: boolean;
      suggestedCalories: number;
      reasoning: string;
      rule: string;
    };
  }) => `Weekly check-in analysis for a ${data.goal} goal.

Current targets: ${data.currentCalories} kcal, ${data.currentProtein}g protein
Weight trend: ${data.weightTrend.changeKg > 0 ? "+" : ""}${data.weightTrend.changeKg.toFixed(1)} kg this week (${data.weightTrend.changePercent.toFixed(1)}% BW, direction: ${data.weightTrend.direction})
Week: ${data.weekNumber}, data points: ${data.weightTrend.weeksOfData}

The domain logic suggests: ${data.domainDecision.reasoning}
Suggested calories: ${data.domainDecision.suggestedCalories} kcal (rule: ${data.domainDecision.rule})

Add context and phrasing to this suggestion. Explain WHY in 2-3 sentences using the evidence base. Cite sources.

Return ONLY valid JSON:
{
  "suggestedCalories": number,
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
    existingOptionals: string[]
  ) => `A user wants to add "${input}" as an Optional habit to their 90-day tracker.
Their goal is: ${goal}
Existing optionals: ${existingOptionals.length > 0 ? existingOptionals.join(", ") : "none yet"}

Research what the optimal target should be for this activity given their goal. Use the evidence base provided in the system prompt.

Return ONLY valid JSON:
{
  "label": "Activity name with target",
  "measurement": "numeric" or "binary",
  "target": number or null,
  "unit": "hr" or "min" or "sec" or "steps" or "words" or null,
  "reasoning": "2-3 sentences explaining why this target for this person's goal. Cite source."
}

Rules:
- Start low for new habits (compliance > ambition)
- Don't duplicate existing optionals
- Use the · separator in label (e.g. "Sleep · 7.5 hr")
- If not in the evidence base, use general principles: measurable, specific, conservative`,
} as const;
