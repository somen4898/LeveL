// ── All AI prompts in one file. Edit here, nothing else changes. ──

export const PROMPTS = {
  formatActivity: (
    input: string
  ) => `Convert this habit/activity description into a structured format for a daily tracker.

Input: "${input}"

Respond with ONLY a single JSON object, no other text:
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

Respond with ONLY a single JSON array, no other text:
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

Respond with ONLY a single JSON object, no other text:
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
  }) => `You are calculating personalized daily targets for a 90-day fitness contract.

<profile>
Age: ${data.age}
Sex: ${data.sex}
Weight: ${data.weightKg} kg
Height: ${data.heightCm} cm
Goal: ${data.goal}
Activity level: ${data.activityLevel}
Training experience: ${data.trainingExperience}
${data.context ? `Additional context: "${data.context}"` : "No additional context provided."}
</profile>

<instructions>
1. Calculate BMR using Mifflin-St Jeor equation
2. Apply the activity multiplier to get TDEE
3. Adjust calories based on goal (surplus for gain, deficit for lose, maintain for maintain)
4. Calculate protein using the evidence-based multiplier for the goal
5. Determine exercise plan based on goal, calorie level, and training experience
6. If additional context conflicts with the goal field, flag it in warnings but honor the goal field
</instructions>

<output_format>
Respond with ONLY a single JSON object. No markdown, no explanation outside the JSON:
{
  "calorieTarget": <number, rounded to nearest 25>,
  "proteinG": <number, rounded to nearest 5>,
  "bodyMinutes": <number, session length in minutes>,
  "bodyDaysPerWeek": <number>,
  "waterLiters": <number, 1 decimal place>,
  "stepsTarget": <number>,
  "reasoning": "<3-4 sentences. Show your BMR calculation. Cite the formula and sources. Explain why these specific numbers for THIS person's profile.>",
  "warnings": ["<any safety notes, contradictions, or caveats. Empty array if none.>"]
}
</output_format>`,

  refineTargets: (
    calculated: { calories: number; protein: number; exercise: string },
    context: string
  ) => `A user is setting up their 90-day fitness contract. The calculator produced these baseline targets:
- Calories: ${calculated.calories} kcal/day
- Protein: ${calculated.protein}g/day
- Exercise: ${calculated.exercise}

The user added this context: "${context}"

Based on their context, suggest adjusted targets if the baseline doesn't fit. If the baseline is fine, confirm it.

Respond with ONLY a single JSON object, no other text:
{
  "calorieTarget": <number>,
  "proteinG": <number>,
  "bodyMinutes": <number>,
  "bodyDaysPerWeek": <number>,
  "reasoning": "<2-3 sentences explaining the recommendation. Contract voice: brief, factual.>"
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
  }) => `Analyze this weekly check-in for a user on a ${data.goal} protocol.

<current_state>
Targets: ${data.currentCalories} kcal, ${data.currentProtein}g protein
Weight change: ${data.weightTrend.changeKg > 0 ? "+" : ""}${data.weightTrend.changeKg.toFixed(1)} kg (${data.weightTrend.changePercent.toFixed(1)}% BW, direction: ${data.weightTrend.direction})
Week: ${data.weekNumber}, data points: ${data.weightTrend.weeksOfData}
</current_state>

<domain_decision>
The system's rule-based logic suggests: ${data.domainDecision.reasoning}
Suggested calories: ${data.domainDecision.suggestedCalories} kcal (rule: ${data.domainDecision.rule})
</domain_decision>

<instructions>
Add evidence-based context to the domain suggestion. Explain WHY this adjustment makes sense given the user's trend. Cite sources from the evidence base.
</instructions>

Respond with ONLY a single JSON object, no other text:
{
  "suggestedCalories": <number, must be within 50 kcal of domain suggestion>,
  "suggestedProtein": <number>,
  "reasoning": "<2-3 sentences with citations explaining the adjustment>",
  "encouragement": "<One sentence. Contract voice: factual, brief. No cheerleading.>"
}`,

  suggestOptionalFromInput: (
    input: string,
    goal: string,
    existingOptionals: string[]
  ) => `A user wants to add "${input}" as an Optional habit to their 90-day tracker.

<context>
Goal: ${goal}
Existing optionals: ${existingOptionals.length > 0 ? existingOptionals.join(", ") : "none yet"}
</context>

Research the optimal target for this activity given their goal. Use the evidence base provided in the system prompt.

Respond with ONLY a single JSON object, no other text:
{
  "label": "<Activity name with target>",
  "measurement": "numeric" or "binary",
  "target": <number or null>,
  "unit": "hr" or "min" or "sec" or "steps" or "words" or null,
  "reasoning": "<2-3 sentences explaining why this target for this person's goal. Cite source.>"
}

Rules:
- Start low for new habits (compliance > ambition)
- Don't duplicate existing optionals
- Use the · separator in label (e.g. "Sleep · 7.5 hr")
- If not in the evidence base, use general principles: measurable, specific, conservative`,
} as const;
