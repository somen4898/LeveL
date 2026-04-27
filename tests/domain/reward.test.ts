import { describe, it, expect } from "vitest";
import { canClaim } from "@/lib/domain/reward";

describe("canClaim", () => {
  it("allows claim when all conditions met", () => {
    expect(
      canClaim({
        rewardStatus: "claimable",
        scheduledDay: 15,
        currentDayIndex: 15,
        qualifyingDaysInWindow: 15,
        runStatus: "active",
      })
    ).toEqual({ ok: true });
  });

  it("rejects when run not active", () => {
    const result = canClaim({
      rewardStatus: "claimable",
      scheduledDay: 15,
      currentDayIndex: 15,
      qualifyingDaysInWindow: 15,
      runStatus: "archived",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("Run not active");
  });

  it("rejects when already claimed", () => {
    const result = canClaim({
      rewardStatus: "claimed",
      scheduledDay: 15,
      currentDayIndex: 15,
      qualifyingDaysInWindow: 15,
      runStatus: "active",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("Already claimed");
  });

  it("rejects before scheduled day", () => {
    const result = canClaim({
      rewardStatus: "qualifying",
      scheduledDay: 30,
      currentDayIndex: 25,
      qualifyingDaysInWindow: 15,
      runStatus: "active",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("Reward day not yet reached");
  });

  it("rejects with insufficient qualifying days", () => {
    const result = canClaim({
      rewardStatus: "qualifying",
      scheduledDay: 30,
      currentDayIndex: 30,
      qualifyingDaysInWindow: 10,
      runStatus: "active",
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("Window incomplete");
  });
});
