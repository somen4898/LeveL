"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingState } from "./page";

interface StepProps {
  state: OnboardingState;
  setState: (s: OnboardingState) => void;
  onNext: () => void;
  onBack: () => void;
  step: number;
}

const DAY_NAMES: Record<number, string> = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

export function StepCores({ state, onNext, onBack }: StepProps) {
  const cores = [
    {
      n: "I",
      name: "Body",
      target: `Structured lift · ${state.bodyMinutes} min minimum`,
      schedule: `${state.bodyDays.length}× / WEEK`,
      scheduleDays: state.bodyDays.map((d) => DAY_NAMES[d]).join(" · "),
      subtasks: [`Complete a structured workout, ≥${state.bodyMinutes} min, with logged sets.`],
    },
    {
      n: "II",
      name: "Fuel",
      target: "Intake · surplus + protein",
      schedule: "DAILY",
      scheduleDays: "EVERY DAY",
      subtasks: [
        `Calories ≥ ${state.calorieTarget.toLocaleString()} kcal`,
        `Protein ≥ ${state.proteinTarget}g`,
      ],
    },
    {
      n: "III",
      name: "Craft",
      target: "Deliberate practice",
      schedule: `${state.craftDays.length}× / WEEK`,
      scheduleDays: state.craftDays.map((d) => DAY_NAMES[d]).join(" · "),
      subtasks: state.craftSubtasks.map((s) => s.label),
    },
  ];

  return (
    <div>
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
        The Contract · Cores
      </span>
      <h1 className="font-[var(--font-display)] text-[60px] leading-[0.98] tracking-[-0.018em] mt-3.5">
        Three things you will <em className="italic">not</em>
        <br />
        negotiate with yourself
        <br />
        for ninety days.
      </h1>
      <p className="text-[14.5px] leading-[1.5] text-ink-2 mt-5 max-w-[580px]">
        Cores are binary. You either did them, or you didn&apos;t. Once signed, they are
        locked for 90 days. You cannot change targets, cannot remove a core,
        cannot reduce a schedule. This is the friction that makes the system work.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          Your three Cores
        </span>

        {cores.map((core) => (
          <div
            key={core.n}
            className="bg-card border border-hair rounded-[10px] overflow-hidden shadow-[0_1px_1px_rgba(35,25,15,0.03)]"
          >
            <div className="flex items-center gap-4 px-[26px] py-5 border-b border-hair-2">
              <span className="font-[var(--font-display)] text-[32px] italic text-ember w-[38px]">
                {core.n}
              </span>
              <div className="flex flex-col flex-1">
                <span className="text-[16px] font-semibold">{core.name}</span>
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-[3px]">
                  {core.target.toUpperCase()}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase bg-ink text-bone border border-ink font-medium">
                {core.schedule}
              </span>
              <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] w-[88px] text-right">
                {core.scheduleDays}
              </span>
            </div>
            <div className="px-[26px] py-3.5 bg-bone">
              <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                {core.subtasks.length > 1 ? "SUBTASKS · BOTH MUST HIT" : "SUBTASK · BINARY"}
              </span>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {core.subtasks.map((sub, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-[22px] h-[22px] rounded-[6px] bg-ember border-[1.5px] border-ember flex items-center justify-center text-white text-[12px] font-bold shadow-[0_0_0_4px_#fbeadb]">
                      ✓
                    </span>
                    <span className="text-[13.5px]">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sign block */}
      <div className="mt-8 bg-ink rounded-[10px] p-7">
        <div className="flex items-center gap-5">
          <div className="flex flex-col flex-1">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
              SIGN THE CONTRACT
            </span>
            <span className="font-[var(--font-display)] italic text-[24px] text-bone mt-2">
              &ldquo;I will not negotiate these three with myself for the next 90 days.&rdquo;
            </span>
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-4 tracking-[0.04em] mt-2.5">
              LOCKED ON SIGN · CANNOT BE CHANGED · CANNOT BE REMOVED
            </span>
          </div>
          <button
            onClick={onNext}
            className="px-[22px] py-3.5 bg-ember text-white border border-ember rounded-[7px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_12px_rgba(196,98,45,0.25)] hover:bg-ember-d transition-colors whitespace-nowrap"
          >
            Next · Choose rewards →
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <button
          onClick={onBack}
          className="px-[18px] py-[11px] bg-card text-ink-2 border border-hair rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors"
        >
          ← Edit cores
        </button>
        <div className="flex-1" />
        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
          NEXT: STEP 05 · CHOOSE SIX REWARDS
        </span>
      </div>
    </div>
  );
}
