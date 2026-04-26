import { describe, it, expect } from "vitest";
import { evaluateDay, isSubtaskActiveAtLevel } from "@/lib/domain/day";
import type { DayQualificationInput, Core, Optional, TaskCompletion, ReasoningEntry, Subtask } from "@/lib/domain/day";

function makeSubtask(overrides: Partial<Subtask> = {}): Subtask {
  return {
    id: "st-1",
    core_id: "core-1",
    label: "Test subtask",
    measurement: "binary",
    target_numeric: null,
    active_from_level: 1,
    active_until_level: null,
    ...overrides,
  };
}

function makeCore(overrides: Partial<Core> & { subtasks?: Subtask[] } = {}): Core {
  return {
    id: "core-1",
    kind: "gym",
    subtasks: [makeSubtask()],
    ...overrides,
  };
}

function makeOptional(overrides: Partial<Optional> = {}): Optional {
  return {
    id: "opt-1",
    label: "Water 3L",
    consecutive_skip_count: 0,
    is_locked_in_today: false,
    ...overrides,
  };
}

describe("isSubtaskActiveAtLevel", () => {
  it("returns true when level is within range", () => {
    expect(isSubtaskActiveAtLevel(makeSubtask({ active_from_level: 1 }), 5)).toBe(true);
  });

  it("returns false when level is below active_from_level", () => {
    expect(isSubtaskActiveAtLevel(makeSubtask({ active_from_level: 3 }), 2)).toBe(false);
  });

  it("returns false when level exceeds active_until_level", () => {
    expect(isSubtaskActiveAtLevel(makeSubtask({ active_until_level: 5 }), 6)).toBe(false);
  });

  it("returns true when active_until_level is null", () => {
    expect(isSubtaskActiveAtLevel(makeSubtask({ active_until_level: null }), 30)).toBe(true);
  });
});

describe("evaluateDay", () => {
  it("qualifies when all cores done, no optionals", () => {
    const input: DayQualificationInput = {
      scheduledCores: [makeCore()],
      subtaskCompletions: [{ subtask_id: "st-1", optional_id: null, completed: true }],
      optionalCompletions: [],
      optionals: [],
      reasoningEntries: [],
      lockedInOptionals: [],
      currentLevel: 1,
    };
    const result = evaluateDay(input, true);
    expect(result.status).toBe("qualified");
    expect(result.coresCompleteCount).toBe(1);
    expect(result.reasons).toEqual([]);
  });

  it("fails when core subtask not done", () => {
    const input: DayQualificationInput = {
      scheduledCores: [makeCore()],
      subtaskCompletions: [],
      optionalCompletions: [],
      optionals: [],
      reasoningEntries: [],
      lockedInOptionals: [],
      currentLevel: 1,
    };
    const result = evaluateDay(input, true);
    expect(result.status).toBe("failed");
    expect(result.reasons).toContain("Core gym incomplete");
  });

  it("fails when locked-in optional is missed", () => {
    const lockedOpt = makeOptional({ id: "opt-locked", is_locked_in_today: true, consecutive_skip_count: 3 });
    const input: DayQualificationInput = {
      scheduledCores: [makeCore()],
      subtaskCompletions: [{ subtask_id: "st-1", optional_id: null, completed: true }],
      optionalCompletions: [],
      optionals: [lockedOpt],
      reasoningEntries: [],
      lockedInOptionals: [lockedOpt],
      currentLevel: 1,
    };
    const result = evaluateDay(input, true);
    expect(result.status).toBe("failed");
    expect(result.reasons[0]).toContain("Locked-in optional");
  });

  it("fails when optional skipped without reason", () => {
    const opt = makeOptional();
    const input: DayQualificationInput = {
      scheduledCores: [makeCore()],
      subtaskCompletions: [{ subtask_id: "st-1", optional_id: null, completed: true }],
      optionalCompletions: [],
      optionals: [opt],
      reasoningEntries: [],
      lockedInOptionals: [],
      currentLevel: 1,
    };
    const result = evaluateDay(input, true);
    expect(result.status).toBe("failed");
    expect(result.reasons[0]).toContain("skipped without reason");
  });

  it("qualifies when optional skipped with valid reason", () => {
    const opt = makeOptional();
    const input: DayQualificationInput = {
      scheduledCores: [makeCore()],
      subtaskCompletions: [{ subtask_id: "st-1", optional_id: null, completed: true }],
      optionalCompletions: [],
      optionals: [opt],
      reasoningEntries: [{ optional_id: "opt-1", reason_text: "A".repeat(50) }],
      lockedInOptionals: [],
      currentLevel: 1,
    };
    const result = evaluateDay(input, true);
    expect(result.status).toBe("qualified");
  });

  it("returns in_progress when not closing", () => {
    const input: DayQualificationInput = {
      scheduledCores: [makeCore()],
      subtaskCompletions: [],
      optionalCompletions: [],
      optionals: [],
      reasoningEntries: [],
      lockedInOptionals: [],
      currentLevel: 1,
    };
    const result = evaluateDay(input, false);
    expect(result.status).toBe("in_progress");
  });

  it("handles multiple cores with mixed results", () => {
    const core1 = makeCore({ id: "c1", kind: "gym", subtasks: [makeSubtask({ id: "s1", core_id: "c1" })] });
    const core2 = makeCore({ id: "c2", kind: "eating", subtasks: [makeSubtask({ id: "s2", core_id: "c2" })] });
    const core3 = makeCore({ id: "c3", kind: "coding", subtasks: [makeSubtask({ id: "s3", core_id: "c3" })] });
    const input: DayQualificationInput = {
      scheduledCores: [core1, core2, core3],
      subtaskCompletions: [
        { subtask_id: "s1", optional_id: null, completed: true },
        { subtask_id: "s2", optional_id: null, completed: true },
      ],
      optionalCompletions: [],
      optionals: [],
      reasoningEntries: [],
      lockedInOptionals: [],
      currentLevel: 1,
    };
    const result = evaluateDay(input, true);
    expect(result.coresCompleteCount).toBe(2);
    expect(result.coresRequiredCount).toBe(3);
    expect(result.status).toBe("failed");
  });
});
