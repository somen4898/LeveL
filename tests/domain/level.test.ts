import { describe, it, expect } from "vitest";
import {
  shouldLevelUp,
  applyDayResultToLevelStreak,
  nextLevelNumber,
  getEffectKindForLevel,
} from "@/lib/domain/level";

describe("shouldLevelUp", () => {
  it("returns true when streak reaches 3", () => {
    expect(shouldLevelUp({ current_level: 5, level_streak: 2 }, true)).toBe(true);
  });

  it("returns false when streak is only 1 after increment", () => {
    expect(shouldLevelUp({ current_level: 5, level_streak: 0 }, true)).toBe(false);
  });

  it("returns false when day failed", () => {
    expect(shouldLevelUp({ current_level: 5, level_streak: 2 }, false)).toBe(false);
  });

  it("returns false at max level 30", () => {
    expect(shouldLevelUp({ current_level: 30, level_streak: 2 }, true)).toBe(false);
  });

  it("returns false at level 1 with streak 1", () => {
    expect(shouldLevelUp({ current_level: 1, level_streak: 1 }, true)).toBe(false);
  });
});

describe("applyDayResultToLevelStreak", () => {
  it("resets to 0 on failed day", () => {
    expect(applyDayResultToLevelStreak({ current_level: 5, level_streak: 2 }, false)).toBe(0);
  });

  it("increments on qualified day", () => {
    expect(applyDayResultToLevelStreak({ current_level: 5, level_streak: 1 }, true)).toBe(2);
  });

  it("caps at 3", () => {
    expect(applyDayResultToLevelStreak({ current_level: 5, level_streak: 2 }, true)).toBe(3);
  });
});

describe("nextLevelNumber", () => {
  it("returns next level", () => {
    expect(nextLevelNumber(7)).toBe(8);
  });

  it("returns null at max level", () => {
    expect(nextLevelNumber(30)).toBeNull();
  });
});

describe("getEffectKindForLevel", () => {
  it("odd levels tighten", () => {
    expect(getEffectKindForLevel(1)).toBe("TIGHTEN");
    expect(getEffectKindForLevel(3)).toBe("TIGHTEN");
    expect(getEffectKindForLevel(29)).toBe("TIGHTEN");
  });

  it("even levels unlock", () => {
    expect(getEffectKindForLevel(2)).toBe("UNLOCK");
    expect(getEffectKindForLevel(4)).toBe("UNLOCK");
    expect(getEffectKindForLevel(30)).toBe("UNLOCK");
  });
});
