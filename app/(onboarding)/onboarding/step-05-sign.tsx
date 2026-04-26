"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { StepProps } from "./page";

const DAY_NAMES: Record<number, string> = { 0: "Su", 1: "M", 2: "T", 3: "W", 4: "Th", 5: "F", 6: "Sa" };

export function StepSign({ state, setState, onBack }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const allRewardsNamed = state.rewards.every((r) => r.name.trim().length > 0);

  function updateReward(index: number, field: string, value: string | number) {
    const updated = [...state.rewards];
    updated[index] = { ...updated[index], [field]: value };
    setState({ ...state, rewards: updated });
  }

  async function handleSign() {
    if (!allRewardsNamed) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create run
      const { data: run, error: runErr } = await supabase
        .from("runs")
        .insert({
          user_id: user.id,
          status: "active" as const,
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        })
        .select("id")
        .single();
      if (runErr || !run) throw new Error(runErr?.message || "Failed to create run");

      await supabase.from("profiles").update({ active_run_id: run.id } as never).eq("id", user.id);

      // Create cores + subtasks
      const coreConfigs = [
        { kind: "body" as const, schedule_days: state.bodyDays },
        { kind: "fuel" as const, schedule_days: [0, 1, 2, 3, 4, 5, 6] },
        { kind: "craft" as const, schedule_days: state.craftDays },
      ];

      for (const cfg of coreConfigs) {
        const { data: core } = await supabase
          .from("cores")
          .insert({ run_id: run.id, user_id: user.id, kind: cfg.kind, schedule_days: cfg.schedule_days, is_locked: true })
          .select("id")
          .single();
        if (!core) continue;

        if (cfg.kind === "body") {
          await supabase.from("subtasks").insert({ core_id: core.id, user_id: user.id, label: `Complete a structured workout, ≥${state.bodyMinutes} min`, measurement: "binary" });
        } else if (cfg.kind === "fuel") {
          await supabase.from("subtasks").insert([
            { core_id: core.id, user_id: user.id, label: `Calories ≥ ${state.calorieTarget.toLocaleString()}`, measurement: "numeric", target_numeric: state.calorieTarget, unit: "kcal", position: 0 },
            { core_id: core.id, user_id: user.id, label: `Protein ≥ ${state.proteinTarget}g`, measurement: "numeric", target_numeric: state.proteinTarget, unit: "g", position: 1 },
          ]);
        } else if (cfg.kind === "craft") {
          await supabase.from("subtasks").insert(
            state.craftSubtasks.map((s, i) => ({ core_id: core.id, user_id: user.id, label: s.label, measurement: "binary" as const, position: i }))
          );
        }
      }

      // Create rewards
      await supabase.from("rewards").insert(
        state.rewards.map((r) => ({
          run_id: run.id, user_id: user.id, scheduled_day: r.scheduledDay, tier: r.tier,
          name: r.name, price_amount: r.priceAmount ?? null, motivation_note: r.motivationNote ?? null,
        }))
      );

      // Seed level catalogue
      await supabase.from("level_catalogue").insert(buildLevelCatalogue(run.id, user.id));

      // Create day 1 log
      await supabase.from("daily_logs").insert({
        run_id: run.id, user_id: user.id, log_date: new Date().toISOString().split("T")[0], day_index: 1,
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
      <span className="inline-flex items-center gap-2.5 font-[var(--font-tactical)] text-[11px] tracking-[0.2em] uppercase text-ink-3">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        THE CONTRACT · READ & SIGN
      </span>

      <h1 className="font-[var(--font-display)] text-[72px] leading-[0.96] tracking-[-0.02em] mt-[22px]">
        Read it back. <em className="italic text-ember">Then sign.</em>
      </h1>

      <p className="font-[var(--font-display)] italic text-[21px] leading-[1.45] text-ink-2 mt-[22px] max-w-[640px]">
        Everything you declared, rendered as a formal document. A real contract gets read before it gets signed.
      </p>

      {/* Contract document */}
      <div className="mt-8 border border-hair rounded-[14px] overflow-hidden bg-card shadow-[0_24px_48px_-28px_rgba(20,15,10,0.2)]">

        {/* Section I: Identity & Anchor */}
        <div className="p-[28px_36px] border-b border-hair-2">
          <div className="flex items-baseline gap-3.5 mb-[18px]">
            <span className="font-[var(--font-display)] italic text-[22px] text-ember">I</span>
            <h4 className="font-[var(--font-display)] italic text-[26px]">Identity & anchor</h4>
            <span className="ml-auto font-[var(--font-tactical)] text-[9.5px] tracking-[0.16em] uppercase text-ember">LOCKED</span>
          </div>
          <div className="bg-ink text-bone rounded-[10px] p-[24px_28px]">
            <div className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-4 mb-1.5">SIGNED BY</div>
            <div className="font-[var(--font-tactical)] text-[22px] font-semibold">@player_one</div>
            <div className="mt-[22px] pt-[22px] border-t border-[#2a2520]">
              <div className="font-[var(--font-tactical)] text-[10px] tracking-[0.16em] uppercase text-ink-4 mb-2.5">YOUR ANCHOR · WRITTEN ON STEP 02</div>
              <p className="font-[var(--font-display)] italic text-[22px] leading-[1.45]">
                &ldquo;{state.anchorText || "Your anchor text will appear here."}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Section II: Three Cores */}
        <div className="p-[28px_36px] border-b border-hair-2">
          <div className="flex items-baseline gap-3.5 mb-[18px]">
            <span className="font-[var(--font-display)] italic text-[22px] text-ember">II</span>
            <h4 className="font-[var(--font-display)] italic text-[26px]">The three Cores</h4>
            <span className="ml-auto font-[var(--font-tactical)] text-[9.5px] tracking-[0.16em] uppercase text-ember">LOCKED FOR 90 DAYS</span>
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            {[
              { n: "I", name: "Body", rows: [["Cadence", `${state.bodyDays.length}× / week`], ["Min", `${state.bodyMinutes} min`], ["Days", state.bodyDays.map(d => DAY_NAMES[d]).join(" · ")]] },
              { n: "II", name: "Fuel", rows: [["Cadence", "Daily"], ["Calories", `≥ ${state.calorieTarget.toLocaleString()} kcal`], ["Protein", `≥ ${state.proteinTarget} g`]] },
              { n: "III", name: "Craft", rows: [["Cadence", `${state.craftDays.length}× / week`], ...state.craftSubtasks.map((s, i) => [`Subtask ${String.fromCharCode(65 + i)}`, s.label.split(" ").slice(0, 3).join(" ")])] },
            ].map((core) => (
              <div key={core.n} className="border border-hair rounded-[10px] p-5 bg-bone relative">
                <span className="absolute top-4 right-4 font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase text-ember flex items-center gap-1.5">LOCKED</span>
                <span className="font-[var(--font-display)] italic text-[36px] text-ember leading-none">{core.n}</span>
                <h5 className="font-[var(--font-display)] italic text-[24px] mt-1.5 mb-3">{core.name}</h5>
                {core.rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-t border-hair-2 text-[12.5px]">
                    <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.12em] uppercase text-ink-3">{k}</span>
                    <span className="text-ink font-medium">{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Section III: Weekly rhythm */}
        <div className="p-[28px_36px] border-b border-hair-2">
          <div className="flex items-baseline gap-3.5 mb-[18px]">
            <span className="font-[var(--font-display)] italic text-[22px] text-ember">III</span>
            <h4 className="font-[var(--font-display)] italic text-[26px]">Weekly rhythm</h4>
            <span className="ml-auto font-[var(--font-tactical)] text-[9.5px] tracking-[0.16em] uppercase text-ember">LOCKED</span>
          </div>
          <div className="grid grid-cols-7 gap-2.5 mt-2.5">
            {[
              { n: 1, label: "Mon" }, { n: 2, label: "Tue" }, { n: 3, label: "Wed" },
              { n: 4, label: "Thu" }, { n: 5, label: "Fri" }, { n: 6, label: "Sat" }, { n: 0, label: "Sun" },
            ].map((d) => (
              <div key={d.n} className="text-center p-3.5 bg-bone border border-hair rounded-[8px]">
                <div className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3 mb-2">{d.label}</div>
                <div className="flex flex-col gap-[3px] font-[var(--font-tactical)] text-[9px]">
                  {state.bodyDays.includes(d.n)
                    ? <span className="text-ember font-semibold">I · BODY</span>
                    : <span className="text-ink-4">-</span>}
                  <span className="text-ink font-semibold">II · FUEL</span>
                  {state.craftDays.includes(d.n)
                    ? <span className="text-ember font-semibold">III · CRAFT</span>
                    : <span className="text-ink-4">-</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section IV: Rewards */}
        <div className="p-[28px_36px] border-b border-hair-2">
          <div className="flex items-baseline gap-3.5 mb-[18px]">
            <span className="font-[var(--font-display)] italic text-[22px] text-ember">IV</span>
            <h4 className="font-[var(--font-display)] italic text-[26px]">Six rewards</h4>
            <span className="ml-auto font-[var(--font-tactical)] text-[9.5px] tracking-[0.16em] uppercase text-ember">LOCKED AT SIGN</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {state.rewards.map((reward, i) => (
              <div key={i} className="border border-hair rounded-[10px] p-5 bg-bone">
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
                  placeholder="Name this reward"
                  className="w-full px-3 py-2 font-[var(--font-display)] italic text-[18px] bg-card border border-hair rounded-[7px] text-ink outline-none focus:border-ember transition-colors"
                />
                <input
                  type="number"
                  value={reward.priceAmount ?? ""}
                  onChange={(e) => updateReward(i, "priceAmount", Number(e.target.value))}
                  placeholder="Price (optional)"
                  className="w-full mt-2 px-3 py-2 text-[13px] font-[var(--font-tactical)] bg-card border border-hair rounded-[7px] text-ink outline-none focus:border-ember transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Signature block */}
        <div className="bg-ink text-bone p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[60%] pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(232,162,107,0.08), transparent 70%)" }} />

          {/* Seal */}
          <div className="relative z-[2] w-[88px] h-[88px] rounded-full border-[1.5px] border-ember mx-auto flex items-center justify-center" style={{ background: "rgba(196,98,45,0.08)" }}>
            <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#e8a26b" opacity="0.4" />
              <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#e8a26b" opacity="0.7" />
              <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#e8a26b" />
            </svg>
            <div className="absolute -inset-2.5 rounded-full border border-dashed border-ember opacity-55" style={{ animation: "rotate 30s linear infinite" }} />
            <div className="absolute -inset-[22px] rounded-full border border-dotted border-ember opacity-25" style={{ animation: "rotate 60s linear infinite reverse" }} />
          </div>

          <p className="relative z-[2] font-[var(--font-display)] italic text-[36px] leading-[1.3] mt-7 max-w-[760px] mx-auto">
            &ldquo;I will not negotiate these three with myself for the next ninety days.&rdquo;
          </p>

          {state.anchorText && (
            <p className="relative z-[2] mt-6 text-[13px] text-ink-4 max-w-[560px] mx-auto leading-[1.55] italic">
              Echoing your anchor: &ldquo;{state.anchorText.slice(0, 120)}{state.anchorText.length > 120 ? "..." : ""}&rdquo;
            </p>
          )}

          {error && (
            <div className="relative z-[2] mt-4 p-3 rounded-lg bg-ember-bg border border-ember-l text-[13px] text-ember-d max-w-[400px] mx-auto">
              {error}
            </div>
          )}

          <button
            onClick={handleSign}
            disabled={loading || !allRewardsNamed}
            className="relative z-[2] mt-9 inline-flex items-center gap-3 px-8 py-[18px] bg-ember text-white border-none rounded-[10px] text-[16px] font-semibold cursor-pointer shadow-[0_1px_0_#a04e1f,0_12px_32px_rgba(196,98,45,0.4)] hover:bg-ember-d hover:-translate-y-0.5 hover:shadow-[0_1px_0_#a04e1f,0_16px_40px_rgba(196,98,45,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing..." : "Sign & begin Day 01"} <span className="transition-transform hover:translate-x-1.5">→</span>
          </button>

          <div className="relative z-[2] mt-[22px] flex justify-center gap-2.5 flex-wrap font-[var(--font-tactical)] text-[10px] tracking-[0.2em] uppercase text-ink-4">
            <span className="px-2.5 py-1 border border-ember rounded-full text-ember-l">IRREVERSIBLE</span>
            <span className="px-2.5 py-1 border border-[#2a2520] rounded-full">CORES LOCK</span>
            <span className="px-2.5 py-1 border border-[#2a2520] rounded-full">TARGETS LOCK</span>
            <span className="px-2.5 py-1 border border-[#2a2520] rounded-full">SCHEDULE LOCKS</span>
            <span className="px-2.5 py-1 border border-[#2a2520] rounded-full">ANCHOR LOCKS</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="mt-9 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-[18px] py-[11px] bg-transparent text-ink-3 border border-hair rounded-[7px] text-[13px] cursor-pointer hover:text-ink hover:border-ink-3 transition-all"
        >
          ← Step 04 · Schedule
        </button>
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.14em] uppercase text-ink-3">
          END · DAY 01 OPENS ON SIGN
        </span>
        <span />
      </div>

      <style>{`
        @keyframes rotate { to { transform: rotate(360deg); } }
      `}</style>
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
    run_id: runId, user_id: userId, level_number: l.n,
    effect_kind: l.kind as "TIGHTEN" | "UNLOCK", description: l.desc,
    new_optional_label: "optLabel" in l ? (l as Record<string, unknown>).optLabel as string : null,
    new_optional_measurement: "optMeasurement" in l ? (l as Record<string, unknown>).optMeasurement as string : null,
    new_optional_target_numeric: "optTarget" in l ? (l as Record<string, unknown>).optTarget as number : null,
    new_optional_unit: "optUnit" in l ? ((l as Record<string, unknown>).optUnit as string) ?? null : null,
  }));
}
