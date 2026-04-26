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

export function StepRewards({ state, setState, onBack }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateReward = (index: number, field: string, value: string | number) => {
    const updated = [...state.rewards];
    updated[index] = { ...updated[index], [field]: value };
    setState({ ...state, rewards: updated });
  };

  const allRewardsNamed = state.rewards.every((r) => r.name.trim().length > 0);

  async function handleSign() {
    if (!allRewardsNamed) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create run
      const { data: run, error: runErr } = await supabase
        .from("runs")
        .insert({
          user_id: user.id,
          status: "active" as const,
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        })
        .select("id")
        .single();
      if (runErr || !run) throw new Error(runErr?.message || "Failed to create run");

      // Update profile
      await supabase
        .from("profiles")
        .update({ active_run_id: run.id })
        .eq("id", user.id);

      // Create cores
      const coreConfigs = [
        { kind: "body" as const, schedule_days: state.bodyDays },
        { kind: "fuel" as const, schedule_days: [0, 1, 2, 3, 4, 5, 6] },
        { kind: "craft" as const, schedule_days: state.craftDays },
      ];

      for (const cfg of coreConfigs) {
        const { data: core, error: coreErr } = await supabase
          .from("cores")
          .insert({
            run_id: run.id,
            user_id: user.id,
            kind: cfg.kind,
            schedule_days: cfg.schedule_days,
            is_locked: true,
          })
          .select("id")
          .single();
        if (coreErr || !core) throw new Error(coreErr?.message || "Failed to create core");

        // Create subtasks
        if (cfg.kind === "body") {
          await supabase.from("subtasks").insert({
            core_id: core.id,
            user_id: user.id,
            label: `Complete a structured workout, ≥${state.bodyMinutes} min`,
            measurement: "binary",
          });
        } else if (cfg.kind === "fuel") {
          await supabase.from("subtasks").insert([
            {
              core_id: core.id,
              user_id: user.id,
              label: `Calories ≥ ${state.calorieTarget.toLocaleString()}`,
              measurement: "numeric",
              target_numeric: state.calorieTarget,
              unit: "kcal",
              position: 0,
            },
            {
              core_id: core.id,
              user_id: user.id,
              label: `Protein ≥ ${state.proteinTarget}g`,
              measurement: "numeric",
              target_numeric: state.proteinTarget,
              unit: "g",
              position: 1,
            },
          ]);
        } else if (cfg.kind === "craft") {
          await supabase.from("subtasks").insert(
            state.craftSubtasks.map((s, i) => ({
              core_id: core.id,
              user_id: user.id,
              label: s.label,
              measurement: "binary" as const,
              position: i,
            }))
          );
        }
      }

      // Create rewards
      await supabase.from("rewards").insert(
        state.rewards.map((r) => ({
          run_id: run.id,
          user_id: user.id,
          scheduled_day: r.scheduledDay,
          tier: r.tier,
          name: r.name,
          price_amount: r.priceAmount ?? null,
          motivation_note: r.motivationNote ?? null,
        }))
      );

      // Create level catalogue (30 levels)
      const catalogue = buildLevelCatalogue(run.id, user.id);
      await supabase.from("level_catalogue").insert(catalogue);

      // Create day 1 log
      await supabase.from("daily_logs").insert({
        run_id: run.id,
        user_id: user.id,
        log_date: new Date().toISOString().split("T")[0],
        day_index: 1,
      });

      router.push("/today");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
        The Contract · Rewards
      </span>
      <h1 className="font-[var(--font-display)] text-[48px] leading-[1.02] tracking-[-0.018em] mt-3.5 italic">
        Six things you earn.
      </h1>
      <p className="text-[14.5px] leading-[1.5] text-ink-2 mt-5 max-w-[580px]">
        Choose six rewards, alternating small and big. Each unlocks at a fixed day
        if you qualify. Pre-commitment closes the bargaining loop. No downgrades after sign.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {state.rewards.map((reward, i) => (
          <div key={i} className="bg-card border border-hair rounded-[10px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                DAY {reward.scheduledDay}
              </span>
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-hair rounded text-ink-3 font-semibold">
                {reward.tier.toUpperCase()}
              </span>
            </div>
            <input
              type="text"
              value={reward.name}
              onChange={(e) => updateReward(i, "name", e.target.value)}
              placeholder="What's the reward?"
              className="w-full px-3 py-2 text-[13px] bg-bone border border-hair-2 rounded-[7px] text-ink outline-none focus:border-ink transition-colors font-[var(--font-display)] italic text-[18px]"
            />
            <input
              type="number"
              value={reward.priceAmount ?? ""}
              onChange={(e) =>
                updateReward(i, "priceAmount", Number(e.target.value))
              }
              placeholder="Price (optional)"
              className="w-full mt-2 px-3 py-2 text-[13px] bg-bone border border-hair-2 rounded-[7px] text-ink outline-none focus:border-ink transition-colors font-[var(--font-tactical)]"
            />
            <input
              type="text"
              value={reward.motivationNote ?? ""}
              onChange={(e) => updateReward(i, "motivationNote", e.target.value)}
              placeholder="Why this reward?"
              className="w-full mt-2 px-3 py-2 text-[12px] bg-bone border border-hair-2 rounded-[7px] text-ink-2 outline-none focus:border-ink transition-colors"
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-ember-bg border border-ember-l text-[13px] text-ember-d">
          {error}
        </div>
      )}

      {/* Sign */}
      <div className="mt-8 bg-ink rounded-[10px] p-7">
        <div className="flex items-center gap-5">
          <div className="flex flex-col flex-1">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
              FINAL STEP
            </span>
            <span className="font-[var(--font-display)] italic text-[24px] text-bone mt-2">
              &ldquo;I commit to these six rewards and the contract that earns them.&rdquo;
            </span>
          </div>
          <button
            onClick={handleSign}
            disabled={loading || !allRewardsNamed}
            className="px-[22px] py-3.5 bg-ember text-white border border-ember rounded-[7px] text-[14px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_12px_rgba(196,98,45,0.25)] hover:bg-ember-d transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Signing..." : "Sign & begin Day 01 →"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onBack}
          className="px-[18px] py-[11px] bg-card text-ink-2 border border-hair rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors"
        >
          ← Edit rewards
        </button>
      </div>
    </div>
  );
}

function buildLevelCatalogue(runId: string, userId: string) {
  const levels = [
    { n: 1, kind: "TIGHTEN", desc: "Water target +50ml" },
    { n: 2, kind: "UNLOCK", desc: "Mobility · 10 min", optLabel: "Mobility · 10 min", optMeasurement: "numeric", optTarget: 10, optUnit: "min" },
    { n: 3, kind: "TIGHTEN", desc: "Body minimum +2 minutes" },
    { n: 4, kind: "UNLOCK", desc: "Tech reading · 20 min", optLabel: "Tech reading · 20 min", optMeasurement: "numeric", optTarget: 20, optUnit: "min" },
    { n: 5, kind: "TIGHTEN", desc: "Sleep window narrowed by 15 min" },
    { n: 6, kind: "UNLOCK", desc: "Cold shower · 60 sec", optLabel: "Cold shower · 60 sec", optMeasurement: "numeric", optTarget: 60, optUnit: "sec" },
    { n: 7, kind: "TIGHTEN", desc: "Calorie target +50 kcal" },
    { n: 8, kind: "UNLOCK", desc: "Journaling · 200 words", optLabel: "Journaling · 200 words", optMeasurement: "numeric", optTarget: 200, optUnit: "words" },
    { n: 9, kind: "TIGHTEN", desc: "Protein target +5g" },
    { n: 10, kind: "UNLOCK", desc: "Walk · 8,000 steps", optLabel: "Walk · 8,000 steps", optMeasurement: "numeric", optTarget: 8000, optUnit: "steps" },
    { n: 11, kind: "TIGHTEN", desc: "Mobility minimum +1 minute" },
    { n: 12, kind: "UNLOCK", desc: "Meditation · 5 min", optLabel: "Meditation · 5 min", optMeasurement: "numeric", optTarget: 5, optUnit: "min" },
    { n: 13, kind: "TIGHTEN", desc: "Reading minimum +5 minutes" },
    { n: 14, kind: "UNLOCK", desc: "No sugar after 8pm", optLabel: "No sugar after 8pm", optMeasurement: "binary" },
    { n: 15, kind: "TIGHTEN", desc: "Cold-shower minimum +15 sec" },
    { n: 16, kind: "UNLOCK", desc: "No phone first 30 min", optLabel: "No phone first 30 min", optMeasurement: "binary" },
    { n: 17, kind: "TIGHTEN", desc: "Journal minimum +50 words" },
    { n: 18, kind: "UNLOCK", desc: "Stretching · 5 min", optLabel: "Stretching · 5 min", optMeasurement: "numeric", optTarget: 5, optUnit: "min" },
    { n: 19, kind: "TIGHTEN", desc: "LeetCode minimum +1 problem" },
    { n: 20, kind: "UNLOCK", desc: "One-line gratitude", optLabel: "One-line gratitude", optMeasurement: "binary" },
    { n: 21, kind: "TIGHTEN", desc: "Walk target +500 steps" },
    { n: 22, kind: "UNLOCK", desc: "Sunlight · 10 min before noon", optLabel: "Sunlight · 10 min before noon", optMeasurement: "numeric", optTarget: 10, optUnit: "min" },
    { n: 23, kind: "TIGHTEN", desc: "Sleep window narrowed by 15 min" },
    { n: 24, kind: "UNLOCK", desc: "Read non-fiction · 15 min", optLabel: "Read non-fiction · 15 min", optMeasurement: "numeric", optTarget: 15, optUnit: "min" },
    { n: 25, kind: "TIGHTEN", desc: "Water target +50ml" },
    { n: 26, kind: "UNLOCK", desc: "Cook from scratch", optLabel: "Cook from scratch", optMeasurement: "binary" },
    { n: 27, kind: "TIGHTEN", desc: "Mobility minimum +1 minute" },
    { n: 28, kind: "UNLOCK", desc: "No social before 11am", optLabel: "No social before 11am", optMeasurement: "binary" },
    { n: 29, kind: "TIGHTEN", desc: "Reading minimum +5 minutes" },
    { n: 30, kind: "UNLOCK", desc: "Plan tomorrow tonight", optLabel: "Plan tomorrow tonight", optMeasurement: "binary" },
  ];

  return levels.map((l) => ({
    run_id: runId,
    user_id: userId,
    level_number: l.n,
    effect_kind: l.kind as "TIGHTEN" | "UNLOCK",
    description: l.desc,
    new_optional_label: "optLabel" in l ? (l as Record<string, unknown>).optLabel as string : null,
    new_optional_measurement: "optMeasurement" in l ? (l as Record<string, unknown>).optMeasurement as string : null,
    new_optional_target_numeric: "optTarget" in l ? (l as Record<string, unknown>).optTarget as number : null,
    new_optional_unit: "optUnit" in l ? ((l as Record<string, unknown>).optUnit as string) ?? null : null,
  }));
}
