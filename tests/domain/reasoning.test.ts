import { describe, it, expect } from "vitest";
import {
  computeLockedInState,
  updateSkipCount,
  canSkipOptional,
  isReasonValid,
  MIN_REASON_LENGTH,
} from "@/lib/domain/reasoning";

describe("computeLockedInState", () => {
  it("returns false when skip count is below 3", () => {
    expect(computeLockedInState({ id: "1", consecutive_skip_count: 0 })).toBe(false);
    expect(computeLockedInState({ id: "1", consecutive_skip_count: 2 })).toBe(false);
  });

  it("returns true when skip count is 3 or more", () => {
    expect(computeLockedInState({ id: "1", consecutive_skip_count: 3 })).toBe(true);
    expect(computeLockedInState({ id: "1", consecutive_skip_count: 5 })).toBe(true);
  });
});

describe("updateSkipCount", () => {
  it("resets to 0 when completed", () => {
    expect(updateSkipCount(2, true)).toBe(0);
    expect(updateSkipCount(3, true)).toBe(0);
  });

  it("increments when skipped", () => {
    expect(updateSkipCount(0, false)).toBe(1);
    expect(updateSkipCount(1, false)).toBe(2);
    expect(updateSkipCount(2, false)).toBe(3);
  });

  it("caps at 3", () => {
    expect(updateSkipCount(3, false)).toBe(3);
  });
});

describe("canSkipOptional", () => {
  it("allows skip when not locked in", () => {
    expect(canSkipOptional({ id: "1", consecutive_skip_count: 0 })).toBe(true);
    expect(canSkipOptional({ id: "1", consecutive_skip_count: 2 })).toBe(true);
  });

  it("blocks skip when locked in", () => {
    expect(canSkipOptional({ id: "1", consecutive_skip_count: 3 })).toBe(false);
  });
});

describe("isReasonValid", () => {
  it("requires minimum length", () => {
    expect(isReasonValid("short")).toBe(false);
    expect(isReasonValid("a".repeat(49))).toBe(false);
    expect(isReasonValid("a".repeat(50))).toBe(true);
    expect(isReasonValid("a".repeat(200))).toBe(true);
  });

  it("MIN_REASON_LENGTH is 50", () => {
    expect(MIN_REASON_LENGTH).toBe(50);
  });
});
