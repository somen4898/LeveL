"use client";

import { useState, useOptimistic, useTransition } from "react";
import { CoreCard } from "./core-card";
import { OptionalRow } from "./optional-row";
import { RewardWindowStrip } from "./reward-window-strip";
import { SkipReasonModal } from "@/components/modals/skip-reason-modal";
import { DayStatusPill } from "./day-status-pill";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getActiveRewardWindow } from "@/lib/domain/chain";
import { romanNumeral, padTwo } from "@/lib/utils/format";

interface Props {
  cores: { id: string; kind: string; schedule_days: number[] }[];
  scheduledCores: { id: string; kind: string; schedule_days: number[] }[];
  subtasks: { id: string; core_id: string; label: string; measurement: string; target_numeric: number | null; unit: string | null; active_from_level: number; active_until_level: number | null }[];
  completions: { id: string; subtask_id: string | null; optional_id: string | null; completed: boolean }[];
  optionals: { id: string; label: string; consecutive_skip_count: number; is_locked_in_today: boolean }[];
  reasoningEntries: { id: string; optional_id: string; reason_text: string }[];
  rewards: { id: string; scheduled_day: number; tier: string; name: string; status: string }[];
  dailyLogId: string;
  currentDay: number;
  currentLevel: number;
  levelStreak: number;
  qualifyingDays: number;
  endDate: string;
  userId: string;
}

export function TodayContent({
  cores,
  scheduledCores,
  subtasks,
  completions,
  optionals,
  reasoningEntries,
  rewards,
  dailyLogId,
  currentDay,
  currentLevel,
  levelStreak,
  qualifyingDays,
  endDate,
  userId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [skipModal, setSkipModal] = useState<{ optionalId: string; label: string } | null>(null);

  const coresComplete = scheduledCores.filter((core) => {
    const coreSubs = subtasks.filter(
      (s) =>
        s.core_id === core.id &&
        s.active_from_level <= currentLevel &&
        (s.active_until_level === null || s.active_until_level >= currentLevel)
    );
    return coreSubs.every((s) =>
      completions.some((c) => c.subtask_id === s.id && c.completed)
    );
  }).length;

  async function toggleSubtask(subtaskId: string, completed: boolean) {
    const supabase = createClient();
    // Upsert completion
    const existing = completions.find((c) => c.subtask_id === subtaskId);
    if (existing) {
      await supabase
        .from("task_completions")
        .update({ completed })
        .eq("id", existing.id);
    } else {
      await supabase.from("task_completions").insert({
        daily_log_id: dailyLogId,
        user_id: userId,
        task_kind: "subtask",
        subtask_id: subtaskId,
        completed,
      });
    }
    startTransition(() => router.refresh());
  }

  async function markOptionalDone(optionalId: string) {
    const supabase = createClient();
    const existing = completions.find((c) => c.optional_id === optionalId);
    if (existing) {
      await supabase
        .from("task_completions")
        .update({ completed: true })
        .eq("id", existing.id);
    } else {
      await supabase.from("task_completions").insert({
        daily_log_id: dailyLogId,
        user_id: userId,
        task_kind: "optional",
        optional_id: optionalId,
        completed: true,
      });
    }
    startTransition(() => router.refresh());
  }

  // Chain cells for the current reward window
  const activeWindow = getActiveRewardWindow(currentDay);
  const windowDays = activeWindow
    ? Array.from({ length: 18 }, (_, i) => {
        const day = activeWindow.windowStart + i;
        if (day > activeWindow.windowEnd) return "f";
        if (day === currentDay) return "t";
        if (day < currentDay) {
          // Would need actual qualifying status per day, simplified for now
          return day <= qualifyingDays ? "q" : "m";
        }
        return "f";
      })
    : Array(18).fill("f");

  const nextReward = rewards.find(
    (r) => r.status !== "claimed" && r.scheduled_day >= currentDay
  );

  const daysLeft = 90 - currentDay + 1;
  const endDateFormatted = new Date(endDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  }).toUpperCase();

  // Compute hours left in day
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 0, 0);
  const hoursLeft = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60)));
  const minsLeft = Math.max(0, Math.floor(((endOfDay.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <>
      {/* Hero: today's contract status */}
      <div className="bg-card border border-hair rounded-[10px] p-7 shadow-[var(--shadow-md)]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
              Today&apos;s contract · {coresComplete} of {scheduledCores.length} complete
            </span>
            <h2 className="font-[var(--font-display)] text-[38px] leading-[1.05] tracking-[-0.018em] mt-2.5">
              {scheduledCores.length - coresComplete === 0 ? (
                "All cores closed."
              ) : (
                <>
                  {scheduledCores.length - coresComplete === 1 ? "One core" : `${scheduledCores.length - coresComplete} cores`} left.{" "}
                  <em className="italic text-ink-3">
                    The day qualifies when all {scheduledCores.length === 3 ? "three" : scheduledCores.length} close.
                  </em>
                </>
              )}
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              DAY ENDS IN
            </span>
            <span className="font-[var(--font-tactical)] text-[28px] font-semibold tabular-nums mt-0.5">
              {padTwo(hoursLeft)} : {padTwo(minsLeft)}
            </span>
          </div>
        </div>

        {/* Core cards grid */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {scheduledCores.map((core, i) => {
            const coreSubs = subtasks.filter(
              (s) =>
                s.core_id === core.id &&
                s.active_from_level <= currentLevel &&
                (s.active_until_level === null || s.active_until_level >= currentLevel)
            );
            const allDone = coreSubs.every((s) =>
              completions.some((c) => c.subtask_id === s.id && c.completed)
            );

            return (
              <CoreCard
                key={core.id}
                numeral={romanNumeral(i + 1)}
                name={core.kind.charAt(0).toUpperCase() + core.kind.slice(1)}
                target={core.kind === "body" ? "Structured lift · 45 min" : core.kind === "fuel" ? "Surplus + protein" : "LeetCode OR 60-min focus"}
                done={allDone}
                subtasks={coreSubs}
                completions={completions}
                onToggle={toggleSubtask}
              />
            );
          })}
        </div>
      </div>

      {/* Optionals + Chain */}
      <div className="mt-4 grid grid-cols-[1.05fr_1fr] gap-3.5">
        {/* Optionals */}
        <div className="bg-card border border-hair rounded-[10px] p-[22px_26px] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
              Optional · today
            </span>
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              SKIPS REQUIRE A 50-CHAR REASON
            </span>
          </div>
          <div className="mt-3.5">
            {optionals.length === 0 ? (
              <p className="text-[13px] text-ink-3 italic">
                No optionals unlocked yet. Level up to unlock your first.
              </p>
            ) : (
              optionals.map((opt, i) => {
                const done = completions.some(
                  (c) => c.optional_id === opt.id && c.completed
                );
                const hasReason = reasoningEntries.some(
                  (r) => r.optional_id === opt.id
                );

                return (
                  <OptionalRow
                    key={opt.id}
                    label={opt.label}
                    done={done}
                    streak={opt.consecutive_skip_count}
                    isLockedIn={opt.is_locked_in_today}
                    hasReason={hasReason}
                    isLast={i === optionals.length - 1}
                    onMarkDone={() => markOptionalDone(opt.id)}
                    onSkip={() => setSkipModal({ optionalId: opt.id, label: opt.label })}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Chain */}
        <div className="bg-card border border-hair rounded-[10px] p-[22px_26px] shadow-[var(--shadow-card)]">
          <RewardWindowStrip
            cells={windowDays as ("q" | "m" | "t" | "f")[]}
            label={activeWindow ? `Reward window · ${activeWindow.windowStart} → ${activeWindow.windowEnd}` : "No active window"}
            sub={activeWindow ? `${qualifyingDays} of 18 days · need 15 to claim` : ""}
          />
          <hr className="border-none h-px bg-hair-2 my-4" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                NEXT REWARD
              </span>
              <span className="text-[14px] font-semibold mt-[3px]">
                {nextReward ? `Day ${nextReward.scheduled_day} · ${nextReward.name}` : "All claimed"}
              </span>
            </div>
            <div className="flex-1" />
            {nextReward && (
              <div className="flex flex-col items-end">
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                  QUALIFIES IN
                </span>
                <span className="font-[var(--font-tactical)] text-[16px] font-semibold tabular-nums">
                  {Math.max(0, nextReward.scheduled_day - currentDay)} days
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {[
          { k: "QUALIFYING DAYS", v: String(qualifyingDays), sub: `OF ${currentDay} · ${currentDay > 0 ? Math.round((qualifyingDays / currentDay) * 100) : 0}%`, pct: currentDay > 0 ? (qualifyingDays / currentDay) * 100 : 0, color: "bg-ember" },
          { k: "CURRENT WINDOW", v: `${qualifyingDays}/15`, sub: `NEED ${Math.max(0, 15 - qualifyingDays)} MORE`, pct: Math.min(100, (qualifyingDays / 15) * 100), color: "bg-ink" },
          { k: "LEVEL", v: padTwo(currentLevel), sub: `${levelStreak} / 3 TO ${padTwo(currentLevel + 1)}`, pct: (levelStreak / 3) * 100, color: "bg-moss" },
          { k: "DAYS LEFT", v: String(daysLeft), sub: `RUN ENDS ${endDateFormatted}`, pct: null, color: null },
        ].map(({ k, v, sub, pct, color }, i) => (
          <div key={i} className="bg-bone border border-hair-2 rounded-[10px] p-5">
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              {k}
            </span>
            <div className="font-[var(--font-tactical)] text-[32px] font-semibold mt-1.5 tracking-[-0.02em] tabular-nums">
              {v}
            </div>
            <div className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-1">
              {sub}
            </div>
            {pct !== null && color && (
              <div className="h-1.5 bg-hair-2 rounded-full mt-3.5 relative overflow-hidden">
                <span
                  className={`absolute left-0 top-0 bottom-0 rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Skip Reason Modal */}
      {skipModal && (
        <SkipReasonModal
          optionalId={skipModal.optionalId}
          optionalLabel={skipModal.label}
          dailyLogId={dailyLogId}
          userId={userId}
          currentDay={currentDay}
          onClose={() => setSkipModal(null)}
          onSubmit={() => {
            setSkipModal(null);
            startTransition(() => router.refresh());
          }}
        />
      )}
    </>
  );
}
