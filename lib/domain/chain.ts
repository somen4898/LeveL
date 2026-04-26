// Chain mechanics — reward windows, qualifying day counts.

export interface RewardWindow {
  scheduledDay: number;
  windowStart: number;
  windowEnd: number;
  windowSize: number;
}

const REWARD_DAYS = [15, 30, 45, 60, 75, 90] as const;

export function getRewardWindows(): RewardWindow[] {
  return REWARD_DAYS.map((day) => {
    // First reward: window is Day 1 to Day 15 (15 days)
    // All others: 18 days ending on the reward day
    const windowSize = day === 15 ? 15 : 18;
    const windowStart = day - windowSize + 1;
    return {
      scheduledDay: day,
      windowStart,
      windowEnd: day,
      windowSize,
    };
  });
}

export function getWindowForDay(scheduledDay: number): RewardWindow {
  const windows = getRewardWindows();
  const w = windows.find((w) => w.scheduledDay === scheduledDay);
  if (!w) throw new Error(`No window for day ${scheduledDay}`);
  return w;
}

export function getCurrentRewardWindow(
  currentDayIndex: number
): RewardWindow | null {
  const windows = getRewardWindows();
  // Find the earliest window that hasn't ended yet
  return (
    windows.find(
      (w) =>
        currentDayIndex >= w.windowStart && currentDayIndex <= w.windowEnd
    ) ?? null
  );
}

export function getActiveRewardWindow(
  currentDayIndex: number
): RewardWindow | null {
  const windows = getRewardWindows();
  // Return the window the current day falls within, or next upcoming
  for (const w of windows) {
    if (currentDayIndex <= w.windowEnd) return w;
  }
  return null;
}

export type RewardStatus = "locked" | "qualifying" | "claimable" | "claimed";

export interface RewardStatusInput {
  scheduledDay: number;
  currentDayIndex: number;
  qualifyingDaysInWindow: number;
  alreadyClaimed: boolean;
}

export function computeRewardStatus(input: RewardStatusInput): RewardStatus {
  if (input.alreadyClaimed) return "claimed";

  const window = getWindowForDay(input.scheduledDay);

  if (input.currentDayIndex < window.windowStart) {
    return "locked";
  }

  if (
    input.currentDayIndex >= input.scheduledDay &&
    input.qualifyingDaysInWindow >= 15
  ) {
    return "claimable";
  }

  if (input.currentDayIndex >= window.windowStart) {
    return "qualifying";
  }

  return "locked";
}
