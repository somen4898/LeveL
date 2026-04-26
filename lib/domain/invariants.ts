// Invariant checks — assertions that must never fail.
// Each maps to an invariant from TRD §6.

export class InvariantViolation extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(`[${code}] ${message}`);
    this.name = "InvariantViolation";
  }
}

// I1: A user cannot have more than one active run at a time.
export function assertSingleActiveRun(activeRunCount: number): void {
  if (activeRunCount > 1) {
    throw new InvariantViolation("I1", "Multiple active runs detected");
  }
}

// I5: Reasoning text length >= 50 characters.
export function assertReasonLength(text: string): void {
  if (text.length < 50) {
    throw new InvariantViolation(
      "I5",
      `Reason text is ${text.length} chars, minimum is 50`
    );
  }
}

// I6: A reward cannot be claimed before its scheduled day.
export function assertRewardDayReached(
  currentDay: number,
  scheduledDay: number
): void {
  if (currentDay < scheduledDay) {
    throw new InvariantViolation(
      "I6",
      `Day ${currentDay} < scheduled day ${scheduledDay}`
    );
  }
}

// I7: A reward cannot be claimed without 15 qualifying days in its window.
export function assertWindowComplete(qualifyingDays: number): void {
  if (qualifyingDays < 15) {
    throw new InvariantViolation(
      "I7",
      `Only ${qualifyingDays} qualifying days, need 15`
    );
  }
}

// I9: Levels are permanent. Cannot decrement.
export function assertLevelNonDecrement(
  currentLevel: number,
  newLevel: number
): void {
  if (newLevel < currentLevel) {
    throw new InvariantViolation(
      "I9",
      `Cannot decrement level from ${currentLevel} to ${newLevel}`
    );
  }
}

// I10: Daily logs cannot be modified after closed.
export function assertLogNotClosed(closedAt: string | null): void {
  if (closedAt !== null) {
    throw new InvariantViolation("I10", "Daily log is already closed");
  }
}

// I11: A locked-in optional cannot be skipped.
export function assertNotLockedIn(isLockedInToday: boolean): void {
  if (isLockedInToday) {
    throw new InvariantViolation(
      "I11",
      "Cannot skip a locked-in optional"
    );
  }
}

// I14: qualifying days never exceed day_index.
export function assertQualifyingDaysWithinBounds(
  qualifyingDays: number,
  dayIndex: number
): void {
  if (qualifyingDays > dayIndex) {
    throw new InvariantViolation(
      "I14",
      `${qualifyingDays} qualifying days exceeds day index ${dayIndex}`
    );
  }
}
