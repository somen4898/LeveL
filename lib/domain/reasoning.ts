// Reasoning & 3-skip lock — pure logic.

export interface OptionalForReasoning {
  id: string;
  consecutive_skip_count: number;
}

export function computeLockedInState(opt: OptionalForReasoning): boolean {
  return opt.consecutive_skip_count >= 3;
}

export function updateSkipCount(
  currentCount: number,
  completedToday: boolean
): number {
  if (completedToday) return 0;
  // Skipped with valid reason — increment, cap at 3
  return Math.min(currentCount + 1, 3);
}

export function canSkipOptional(opt: OptionalForReasoning): boolean {
  // Cannot skip if locked-in (3 consecutive skips)
  return !computeLockedInState(opt);
}

export const MIN_REASON_LENGTH = 50;

export function isReasonValid(text: string): boolean {
  return text.length >= MIN_REASON_LENGTH;
}
