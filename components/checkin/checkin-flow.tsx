"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitWeighIn, confirmAdjustment } from "@/lib/actions/submit-checkin";
import type { WeightTrend, AdjustmentDecision } from "@/lib/domain/checkin";

interface PastCheckin {
  weight_kg: number;
  day_index: number;
  created_at: string;
}

interface Props {
  runId: string;
  userId: string;
  currentDay: number;
  weekNumber: number;
  pastCheckins: PastCheckin[];
  currentLevel: number;
  alreadyCheckedIn: boolean;
}

type Step = "input" | "results" | "confirmed";

export function CheckinFlow({
  runId,
  currentDay,
  weekNumber,
  pastCheckins,
  currentLevel,
  alreadyCheckedIn,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>(alreadyCheckedIn ? "input" : "input");
  const [weight, setWeight] = useState("");
  const [trend, setTrend] = useState<WeightTrend | null>(null);
  const [decision, setDecision] = useState<AdjustmentDecision | null>(null);
  const [editCalories, setEditCalories] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Already checked in — show read-only summary
  if (alreadyCheckedIn) {
    const thisWeekStart = (weekNumber - 1) * 7 + 1;
    const thisWeekEnd = weekNumber * 7;
    const thisWeekCheckin = pastCheckins.find(
      (c) => c.day_index >= thisWeekStart && c.day_index <= thisWeekEnd
    );

    return (
      <div className="max-w-[520px] mx-auto">
        <div className="bg-card border border-hair rounded-[10px] p-8 shadow-[var(--shadow-md)]">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
            WEEK {weekNumber} · COMPLETED
          </span>
          <h2 className="font-[var(--font-display)] text-[32px] leading-[1.1] mt-3">
            Check-in recorded.
          </h2>
          {thisWeekCheckin && (
            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-[var(--font-tactical)] text-[38px] font-semibold tabular-nums">
                {thisWeekCheckin.weight_kg.toFixed(1)}
              </span>
              <span className="font-[var(--font-tactical)] text-[14px] text-ink-3">kg</span>
            </div>
          )}
          <p className="text-[14px] text-ink-3 mt-4 font-[var(--font-display)] italic">
            Come back next week for your next check-in.
          </p>
          <a
            href="/today"
            className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-ink text-bone rounded-[8px] font-[var(--font-ui)] text-[13px] font-semibold hover:bg-ink-2 transition-colors no-underline"
          >
            Back to today &rarr;
          </a>
        </div>
      </div>
    );
  }

  async function handleSubmitWeight() {
    const kg = parseFloat(weight);
    if (isNaN(kg) || kg <= 0) {
      setError("Enter a valid weight.");
      return;
    }
    setError(null);
    try {
      const result = await submitWeighIn({
        runId,
        weightKg: kg,
        dayIndex: currentDay,
      });
      setTrend(result.trend);
      setDecision(result.decision);
      setEditCalories(result.decision.suggestedCalories);
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  async function handleAccept() {
    if (!decision) return;
    const calories = isEditing && editCalories ? editCalories : decision.suggestedCalories;
    try {
      const result = await confirmAdjustment({
        runId,
        newCalorieTarget: calories,
        reasoning: decision.reasoning,
        rule: decision.rule,
      });
      setNewLevel(result.newLevel);
      setStep("confirmed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  function handleSkip() {
    startTransition(() => {
      router.push("/today");
    });
  }

  // ─── Step 1: Weight Input ───
  if (step === "input") {
    return (
      <div className="max-w-[520px] mx-auto">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          WEEKLY CHECK-IN · WEEK {weekNumber}
        </span>
        <h1 className="font-[var(--font-display)] text-[42px] leading-[1.05] tracking-[-0.018em] mt-3">
          Step on the scale.
        </h1>
        <p className="font-[var(--font-display)] italic text-[16px] text-ink-3 mt-2">
          One number. The system handles the rest.
        </p>

        {/* Weight input */}
        <div className="mt-8 relative">
          <input
            type="number"
            step="0.1"
            min="30"
            max="300"
            placeholder="0.0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-bone border border-hair-2 rounded-[10px] px-6 py-5 font-[var(--font-tactical)] text-[48px] font-semibold tabular-nums text-ink text-center placeholder:text-ink-4 focus:outline-none focus:ring-2 focus:ring-ember focus:border-transparent"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-[var(--font-tactical)] text-[18px] text-ink-3">
            kg
          </span>
        </div>

        {error && <p className="text-ember-d text-[13px] mt-2 font-medium">{error}</p>}

        <button
          onClick={handleSubmitWeight}
          disabled={isPending || !weight}
          className="mt-6 w-full h-12 bg-ember text-white rounded-[8px] font-[var(--font-ui)] text-[14px] font-semibold hover:bg-ember-d transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Recording..." : "Record weight \u2192"}
        </button>

        {/* Past weigh-ins */}
        {pastCheckins.length > 0 && (
          <div className="mt-8">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
              PAST WEIGH-INS
            </span>
            <div className="mt-3 space-y-0">
              {[...pastCheckins]
                .reverse()
                .slice(0, 8)
                .map((c, i, arr) => {
                  const prev = i < arr.length - 1 ? arr[i + 1] : null;
                  const change = prev ? c.weight_kg - prev.weight_kg : 0;
                  return (
                    <div
                      key={c.day_index}
                      className="flex items-center justify-between py-2.5 border-b border-hair-2 last:border-b-0"
                    >
                      <span className="font-[var(--font-tactical)] text-[11px] text-ink-3 tracking-[0.04em]">
                        DAY {c.day_index}
                      </span>
                      <span className="font-[var(--font-tactical)] text-[13px] font-semibold tabular-nums">
                        {c.weight_kg.toFixed(1)} kg
                      </span>
                      <span
                        className={`font-[var(--font-tactical)] text-[11px] tabular-nums w-16 text-right ${
                          change > 0 ? "text-ember-d" : change < 0 ? "text-moss" : "text-ink-4"
                        }`}
                      >
                        {change === 0 ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(1)}`}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Step 2: Results ───
  if (step === "results" && trend && decision) {
    const noChange = !decision.shouldAdjust;

    return (
      <div className="max-w-[520px] mx-auto">
        {/* Trend summary */}
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          WEEK {weekNumber} · RESULTS
        </span>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-[var(--font-tactical)] text-[42px] font-semibold tabular-nums">
            {trend.currentWeight.toFixed(1)}
          </span>
          <span className="font-[var(--font-tactical)] text-[16px] text-ink-3">kg</span>
          <span
            className={`font-[var(--font-tactical)] text-[14px] font-medium tabular-nums ml-2 ${
              trend.changeKg > 0 ? "text-ember-d" : trend.changeKg < 0 ? "text-moss" : "text-ink-4"
            }`}
          >
            {trend.changeKg === 0
              ? "no change"
              : `${trend.changeKg > 0 ? "+" : ""}${trend.changeKg.toFixed(1)} kg`}
          </span>
        </div>

        {/* Decision card */}
        {noChange ? (
          <div className="mt-6 bg-[#eef3ef] border border-[#c3d4c5] rounded-[10px] p-6">
            <h2 className="font-[var(--font-display)] text-[28px] leading-[1.1] text-moss">
              On track. No change.
            </h2>
            <p className="font-[var(--font-display)] italic text-[14px] text-ink-3 mt-2">
              {decision.reasoning}
            </p>
            <a
              href="/today"
              className="mt-5 inline-flex items-center justify-center h-11 px-6 bg-moss text-white rounded-[8px] font-[var(--font-ui)] text-[13px] font-semibold hover:opacity-90 transition-colors no-underline"
            >
              Continue &rarr;
            </a>
          </div>
        ) : (
          <div className="mt-6 bg-ink rounded-[10px] p-6 text-bone">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
              SUGGESTED ADJUSTMENT
            </span>

            <div className="mt-4 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <span className="font-[var(--font-tactical)] text-[10px] text-ember-l tracking-[0.04em]">
                  NEW TARGET
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editCalories ?? decision.suggestedCalories}
                    onChange={(e) => setEditCalories(parseInt(e.target.value) || 0)}
                    className="w-40 bg-ink-2 border border-ink-3 rounded-[6px] px-3 py-1 font-[var(--font-tactical)] text-[42px] font-semibold tabular-nums text-bone text-center mt-1 focus:outline-none focus:ring-2 focus:ring-ember"
                  />
                ) : (
                  <span className="font-[var(--font-tactical)] text-[42px] font-semibold tabular-nums text-ember-l mt-1">
                    {editCalories ?? decision.suggestedCalories}
                  </span>
                )}
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-4 mt-0.5">
                  kcal / day
                </span>
              </div>
            </div>

            <p className="font-[var(--font-display)] italic text-[14px] text-[#c5bfb5] mt-4 leading-relaxed">
              {decision.reasoning}
            </p>

            {error && <p className="text-ember-l text-[13px] mt-2 font-medium">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAccept}
                disabled={isPending}
                className="flex-1 h-11 bg-ember text-white rounded-[8px] font-[var(--font-ui)] text-[13px] font-semibold hover:bg-ember-d transition-colors disabled:opacity-50"
              >
                {isPending ? "Applying..." : "Accept"}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="h-11 px-5 bg-ink-2 text-bone border border-ink-3 rounded-[8px] font-[var(--font-ui)] text-[13px] font-semibold hover:bg-ink-3 transition-colors"
              >
                {isEditing ? "Done" : "Edit"}
              </button>
              <button
                onClick={handleSkip}
                className="h-11 px-5 text-ink-4 rounded-[8px] font-[var(--font-ui)] text-[13px] font-medium hover:text-bone transition-colors"
              >
                Skip this week
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Step 3: Confirmed ───
  if (step === "confirmed" && newLevel !== null) {
    return (
      <div className="max-w-[520px] mx-auto text-center">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
          LEVEL UP
        </span>
        <h1 className="font-[var(--font-display)] text-[64px] leading-[1] tracking-[-0.02em] mt-4">
          Level {String(newLevel).padStart(2, "0")}
        </h1>
        <p className="font-[var(--font-display)] italic text-[16px] text-ink-3 mt-3">
          {decision?.reasoning ?? "Calories adjusted. New level unlocked."}
        </p>
        <a
          href="/today"
          className="mt-8 inline-flex items-center justify-center h-12 px-8 bg-ember text-white rounded-[8px] font-[var(--font-ui)] text-[14px] font-semibold hover:bg-ember-d transition-colors no-underline"
        >
          Continue &rarr;
        </a>
      </div>
    );
  }

  return null;
}
