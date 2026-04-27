"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { StepWelcome } from "./step-01-welcome";
import { StepWhy } from "./step-02-why";
import { StepTargets } from "./step-03-targets";
import { StepSchedule } from "./step-04-schedule";
import { StepSign } from "./step-05-sign";

export interface OnboardingState {
  displayName: string;
  // The Why
  anchorText: string;
  // Biometrics (questionnaire)
  age: number;
  sex: "male" | "female";
  weightKg: number;
  heightCm: number;
  goal: "gain" | "lose" | "maintain";
  activityLevel: "sedentary" | "light" | "moderate" | "very_active";
  trainingExperience: "beginner" | "intermediate" | "advanced";
  additionalContext: string;
  // Computed targets (filled by calculator + AI)
  calorieTarget: number;
  proteinTarget: number;
  bodyMinutes: number;
  craftSubtasks: { label: string; measurement: "binary" }[];
  fuelSubtasks: { label: string; measurement: "numeric"; target: number; unit: string }[];
  // Schedule
  bodyDays: number[];
  craftDays: number[];
  // Rewards
  rewards: {
    scheduledDay: number;
    tier: "small" | "big";
    name: string;
    priceAmount?: number;
    motivationNote?: string;
  }[];
}

const INITIAL_STATE: OnboardingState = {
  displayName: "",
  anchorText: "",
  age: 25,
  sex: "male",
  weightKg: 75,
  heightCm: 175,
  goal: "gain",
  activityLevel: "light",
  trainingExperience: "beginner",
  additionalContext: "",
  calorieTarget: 0,
  proteinTarget: 0,
  bodyMinutes: 45,
  craftSubtasks: [
    { label: "One LeetCode problem (any difficulty)", measurement: "binary" },
    { label: "One focused 60-min project session", measurement: "binary" },
  ],
  fuelSubtasks: [
    { label: "Calories", measurement: "numeric", target: 2950, unit: "kcal" },
    { label: "Protein", measurement: "numeric", target: 145, unit: "g" },
  ],
  bodyDays: [1, 2, 4, 6],
  craftDays: [1, 2, 3, 4, 5],
  rewards: [
    { scheduledDay: 15, tier: "small", name: "" },
    { scheduledDay: 30, tier: "big", name: "" },
    { scheduledDay: 45, tier: "small", name: "" },
    { scheduledDay: 60, tier: "big", name: "" },
    { scheduledDay: 75, tier: "small", name: "" },
    { scheduledDay: 90, tier: "big", name: "" },
  ],
};

export interface StepProps {
  state: OnboardingState;
  setState: (s: OnboardingState) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const STEPS = [StepWelcome, StepWhy, StepTargets, StepSchedule, StepSign];

const STEP_LABELS = ["Welcome", "The Why", "Targets", "Schedule", "Sign"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  useEffect(() => {
    async function fetchDisplayName() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();
      const profile = data as { display_name: string | null } | null;
      if (profile?.display_name) {
        setState((s) => ({ ...s, displayName: profile.display_name! }));
      }
    }
    fetchDisplayName();
  }, []);

  const CurrentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-paper relative z-[1]">
      <div className="max-w-[1280px] mx-auto px-14 py-8 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-0">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#161311" opacity="0.4" />
              <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#161311" opacity="0.7" />
              <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#161311" />
            </svg>
            <span className="font-[var(--font-ui)] font-[900] text-[18px] tracking-[0.005em]">
              LEVEL
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-1 rounded-full transition-all duration-400"
                style={{
                  width: n === step ? 44 : 28,
                  background: n < step ? "#161311" : n === step ? "#c4622d" : "#ebe2cf",
                }}
              />
            ))}
            <span className="ml-3 font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
              <strong className="text-ink font-semibold">
                STEP {String(step + 1).padStart(2, "0")}
              </strong>{" "}
              · OF 05 · {STEP_LABELS[step].toUpperCase()}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div
          key={step}
          className="mt-6"
          style={{
            animation: "stepReveal 0.6s cubic-bezier(0.2,0.8,0.2,1) forwards",
          }}
        >
          <CurrentStep
            state={state}
            setState={setState}
            onNext={() => {
              setStep((s) => Math.min(s + 1, 4));
              window.scrollTo(0, 0);
            }}
            onBack={() => {
              setStep((s) => Math.max(s - 1, 0));
              window.scrollTo(0, 0);
            }}
            step={step}
          />
        </div>

        <style>{`
          @keyframes stepReveal {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
