import { describe, it, expect } from "vitest";
import {
  getRewardWindows,
  getWindowForDay,
  computeRewardStatus,
  getCurrentRewardWindow,
} from "@/lib/domain/chain";

describe("getRewardWindows", () => {
  it("returns 6 windows", () => {
    const windows = getRewardWindows();
    expect(windows).toHaveLength(6);
  });

  it("first window is 15 days (1-15)", () => {
    const windows = getRewardWindows();
    expect(windows[0].windowStart).toBe(1);
    expect(windows[0].windowEnd).toBe(15);
    expect(windows[0].windowSize).toBe(15);
  });

  it("second window is 18 days ending on day 30", () => {
    const windows = getRewardWindows();
    expect(windows[1].windowStart).toBe(13);
    expect(windows[1].windowEnd).toBe(30);
    expect(windows[1].windowSize).toBe(18);
  });

  it("last window ends on day 90", () => {
    const windows = getRewardWindows();
    expect(windows[5].windowEnd).toBe(90);
    expect(windows[5].windowStart).toBe(73);
  });
});

describe("getWindowForDay", () => {
  it("throws for invalid day", () => {
    expect(() => getWindowForDay(20)).toThrow();
  });

  it("returns correct window for day 45", () => {
    const w = getWindowForDay(45);
    expect(w.windowStart).toBe(28);
    expect(w.windowEnd).toBe(45);
  });
});

describe("computeRewardStatus", () => {
  it("returns claimed if already claimed", () => {
    expect(
      computeRewardStatus({
        scheduledDay: 15,
        currentDayIndex: 20,
        qualifyingDaysInWindow: 15,
        alreadyClaimed: true,
      })
    ).toBe("claimed");
  });

  it("returns locked before window starts", () => {
    expect(
      computeRewardStatus({
        scheduledDay: 30,
        currentDayIndex: 5,
        qualifyingDaysInWindow: 0,
        alreadyClaimed: false,
      })
    ).toBe("locked");
  });

  it("returns qualifying during window", () => {
    expect(
      computeRewardStatus({
        scheduledDay: 30,
        currentDayIndex: 20,
        qualifyingDaysInWindow: 8,
        alreadyClaimed: false,
      })
    ).toBe("qualifying");
  });

  it("returns claimable when enough qualifying days and past scheduled day", () => {
    expect(
      computeRewardStatus({
        scheduledDay: 30,
        currentDayIndex: 30,
        qualifyingDaysInWindow: 15,
        alreadyClaimed: false,
      })
    ).toBe("claimable");
  });

  it("returns qualifying even with 15 days if before scheduled day", () => {
    expect(
      computeRewardStatus({
        scheduledDay: 30,
        currentDayIndex: 25,
        qualifyingDaysInWindow: 15,
        alreadyClaimed: false,
      })
    ).toBe("qualifying");
  });
});

describe("getCurrentRewardWindow", () => {
  it("returns first window on day 1", () => {
    const w = getCurrentRewardWindow(1);
    expect(w?.scheduledDay).toBe(15);
  });

  it("returns null after day 90", () => {
    const w = getCurrentRewardWindow(91);
    expect(w).toBeNull();
  });
});
