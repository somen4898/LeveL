// Level system — pure logic for level-up triggers and effect application.

export interface Run {
  current_level: number;
  level_streak: number;
}

export function shouldLevelUp(run: Run, latestDayQualified: boolean): boolean {
  if (run.current_level >= 30) return false;
  const newStreak = latestDayQualified ? run.level_streak + 1 : 0;
  return newStreak >= 3;
}

export function applyDayResultToLevelStreak(
  run: Run,
  qualified: boolean
): number {
  if (!qualified) return 0; // failed day resets streak
  return Math.min(run.level_streak + 1, 3); // cap at 3 (becomes 0 on level-up)
}

export function nextLevelNumber(currentLevel: number): number | null {
  if (currentLevel >= 30) return null;
  return currentLevel + 1;
}

export type EffectKind = "TIGHTEN" | "UNLOCK";

export interface LevelCatalogueEntry {
  level_number: number;
  effect_kind: EffectKind;
  description: string;
  target_subtask_id: string | null;
  delta_numeric: number | null;
  new_optional_label: string | null;
  new_optional_measurement: string | null;
  new_optional_target_numeric: number | null;
  new_optional_unit: string | null;
}

export function getEffectKindForLevel(level: number): EffectKind {
  return level % 2 === 1 ? "TIGHTEN" : "UNLOCK";
}
