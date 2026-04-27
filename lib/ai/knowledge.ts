// ── Structured, cited knowledge base for nutrition and fitness ──
// Every number has a source. Edit here to update AI context.
// No RAG needed — the domain is narrow and stable.

export interface CitedValue {
  range: [number, number];
  default: number;
  unit: string;
  source: string;
  doi?: string;
  note?: string;
}

export interface ExerciseGuideline {
  frequencyRange: [number, number];
  defaultFrequency: number;
  durationRange: [number, number];
  defaultDuration: number;
  source: string;
  note?: string;
}

export const GUIDELINES = {
  protein: {
    bulking: {
      range: [1.6, 2.2],
      default: 1.8,
      unit: "g/kg/day",
      source: "Jäger et al., JISSN, 2017",
      doi: "10.1186/s12970-017-0177-8",
      note: "Upper CI of benefit at 1.62 g/kg, practitioner consensus extends to 2.2",
    } satisfies CitedValue,
    cutting: {
      range: [2.0, 2.4],
      default: 2.2,
      unit: "g/kg/day",
      source: "Helms et al., JISSN, 2014",
      doi: "10.1186/1550-2783-11-20",
      note: "Higher protein preserves lean mass in caloric deficit. Use FFM-adjusted for obese.",
    } satisfies CitedValue,
    maintenance: {
      range: [1.2, 1.6],
      default: 1.4,
      unit: "g/kg/day",
      source: "Jäger et al., JISSN, 2017",
      doi: "10.1186/s12970-017-0177-8",
    } satisfies CitedValue,
  },

  calories: {
    surplus: {
      lean: {
        range: [200, 300],
        default: 250,
        unit: "kcal above TDEE",
        source: "Iraki et al., JISSN, 2019; Helms et al., 2014",
        note: "Minimizes fat gain. Recommended for intermediate+ lifters.",
      } satisfies CitedValue,
      standard: {
        range: [400, 600],
        default: 500,
        unit: "kcal above TDEE",
        source: "Iraki et al., JISSN, 2019",
        note: "Faster gain, more fat accumulation. Suitable for beginners.",
      } satisfies CitedValue,
    },
    deficit: {
      moderate: {
        range: [250, 350],
        default: 300,
        unit: "kcal below TDEE",
        source: "Helms et al., JISSN, 2014",
        note: "~0.25 kg/week loss. Sustainable, preserves lean mass.",
      } satisfies CitedValue,
      aggressive: {
        range: [450, 550],
        default: 500,
        unit: "kcal below TDEE",
        source: "Helms et al., JISSN, 2014",
        note: "~0.45 kg/week loss. Requires higher protein to preserve muscle.",
      } satisfies CitedValue,
    },
    safetyFloor: {
      male: 1500,
      female: 1200,
      source: "Academy of Nutrition and Dietetics",
      note: "Below these thresholds, micronutrient adequacy is difficult without medical supervision.",
    },
    equation: {
      name: "Mifflin-St Jeor",
      source: "Mifflin et al., AJCN, 1990",
      doi: "10.1093/ajcn/51.2.241",
      note: "Most validated BMR equation for both obese and non-obese adults.",
    },
  },

  weightRate: {
    gain: {
      range: [0.25, 0.5],
      default: 0.35,
      unit: "% bodyweight / week",
      source: "Iraki et al., JISSN, 2019",
      note: "Beginners can sustain higher end, advanced lifters at lower end.",
    } satisfies CitedValue,
    loss: {
      range: [0.5, 1.0],
      default: 0.7,
      unit: "% bodyweight / week",
      source: "Helms et al., JISSN, 2014",
      note: "Above 1% per week significantly increases lean mass loss.",
    } satisfies CitedValue,
  },

  exercise: {
    strengthGain: {
      frequencyRange: [3, 5],
      defaultFrequency: 4,
      durationRange: [45, 75],
      defaultDuration: 45,
      source: "Schoenfeld et al., 2016; ACSM Guidelines",
      note: "Progressive overload is the priority. Volume scales with experience.",
    } satisfies ExerciseGuideline,
    strengthCut: {
      frequencyRange: [3, 4],
      defaultFrequency: 3,
      durationRange: [30, 60],
      defaultDuration: 45,
      source: "Helms et al., 2014; ACSM Guidelines",
      note: "Maintain intensity, reduce volume by ~1/3 if recovery is impaired in deficit.",
    } satisfies ExerciseGuideline,
    strengthMaintain: {
      frequencyRange: [2, 3],
      defaultFrequency: 2,
      durationRange: [30, 45],
      defaultDuration: 30,
      source: "ACSM Position Stand, 2009",
      note: "Minimum effective dose. 2x/week sufficient to maintain strength.",
    } satisfies ExerciseGuideline,
    cardio: {
      moderateMinPerWeek: 150,
      vigorousMinPerWeek: 75,
      source: "ACSM/AHA Physical Activity Guidelines, 2018",
      doi: "10.1249/MSS.0b013e3181949333",
    },
    steps: {
      gain: {
        target: 7500,
        source: "General practitioner consensus",
        note: "Moderate to avoid excessive calorie burn undermining surplus",
      },
      lose: {
        target: 10000,
        source: "Tudor-Locke et al., 2011",
        note: "NEAT is the primary fat-loss activity lever",
      },
      maintain: {
        target: 8000,
        source: "Lee et al., JAMA, 2019",
        note: "8000+ steps/day associated with significant mortality reduction",
      },
    },
  },

  hydration: {
    perKg: {
      range: [30, 40],
      default: 33,
      unit: "mL/kg/day",
      source: "IOM Dietary Reference Intakes for Water, 2004",
      note: "Baseline. Add 500-1000 mL per hour of exercise.",
    } satisfies CitedValue,
  },

  optionalActivities: {
    sleep: {
      range: [7, 9],
      default: 7.5,
      unit: "hr",
      source: "AASM guidelines; Walker",
      note: "<7hr impairs MPS ~30%, critical for gain goal",
    } satisfies CitedValue,
    reading: {
      range: [10, 30],
      default: 15,
      unit: "min",
      source: "Lally et al., 2010",
      note: "Lower threshold = higher compliance for new habits",
    } satisfies CitedValue,
    meditation: {
      range: [5, 20],
      default: 10,
      unit: "min",
      source: "Goyal et al., JAMA, 2014",
      note: "10 min sufficient for cortisol reduction",
    } satisfies CitedValue,
    cold_shower: {
      range: [30, 120],
      default: 60,
      unit: "sec",
      source: "Soberg et al., Cell, 2022",
      note: "Benefits plateau at 11 min/week total",
    } satisfies CitedValue,
    walking: {
      range: [6000, 12000],
      default: 8000,
      unit: "steps",
      source: "Lee et al., JAMA, 2019",
      note: "Gain: 7k, Lose: 10k",
    } satisfies CitedValue,
    stretching: {
      range: [5, 15],
      default: 10,
      unit: "min",
      source: "ACSM guidelines",
      note: "Post-workout preferred",
    } satisfies CitedValue,
    journaling: {
      range: [100, 300],
      default: 200,
      unit: "words",
      source: "Pennebaker, 1997",
      note: "Binary option also valid",
    } satisfies CitedValue,
    gratitude: {
      range: [1, 3],
      default: 1,
      unit: "lines",
      source: "Emmons & McCullough, 2003",
      note: "Binary works better than word count",
    } satisfies CitedValue,
    no_phone_am: {
      range: [30, 60],
      default: 30,
      unit: "min",
      source: "Dopamine baseline research",
      note: "Binary measurement recommended",
    } satisfies CitedValue,
  },

  foods: {
    gain: {
      title: "Foods that support weight gain",
      source: "ISSN Position Stands; Helms et al., 2014; general sports nutrition consensus",
      categories: [
        {
          name: "High-quality protein",
          items: [
            "Eggs (whole, 6g protein each, complete amino acid profile)",
            "Chicken thighs (fattier cut, 26g protein per 100g, easier surplus)",
            "Salmon (20g protein + omega-3s for inflammation recovery)",
            "Greek yogurt (full fat, 10g protein per 100g, casein-rich for slow release)",
            "Whole milk (8g protein per 250ml, easy liquid calories)",
          ],
        },
        {
          name: "Calorie-dense carbs",
          items: [
            "White rice (easy to digest post-workout, 130 kcal per 100g cooked)",
            "Oats (380 kcal per 100g dry, slow-release energy)",
            "Sweet potatoes (complex carbs, potassium for recovery)",
            "Bananas (quick energy, 100 kcal each, potassium)",
            "Whole grain bread (easy vehicle for calories)",
          ],
        },
        {
          name: "Healthy fats (calorie-dense)",
          items: [
            "Peanut butter (588 kcal per 100g, 25g protein, easiest surplus food)",
            "Almonds (576 kcal per 100g, magnesium for sleep and recovery)",
            "Olive oil (884 kcal per 100ml, add to anything for easy +200 kcal)",
            "Avocado (160 kcal each, potassium, healthy monounsaturated fats)",
            "Dark chocolate 70%+ (small portion, high calorie, antioxidants)",
          ],
        },
        {
          name: "Convenient surplus meals",
          items: [
            "Post-workout shake: milk + whey + banana + peanut butter (500-700 kcal)",
            "Overnight oats: oats + milk + protein powder + nuts (600+ kcal)",
            "Rice + chicken thigh + olive oil drizzle (easy 600 kcal plate)",
          ],
        },
      ],
    },
    lose: {
      title: "Foods that support fat loss",
      source:
        "Westerterp-Plantenga et al., 2012; Paddon-Jones et al., 2008; general sports nutrition consensus",
      categories: [
        {
          name: "High-satiety protein",
          items: [
            "Chicken breast (31g protein per 100g, very lean, high TEF)",
            "Egg whites (11g protein per 100g, nearly zero fat)",
            "White fish (cod, tilapia: 20g+ protein, very low calorie)",
            "Greek yogurt (0% fat, 10g protein per 100g, filling)",
            "Cottage cheese (low-fat, casein-rich, slow-digesting)",
          ],
        },
        {
          name: "High-volume, low-calorie vegetables",
          items: [
            "Broccoli (34 kcal per 100g, high fiber, very filling)",
            "Spinach (23 kcal per 100g, iron, volume food)",
            "Cucumber (15 kcal per 100g, hydration + volume)",
            "Bell peppers (31 kcal per 100g, vitamin C)",
            "Cauliflower (25 kcal per 100g, rice/mash substitute)",
          ],
        },
        {
          name: "Smart carbs (fiber-rich, slow release)",
          items: [
            "Lentils (116 kcal per 100g cooked, 9g protein, very satiating)",
            "Berries (low sugar vs other fruit, high fiber, antioxidants)",
            "Potatoes (boiled: highest satiety index of any food tested)",
            "Quinoa (120 kcal per 100g cooked, complete protein)",
          ],
        },
        {
          name: "Deficit-friendly meals",
          items: [
            "Chicken breast + roasted vegetables + small rice portion (400 kcal)",
            "Large salad with fish + olive oil dressing (350-450 kcal, very filling)",
            "Egg white omelette with spinach and feta (250 kcal, 30g protein)",
          ],
        },
      ],
    },
    maintain: {
      title: "Foods that support maintenance",
      source: "General sports nutrition consensus; Mediterranean diet evidence base",
      categories: [
        {
          name: "Balanced protein",
          items: [
            "Rotate lean and fatty protein sources throughout the week",
            "Eggs, chicken, fish, legumes as staples",
            "Red meat 1-2x/week (iron, B12, zinc)",
          ],
        },
        {
          name: "Whole food carbs",
          items: [
            "Mix of rice, oats, potatoes, whole grains",
            "Fruit daily (2-3 servings for micronutrients)",
            "Legumes 3-4x/week (fiber, protein, gut health)",
          ],
        },
        {
          name: "Essential fats",
          items: [
            "Olive oil as primary cooking fat",
            "Fatty fish 2x/week (EPA/DHA for inflammation)",
            "Nuts as snacks (handful = ~200 kcal)",
          ],
        },
      ],
    },
  },

  bodyComposition: {
    bmiAdjustment: {
      threshold: 30,
      method: "Hamwi formula for ideal body weight, then adjusted = ideal + 0.4 × (actual - ideal)",
      source: "Hamwi, 1964; Adapted by clinical dietetics practice",
      note: "Used for protein calculation in obese individuals to avoid inflated targets.",
    },
  },
} as const;

// ── System prompt builder: converts structured data into AI context ──

function formatGuideline(g: CitedValue): string {
  return `${g.range[0]}-${g.range[1]} ${g.unit} (default ${g.default}). Source: ${g.source}.${g.note ? ` Note: ${g.note}` : ""}`;
}

export function buildNutritionSystemPrompt(): string {
  const g = GUIDELINES;
  return `You are a nutrition and fitness target calculator for LeveL, a 90-day self-accountability app.

EVIDENCE BASE (cite these when explaining numbers):

PROTEIN:
- Bulking: ${formatGuideline(g.protein.bulking)}
- Cutting: ${formatGuideline(g.protein.cutting)}
- Maintenance: ${formatGuideline(g.protein.maintenance)}

CALORIES:
- Equation: ${g.calories.equation.name} (${g.calories.equation.source})
- Lean surplus: ${formatGuideline(g.calories.surplus.lean)}
- Standard surplus: ${formatGuideline(g.calories.surplus.standard)}
- Moderate deficit: ${formatGuideline(g.calories.deficit.moderate)}
- Aggressive deficit: ${formatGuideline(g.calories.deficit.aggressive)}
- Safety floor: ${g.calories.safetyFloor.male} kcal (male), ${g.calories.safetyFloor.female} kcal (female). ${g.calories.safetyFloor.source}.

WEIGHT CHANGE RATE:
- Gain: ${formatGuideline(g.weightRate.gain)}
- Loss: ${formatGuideline(g.weightRate.loss)}

EXERCISE:
- Strength (gain): ${g.exercise.strengthGain.defaultFrequency}x/wk, ${g.exercise.strengthGain.defaultDuration} min. ${g.exercise.strengthGain.source}.
- Strength (cut): ${g.exercise.strengthCut.defaultFrequency}x/wk. ${g.exercise.strengthCut.note}
- Cardio: ${g.exercise.cardio.moderateMinPerWeek} min moderate OR ${g.exercise.cardio.vigorousMinPerWeek} min vigorous/wk. ${g.exercise.cardio.source}.
- Steps: gain=${g.exercise.steps.gain.target}, lose=${g.exercise.steps.lose.target}, maintain=${g.exercise.steps.maintain.target}.

HYDRATION: ${formatGuideline(g.hydration.perKg)}

OPTIONAL ACTIVITIES (context for suggestions, not required):
- Sleep: ${formatGuideline(g.optionalActivities.sleep)}
- Reading: ${formatGuideline(g.optionalActivities.reading)}
- Meditation: ${formatGuideline(g.optionalActivities.meditation)}
- Cold shower: ${formatGuideline(g.optionalActivities.cold_shower)}
- Walking: ${formatGuideline(g.optionalActivities.walking)}
- Stretching: ${formatGuideline(g.optionalActivities.stretching)}
- Journaling: ${formatGuideline(g.optionalActivities.journaling)}
- Gratitude: ${formatGuideline(g.optionalActivities.gratitude)}
- No phone AM: ${formatGuideline(g.optionalActivities.no_phone_am)}

RULES:
- Round calories to nearest 25, protein to nearest 5g.
- Cite the source when stating a number.
- If user context contradicts the formula, trust context and explain the override.
- Never go below safety floors.
- Voice: contract-like, factual, brief. Not a coach.`;
}

// For backward compatibility
// ── Public helper: get food recommendations for a goal ──

export function getFoodRecommendations(goal: "gain" | "lose" | "maintain") {
  return GUIDELINES.foods[goal];
}

export const KNOWLEDGE = {
  nutrition: buildNutritionSystemPrompt(),
} as const;
