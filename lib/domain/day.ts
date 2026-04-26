// Day qualification — pure function, no I/O.

export interface Subtask {
  id: string;
  core_id: string;
  label: string;
  measurement: "binary" | "numeric";
  target_numeric: number | null;
  active_from_level: number;
  active_until_level: number | null;
}

export interface Core {
  id: string;
  kind: "eating" | "gym" | "coding";
  subtasks: Subtask[];
}

export interface Optional {
  id: string;
  label: string;
  consecutive_skip_count: number;
  is_locked_in_today: boolean;
}

export interface TaskCompletion {
  subtask_id: string | null;
  optional_id: string | null;
  completed: boolean;
}

export interface ReasoningEntry {
  optional_id: string;
  reason_text: string;
}

export interface DayQualificationInput {
  scheduledCores: Core[];
  subtaskCompletions: TaskCompletion[];
  optionalCompletions: TaskCompletion[];
  optionals: Optional[];
  reasoningEntries: ReasoningEntry[];
  lockedInOptionals: Optional[];
  currentLevel: number;
}

export interface DayQualificationResult {
  status: "in_progress" | "qualified" | "failed";
  reasons: string[];
  coresCompleteCount: number;
  coresRequiredCount: number;
}

export function isSubtaskActiveAtLevel(
  subtask: Subtask,
  currentLevel: number
): boolean {
  if (subtask.active_from_level > currentLevel) return false;
  if (
    subtask.active_until_level !== null &&
    subtask.active_until_level < currentLevel
  )
    return false;
  return true;
}

export function evaluateDay(
  input: DayQualificationInput,
  closing: boolean
): DayQualificationResult {
  const reasons: string[] = [];
  const required = input.scheduledCores.length;

  // Check 1: each scheduled core's active subtasks complete
  let coresComplete = 0;
  for (const core of input.scheduledCores) {
    const activeSubtasks = core.subtasks.filter((st) =>
      isSubtaskActiveAtLevel(st, input.currentLevel)
    );
    const allDone = activeSubtasks.every((st) =>
      input.subtaskCompletions.some(
        (c) => c.subtask_id === st.id && c.completed
      )
    );
    if (allDone) coresComplete++;
    else reasons.push(`Core ${core.kind} incomplete`);
  }

  // Check 2: locked-in optionals must be done
  for (const opt of input.lockedInOptionals) {
    const done = input.optionalCompletions.some(
      (c) => c.optional_id === opt.id && c.completed
    );
    if (!done) reasons.push(`Locked-in optional '${opt.label}' missed`);
  }

  // Check 3: skipped optionals must have valid reasoning
  for (const opt of input.optionals) {
    // Skip locked-in — already checked above
    if (opt.is_locked_in_today) continue;

    const completion = input.optionalCompletions.find(
      (c) => c.optional_id === opt.id
    );
    const isDone = completion?.completed === true;
    if (isDone) continue;

    const reason = input.reasoningEntries.find(
      (r) => r.optional_id === opt.id
    );
    if (!reason || reason.reason_text.length < 50) {
      reasons.push(`Optional '${opt.label}' skipped without reason`);
    }
  }

  let status: DayQualificationResult["status"];
  if (closing) {
    status = reasons.length === 0 ? "qualified" : "failed";
  } else {
    status = "in_progress";
  }

  return {
    status,
    reasons,
    coresCompleteCount: coresComplete,
    coresRequiredCount: required,
  };
}
