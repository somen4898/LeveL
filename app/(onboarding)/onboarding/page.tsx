"use client";

import { useState } from "react";
import { StepWelcome } from "./step-01-welcome";
import { StepTargets } from "./step-02-targets";
import { StepSchedule } from "./step-03-schedule";
import { StepCores } from "./step-04-cores";
import { StepRewards } from "./step-05-rewards";

export interface OnboardingState {
  // Targets
  calorieTarget: number;
  proteinTarget: number;
  // Schedule
  gymDays: number[];
  codingDays: number[];
  // Cores are fixed: gym, eating, coding
  // Gym subtask
  gymMinutes: number;
  // Coding subtasks
  codingSubtasks: { label: string; measurement: "binary" }[];
  // Eating subtasks
  eatingSubtasks: { label: string; measurement: "numeric"; target: number; unit: string }[];
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
  calorieTarget: 2950,
  proteinTarget: 145,
  gymDays: [1, 2, 4, 6], // Mon, Tue, Thu, Sat
  codingDays: [1, 2, 3, 4, 5], // Mon-Fri
  gymMinutes: 45,
  codingSubtasks: [
    { label: "One LeetCode problem (any difficulty)", measurement: "binary" },
    { label: "One focused 60-min project session", measurement: "binary" },
  ],
  eatingSubtasks: [
    { label: "Calories", measurement: "numeric", target: 2950, unit: "kcal" },
    { label: "Protein", measurement: "numeric", target: 145, unit: "g" },
  ],
  rewards: [
    { scheduledDay: 15, tier: "small", name: "" },
    { scheduledDay: 30, tier: "big", name: "" },
    { scheduledDay: 45, tier: "small", name: "" },
    { scheduledDay: 60, tier: "big", name: "" },
    { scheduledDay: 75, tier: "small", name: "" },
    { scheduledDay: 90, tier: "big", name: "" },
  ],
};

const STEPS = [StepWelcome, StepTargets, StepSchedule, StepCores, StepRewards];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  const CurrentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-paper relative z-[1]">
      <div className="max-w-[980px] mx-auto px-14 py-12">
        {/* Header */}
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#161311" opacity="0.4" />
            <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#161311" opacity="0.7" />
            <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#161311" />
          </svg>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-1 rounded-full transition-all"
                style={{
                  width: 28,
                  background: n <= step + 1 ? "#161311" : "#ebe2cf",
                }}
              />
            ))}
          </div>
          <span className="ml-2.5 font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
            {String(step + 1).padStart(2, "0")} / 05
          </span>
        </div>

        {/* Step content */}
        <div className="mt-12">
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
