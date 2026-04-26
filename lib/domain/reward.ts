// Reward claim eligibility — pure logic.

export interface RewardClaimInput {
  rewardStatus: "locked" | "qualifying" | "claimable" | "claimed";
  scheduledDay: number;
  currentDayIndex: number;
  qualifyingDaysInWindow: number;
  runStatus: "onboarding" | "active" | "archived";
}

export interface ClaimResult {
  ok: boolean;
  reason?: string;
}

export function canClaim(input: RewardClaimInput): ClaimResult {
  if (input.runStatus !== "active") {
    return { ok: false, reason: "Run not active" };
  }
  if (input.rewardStatus === "claimed") {
    return { ok: false, reason: "Already claimed" };
  }
  if (input.currentDayIndex < input.scheduledDay) {
    return { ok: false, reason: "Reward day not yet reached" };
  }
  if (input.qualifyingDaysInWindow < 15) {
    return { ok: false, reason: "Window incomplete" };
  }
  return { ok: true };
}
