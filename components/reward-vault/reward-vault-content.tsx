"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getWindowForDay } from "@/lib/domain/chain";
import { ClaimRewardModal } from "@/components/modals/claim-reward-modal";

interface Reward {
  id: string;
  scheduled_day: number;
  tier: string;
  name: string;
  price_amount: number | null;
  price_currency: string | null;
  status: string;
  claimed_at: string | null;
  motivation_note: string | null;
}

interface Props {
  rewards: Reward[];
  currentDay: number;
  qualifiedDays: number[];
  runId: string;
  userId: string;
}

export function RewardVaultContent({ rewards, currentDay, qualifiedDays, runId, userId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [claimModal, setClaimModal] = useState<Reward | null>(null);

  function getQualifyingInWindow(scheduledDay: number): number {
    const w = getWindowForDay(scheduledDay);
    return qualifiedDays.filter(d => d >= w.windowStart && d <= w.windowEnd).length;
  }

  async function handleClaim(rewardId: string) {
    const supabase = createClient();
    await supabase
      .from("rewards")
      .update({ status: "claimed", claimed_at: new Date().toISOString() } as never)
      .eq("id", rewardId);
    setClaimModal(null);
    startTransition(() => router.refresh());
  }

  return (
    <>
      {/* 90-day rail */}
      <div className="bg-ink text-bone rounded-[10px] p-7">
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
          The 90-day rail
        </span>
        <div className="mt-6 relative h-[100px]">
          {/* Base rail */}
          <div className="absolute left-0 right-0 top-[50px] h-0.5 bg-[#3a342d]" />
          {/* Progress */}
          <div
            className="absolute left-0 top-[50px] h-0.5 bg-ember"
            style={{ width: `${(currentDay / 90) * 100}%` }}
          />
          {/* Now marker */}
          <div
            className="absolute top-[38px] flex flex-col items-center -translate-x-1/2"
            style={{ left: `${(currentDay / 90) * 100}%` }}
          >
            <span className="font-[var(--font-tactical)] text-[9px] text-ember-l tracking-[0.14em]">
              NOW · D{currentDay}
            </span>
            <div className="w-3.5 h-3.5 rounded-full bg-ember border-2 border-ink mt-1" />
          </div>
          {/* Reward markers */}
          {rewards.map((r) => {
            const pct = (r.scheduled_day / 90) * 100;
            const isClaimed = r.status === "claimed";
            const isQual = r.status === "qualifying" || (getQualifyingInWindow(r.scheduled_day) > 0 && !isClaimed);
            return (
              <div
                key={r.id}
                className="absolute top-[44px] flex flex-col items-center w-[60px] -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                <div
                  className={`rounded ${r.tier === "big" ? "w-[18px] h-[18px] rounded-[4px]" : "w-3 h-3 rounded-[3px]"} ${
                    isClaimed
                      ? "bg-ember border-[1.5px] border-ember"
                      : isQual
                        ? "bg-bone border-[1.5px] border-ember"
                        : "border-[1.5px] border-dashed border-ink-3"
                  }`}
                />
                <span className="font-[var(--font-tactical)] text-[9px] text-ink-4 tracking-[0.1em] mt-2">
                  D{r.scheduled_day}
                </span>
                <span className="font-[var(--font-tactical)] text-[9px] text-bone mt-0.5">
                  {r.tier.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward cards */}
      <div className="mt-5 grid grid-cols-3 gap-3.5">
        {rewards.map((r) => {
          const qualInWindow = getQualifyingInWindow(r.scheduled_day);
          const w = getWindowForDay(r.scheduled_day);
          const isQualifying = currentDay >= w.windowStart && currentDay <= w.windowEnd && r.status !== "claimed";
          const isClaimable = currentDay >= r.scheduled_day && qualInWindow >= 15 && r.status !== "claimed";

          return (
            <div
              key={r.id}
              className={`bg-card border rounded-[10px] overflow-hidden relative ${
                isQualifying
                  ? "border-ember shadow-[0_0_0_3px_#fbeadb]"
                  : "border-hair shadow-[var(--shadow-card)]"
              }`}
            >
              {/* Image placeholder */}
              <div className="h-[130px] bg-gradient-to-br from-paper-2 to-bone border-b border-hair-2 flex items-center justify-center text-ink-4 font-[var(--font-tactical)] text-[10px] tracking-[0.12em] uppercase">
                REWARD IMAGE · D{r.scheduled_day}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                    DAY {r.scheduled_day}
                  </span>
                  <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-hair rounded text-ink-3 font-semibold">
                    {r.tier.toUpperCase()}
                  </span>
                  <div className="flex-1" />
                  {r.status === "claimed" && (
                    <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-moss text-white rounded font-semibold">
                      CLAIMED
                    </span>
                  )}
                  {isQualifying && r.status !== "claimed" && (
                    <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ember text-white rounded font-semibold">
                      QUALIFYING
                    </span>
                  )}
                </div>
                <h3
                  className={`font-[var(--font-display)] text-[22px] leading-[1.15] mt-3 text-ink ${
                    r.tier === "big" ? "italic" : ""
                  }`}
                >
                  {r.name}
                </h3>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="font-[var(--font-tactical)] text-[13px] text-ink-2 tabular-nums">
                    {r.price_amount
                      ? `${r.price_currency ?? "₹"}${r.price_amount.toLocaleString()}`
                      : "—"}
                  </span>
                  <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                    UNLOCKS · DAY {r.scheduled_day}
                  </span>
                </div>

                {isQualifying && r.status !== "claimed" && (
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                        WINDOW · {qualInWindow} / 15 DAYS
                      </span>
                      <span className="font-[var(--font-tactical)] text-[11px] text-ember font-semibold">
                        {Math.max(0, 15 - qualInWindow)} to go
                      </span>
                    </div>
                    <div className="h-1.5 bg-hair-2 rounded-full relative overflow-hidden">
                      <span
                        className="absolute left-0 top-0 bottom-0 bg-ember rounded-full"
                        style={{ width: `${Math.min(100, (qualInWindow / 15) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {isClaimable && (
                  <button
                    onClick={() => setClaimModal(r)}
                    className="w-full mt-3.5 py-2.5 bg-ember text-white rounded-[7px] text-[13px] font-medium cursor-pointer shadow-[0_1px_0_#a04e1f,0_4px_12px_rgba(196,98,45,0.25)] hover:bg-ember-d transition-colors"
                  >
                    Claim reward →
                  </button>
                )}

                {r.status === "claimed" && r.claimed_at && (
                  <p className="font-[var(--font-ui)] text-[11.5px] text-ink-3 leading-[1.5] mt-3.5">
                    Claimed {new Date(r.claimed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.
                  </p>
                )}

                {r.status !== "claimed" && !isQualifying && (
                  <p className="font-[var(--font-ui)] text-[11.5px] text-ink-3 leading-[1.5] mt-3.5">
                    Window opens day {r.scheduled_day - 17}. Need 15 of 18 qualifying days.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contract reminder */}
      <div className="mt-5 bg-bone border border-hair-2 rounded-[10px] p-[18px_24px]">
        <div className="flex items-center gap-3.5">
          <span className="font-[var(--font-display)] text-[24px] italic text-ink-3">&ldquo;</span>
          <p className="font-[var(--font-display)] italic text-[17px] text-ink-2 leading-[1.4] flex-1">
            Rewards were chosen on Day 0 and locked at sign. They cannot be downgraded, swapped, or re-priced before Day 90.
          </p>
          <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] self-end">
            SIGNED · LOCKED
          </span>
        </div>
      </div>

      {claimModal && (
        <ClaimRewardModal
          reward={claimModal}
          onClose={() => setClaimModal(null)}
          onClaim={() => handleClaim(claimModal.id)}
        />
      )}
    </>
  );
}
