"use client";

import { useState } from "react";
import { StepWelcome } from "./step-01-welcome";
import { StepWhy } from "./step-02-why";
import { StepTargets } from "./step-03-targets";
import { StepSchedule } from "./step-04-schedule";
import { StepSign } from "./step-05-sign";

export interface OnboardingState {
  // The Why
  anchorText: string;
  // Targets
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
  anchorText: "",
  calorieTarget: 2950,
  proteinTarget: 145,
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
              <strong className="text-ink font-semibold">STEP {String(step + 1).padStart(2, "0")}</strong> · OF 05 · {STEP_LABELS[step].toUpperCase()}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="mt-6">
          <CurrentStep
            state={state}
            setState={setState}
            onNext={() => setStep((s) => Math.min(s + 1, 4))}
            onBack={() => setStep((s) => Math.max(s - 1, 0))}
            step={step}
          />
        </div>
      </div>
    </div>
  );
}
