"use client";

import { useState } from "react";
import type { StepProps } from "./page";
import { calculateTargets } from "@/lib/domain/calculator";
import { getFoodRecommendations } from "@/lib/ai/knowledge";

type GoalType = "gain" | "lose" | "maintain";
type ActivityType = "sedentary" | "light" | "moderate" | "very_active";
type ExperienceType = "beginner" | "intermediate" | "advanced";

const GOALS: { value: GoalType; label: string; desc: string }[] = [
  { value: "gain", label: "Weight Gain", desc: "Build muscle, caloric surplus" },
  { value: "lose", label: "Weight Loss", desc: "Lose fat, caloric deficit" },
  { value: "maintain", label: "Maintain", desc: "Hold current composition" },
];

const ACTIVITY_LEVELS: { value: ActivityType; label: string; desc: string }[] = [
  { value: "sedentary", label: "Sedentary", desc: "Desk job, little exercise" },
  { value: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderately Active", desc: "Exercise 3-5 days/week" },
  { value: "very_active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
];

const EXPERIENCE: { value: ExperienceType; label: string }[] = [
  { value: "beginner", label: "Beginner (< 1 year)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" },
];

function FoodSection({ goal }: { goal: "gain" | "lose" | "maintain" }) {
  const foods = getFoodRecommendations(goal);
  return (
    <div className="mt-6 bg-card border border-hair rounded-[12px] overflow-hidden">
      <div className="px-7 py-5 border-b border-hair-2">
        <span className="font-[var(--font-tactical)] text-[11px] tracking-[0.18em] uppercase text-ink-3">
          RESEARCH-BACKED NUTRITION
        </span>
        <h3 className="font-[var(--font-display)] italic text-[24px] mt-1.5">{foods.title}</h3>
        <p className="text-[12px] text-ink-3 mt-1">Source: {foods.source}</p>
      </div>
      <div className="px-7 py-5 bg-bone">
        <div className="grid grid-cols-2 gap-6">
          {foods.categories.map((cat) => (
            <div key={cat.name}>
              <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ember font-semibold">
                {cat.name}
              </span>
              <ul className="mt-2 flex flex-col gap-1.5">
                {cat.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-[12.5px] leading-[1.5] text-ink-2 flex items-start gap-2"
                  >
                    <span className="text-ember mt-[3px] shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StepTargets({ state, setState, onNext, onBack }: StepProps) {
  const [computed, setComputed] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [aiWarnings, setAiWarnings] = useState<string[]>([]);

  function runCalculator() {
    const result = calculateTargets({
      age: state.age,
      sex: state.sex,
      weightKg: state.weightKg,
      heightCm: state.heightCm,
      goal: state.goal,
      activityLevel: state.activityLevel,
    });

    setState({
      ...state,
      calorieTarget: result.calorieTarget,
      proteinTarget: result.proteinG,
      bodyMinutes: result.exercise.minutesPerSession,
    });
    setComputed(true);
    setAiReasoning(null);
    setAiWarnings([]);
  }

  async function runAI() {
    setAiLoading(true);
    try {
      const { calculateWithAI } = await import("@/lib/actions/calculate-targets");
      const result = await calculateWithAI({
        age: state.age,
        sex: state.sex,
        weightKg: state.weightKg,
        heightCm: state.heightCm,
        goal: state.goal,
        activityLevel: state.activityLevel,
        trainingExperience: state.trainingExperience,
        context: state.additionalContext,
      });

      setState({
        ...state,
        calorieTarget: result.calorieTarget,
        proteinTarget: result.proteinG,
        bodyMinutes: result.bodyMinutes,
      });
      setAiReasoning(result.reasoning);
      setAiWarnings(result.warnings);
      setComputed(true);
    } catch {
      // Fallback to pure calculator
      runCalculator();
    }
    setAiLoading(false);
  }

  return (
    <div>
      <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        THE CONTRACT · DECLARE TARGETS
      </span>

      <h1 className="font-[var(--font-display)] text-[72px] leading-[0.96] tracking-[-0.02em] mt-[22px]">
        Quantify the <em className="italic text-ember">commitment.</em>
      </h1>

      <p className="font-[var(--font-display)] italic text-[21px] leading-[1.45] text-ink-2 mt-[22px] max-w-[640px]">
        Answer these questions. The system calculates your targets. You can override any number
        before signing.
      </p>

      {/* Questionnaire */}
      <div className="mt-8 bg-card border border-hair rounded-[14px] p-8">
        <span className="font-[var(--font-tactical)] text-[11px] tracking-[0.18em] uppercase text-ink-3 block mb-6">
          YOUR PROFILE
        </span>

        {/* Row 1: Age, Sex */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
              Age
            </label>
            <input
              type="number"
              value={state.age}
              onChange={(e) => setState({ ...state, age: Number(e.target.value) })}
              min={16}
              max={100}
              className="w-full px-4 py-3 font-[var(--font-tactical)] text-[24px] font-semibold bg-bone border border-hair rounded-[8px] text-ink outline-none focus:border-ember transition-colors tracking-[-0.02em]"
            />
          </div>
          <div>
            <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
              Sex
            </label>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setState({ ...state, sex: s })}
                  className={`flex-1 py-3 rounded-[8px] font-[var(--font-tactical)] text-[12px] tracking-[0.1em] uppercase border cursor-pointer transition-all ${
                    state.sex === s
                      ? "bg-ink text-bone border-ink"
                      : "bg-bone text-ink-3 border-hair hover:border-ink-3"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Weight, Height */}
        <div className="grid grid-cols-2 gap-5 mt-5">
          <div>
            <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
              Weight
            </label>
            <div className="flex items-baseline gap-2 px-4 py-3 bg-bone border border-hair rounded-[8px] focus-within:border-ember transition-colors">
              <input
                type="number"
                value={state.weightKg}
                onChange={(e) => setState({ ...state, weightKg: Number(e.target.value) })}
                className="w-full border-none outline-none bg-transparent font-[var(--font-tactical)] text-[24px] font-semibold text-ink tracking-[-0.02em]"
              />
              <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase shrink-0">
                kg
              </span>
            </div>
          </div>
          <div>
            <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
              Height
            </label>
            <div className="flex items-baseline gap-2 px-4 py-3 bg-bone border border-hair rounded-[8px] focus-within:border-ember transition-colors">
              <input
                type="number"
                value={state.heightCm}
                onChange={(e) => setState({ ...state, heightCm: Number(e.target.value) })}
                className="w-full border-none outline-none bg-transparent font-[var(--font-tactical)] text-[24px] font-semibold text-ink tracking-[-0.02em]"
              />
              <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase shrink-0">
                cm
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Goal */}
        <div className="mt-6">
          <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
            Goal
          </label>
          <div className="grid grid-cols-3 gap-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => setState({ ...state, goal: g.value })}
                className={`p-4 rounded-[8px] border cursor-pointer transition-all text-left ${
                  state.goal === g.value
                    ? "bg-ink text-bone border-ink"
                    : "bg-bone text-ink border-hair hover:border-ink-3"
                }`}
              >
                <span className="text-[14px] font-semibold block">{g.label}</span>
                <span
                  className={`text-[11px] mt-1 block ${state.goal === g.value ? "text-ink-4" : "text-ink-3"}`}
                >
                  {g.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Activity Level */}
        <div className="mt-5">
          <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
            Activity Level
          </label>
          <div className="grid grid-cols-4 gap-3">
            {ACTIVITY_LEVELS.map((a) => (
              <button
                key={a.value}
                onClick={() => setState({ ...state, activityLevel: a.value })}
                className={`p-3 rounded-[8px] border cursor-pointer transition-all text-left ${
                  state.activityLevel === a.value
                    ? "bg-ink text-bone border-ink"
                    : "bg-bone text-ink border-hair hover:border-ink-3"
                }`}
              >
                <span className="text-[12px] font-semibold block">{a.label}</span>
                <span
                  className={`text-[10px] mt-0.5 block ${state.activityLevel === a.value ? "text-ink-4" : "text-ink-3"}`}
                >
                  {a.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 5: Training Experience */}
        <div className="mt-5">
          <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
            Training Experience
          </label>
          <div className="flex gap-3">
            {EXPERIENCE.map((e) => (
              <button
                key={e.value}
                onClick={() => setState({ ...state, trainingExperience: e.value })}
                className={`flex-1 py-3 rounded-[8px] font-[var(--font-tactical)] text-[11px] tracking-[0.06em] border cursor-pointer transition-all ${
                  state.trainingExperience === e.value
                    ? "bg-ink text-bone border-ink"
                    : "bg-bone text-ink-3 border-hair hover:border-ink-3"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 6: Additional context */}
        <div className="mt-5">
          <label className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
            Anything else the system should know? (optional)
          </label>
          <input
            type="text"
            value={state.additionalContext}
            onChange={(e) => setState({ ...state, additionalContext: e.target.value })}
            placeholder="e.g. vegetarian, recovering from injury, skinny-fat, training for a marathon..."
            className="w-full px-4 py-3 text-[13px] bg-bone border border-hair rounded-[8px] text-ink outline-none focus:border-ember transition-colors placeholder:text-ink-4"
          />
        </div>

        {/* Calculate buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={runCalculator}
            className="px-5 py-3 bg-card text-ink border border-ink rounded-[8px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-all"
          >
            Calculate targets
          </button>
          <button
            onClick={runAI}
            disabled={aiLoading}
            className="px-5 py-3 bg-ember text-white border border-ember rounded-[8px] text-[13px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_12px_rgba(196,98,45,0.25)] hover:bg-ember-d transition-all disabled:opacity-50"
          >
            {aiLoading ? "Calculating..." : "Calculate with AI context"}
          </button>
        </div>
      </div>

      {/* Computed results */}
      {computed && (
        <>
          <div className="mt-6">
            {aiReasoning && (
              <div className="mb-4 p-5 bg-bone border border-hair rounded-[10px] border-l-[3px] border-l-ember">
                <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
                  AI REASONING
                </span>
                <p className="font-[var(--font-ui)] text-[13px] leading-[1.6] text-ink-2">
                  {aiReasoning}
                </p>
                {aiWarnings.length > 0 && (
                  <div className="mt-3 flex flex-col gap-1">
                    {aiWarnings.map((w, i) => (
                      <span key={i} className="text-[12px] text-rust">
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <span className="font-[var(--font-tactical)] text-[11px] tracking-[0.18em] uppercase text-ink-3 block mb-3">
              YOUR TARGETS · EDITABLE BEFORE SIGN
            </span>

            {/* Core I: Body */}
            <div className="bg-card border border-hair rounded-[12px] overflow-hidden">
              <div className="flex items-center gap-[18px] px-7 py-[22px] border-b border-hair-2">
                <span className="font-[var(--font-display)] italic text-[48px] text-ember leading-none w-12">
                  I
                </span>
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="font-[var(--font-display)] italic text-[32px] leading-none">
                    Body
                  </h3>
                  <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3">
                    PHYSICAL TRAINING
                  </span>
                </div>
              </div>
              <div className="px-7 py-5 bg-bone">
                <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
                  MIN SESSION LENGTH
                </span>
                <div className="inline-flex items-baseline gap-2 px-4 py-2.5 bg-card border border-hair rounded-[8px] focus-within:border-ember">
                  <input
                    type="number"
                    value={state.bodyMinutes}
                    onChange={(e) => setState({ ...state, bodyMinutes: Number(e.target.value) })}
                    className="w-[80px] border-none outline-none bg-transparent font-[var(--font-tactical)] text-[28px] font-semibold text-ink tracking-[-0.02em]"
                  />
                  <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase">
                    min
                  </span>
                </div>
              </div>
            </div>

            {/* Core II: Fuel */}
            <div className="mt-3 bg-card border border-hair rounded-[12px] overflow-hidden">
              <div className="flex items-center gap-[18px] px-7 py-[22px] border-b border-hair-2">
                <span className="font-[var(--font-display)] italic text-[48px] text-ember leading-none w-12">
                  II
                </span>
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="font-[var(--font-display)] italic text-[32px] leading-none">
                    Fuel
                  </h3>
                  <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3">
                    NUTRITION · DAILY
                  </span>
                </div>
              </div>
              <div className="px-7 py-5 bg-bone">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
                      DAILY CALORIES
                    </span>
                    <div className="inline-flex items-baseline gap-2 px-4 py-2.5 bg-card border border-hair rounded-[8px] focus-within:border-ember">
                      <input
                        type="number"
                        value={state.calorieTarget}
                        onChange={(e) =>
                          setState({ ...state, calorieTarget: Number(e.target.value) })
                        }
                        className="w-[100px] border-none outline-none bg-transparent font-[var(--font-tactical)] text-[28px] font-semibold text-ink tracking-[-0.02em]"
                      />
                      <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase">
                        kcal
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
                      DAILY PROTEIN
                    </span>
                    <div className="inline-flex items-baseline gap-2 px-4 py-2.5 bg-card border border-hair rounded-[8px] focus-within:border-ember">
                      <input
                        type="number"
                        value={state.proteinTarget}
                        onChange={(e) =>
                          setState({ ...state, proteinTarget: Number(e.target.value) })
                        }
                        className="w-[80px] border-none outline-none bg-transparent font-[var(--font-tactical)] text-[28px] font-semibold text-ink tracking-[-0.02em]"
                      />
                      <span className="font-[var(--font-tactical)] text-[12px] text-ink-3 tracking-[0.14em] uppercase">
                        grams
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core III: Craft */}
            <div className="mt-3 bg-card border border-hair rounded-[12px] overflow-hidden">
              <div className="flex items-center gap-[18px] px-7 py-[22px] border-b border-hair-2">
                <span className="font-[var(--font-display)] italic text-[48px] text-ember leading-none w-12">
                  III
                </span>
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="font-[var(--font-display)] italic text-[32px] leading-none">
                    Craft
                  </h3>
                  <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3">
                    DELIBERATE PRACTICE · CHANGEABLE MID-RUN
                  </span>
                </div>
              </div>
              <div className="px-7 py-5 bg-bone">
                <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-3 block mb-2">
                  CHOOSE YOUR MODALITY
                </span>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {state.craftSubtasks.map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3.5 bg-ink text-bone border border-ink rounded-[8px]"
                    >
                      <span className="w-5 h-5 rounded-[5px] bg-ember border-[1.5px] border-ember flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        ✓
                      </span>
                      <span className="text-[13px] leading-[1.4]">{sub.label}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-ink-3 leading-[1.5]">
                  Craft subtasks can be changed mid-run with a reason. The other Cores lock on sign.
                </p>
              </div>
            </div>
          </div>

          <FoodSection goal={state.goal} />
        </>
      )}

      {/* Nav */}
      <div className="mt-9 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-[18px] py-[11px] bg-transparent text-ink-3 border border-hair rounded-[7px] text-[13px] cursor-pointer hover:text-ink hover:border-ink-3 transition-all"
        >
          ← Step 02 · The Why
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          {computed ? "NEXT: STEP 04 · SCHEDULE" : "CALCULATE TARGETS FIRST"}
        </span>
        <button
          onClick={onNext}
          disabled={!computed || state.calorieTarget === 0}
          className="inline-flex items-center gap-2.5 px-[22px] py-[13px] bg-ember text-white border border-ember rounded-[8px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_16px_rgba(196,98,45,0.3)] hover:bg-ember-d hover:-translate-y-px transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lock targets & continue <span>→</span>
        </button>
      </div>
    </div>
  );
}
