"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { evaluateDay } from "@/lib/domain/day";
import { shouldLevelUp, applyDayResultToLevelStreak } from "@/lib/domain/level";
import { updateSkipCount, computeLockedInState } from "@/lib/domain/reasoning";
import { revalidatePath } from "next/cache";

const InputSchema = z.object({
  runId: z.string().uuid(),
  logDate: z.string(),
});

export async function closeDay(rawInput: unknown) {
  const input = InputSchema.parse(rawInput);
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Fetch daily log
  const { data: log } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("run_id", input.runId)
    .eq("log_date", input.logDate)
    .single();

  const logData = log as { id: string; status: string; closed_at: string | null; day_index: number } | null;
  if (!logData) throw new Error("No daily log found");
  if (logData.closed_at) throw new Error("Day already closed");

  // Fetch run
  const { data: run } = await supabase
    .from("runs")
    .select("*")
    .eq("id", input.runId)
    .single();
  const runData = run as { id: string; current_level: number; level_streak: number } | null;
  if (!runData) throw new Error("Run not found");

  // Fetch scheduled cores for today
  const todayDow = new Date(input.logDate).getDay();
  const { data: allCores } = await supabase
    .from("cores")
    .select("*")
    .eq("run_id", input.runId);

  const coresArr = (allCores ?? []) as { id: string; kind: string; schedule_days: number[] }[];
  const scheduledCores = coresArr.filter(c => c.schedule_days.includes(todayDow));
  const coreIds = coresArr.map(c => c.id);

  // Fetch subtasks
  const { data: subtasks } = await supabase
    .from("subtasks")
    .select("*")
    .in("core_id", coreIds.length > 0 ? coreIds : ["none"]);

  // Fetch completions
  const { data: completions } = await supabase
    .from("task_completions")
    .select("*")
    .eq("daily_log_id", logData.id);

  // Fetch optionals
  const { data: optionals } = await supabase
    .from("optionals")
    .select("*")
    .eq("run_id", input.runId);

  // Fetch reasoning entries
  const { data: reasons } = await supabase
    .from("reasoning_entries")
    .select("*")
    .eq("daily_log_id", logData.id);

  const optionalsArr = (optionals ?? []) as { id: string; label: string; consecutive_skip_count: number; is_locked_in_today: boolean }[];
  const lockedIn = optionalsArr.filter(o => o.is_locked_in_today);

  // Build domain input
  const coresWithSubs = scheduledCores.map(c => ({
    id: c.id,
    kind: c.kind as "body" | "fuel" | "craft",
    subtasks: ((subtasks ?? []) as { id: string; core_id: string; label: string; measurement: "binary" | "numeric"; target_numeric: number | null; active_from_level: number; active_until_level: number | null }[])
      .filter(s => s.core_id === c.id),
  }));

  const result = evaluateDay({
    scheduledCores: coresWithSubs,
    subtaskCompletions: ((completions ?? []) as { subtask_id: string | null; optional_id: string | null; completed: boolean }[]),
    optionalCompletions: ((completions ?? []) as { subtask_id: string | null; optional_id: string | null; completed: boolean }[]),
    optionals: optionalsArr,
    reasoningEntries: ((reasons ?? []) as { optional_id: string; reason_text: string }[]),
    lockedInOptionals: lockedIn,
    currentLevel: runData.current_level,
  }, true);

  const qualified = result.status === "qualified";

  // Update daily log
  await supabase
    .from("daily_logs")
    .update({
      status: result.status,
      closed_at: new Date().toISOString(),
      cores_complete_count: result.coresCompleteCount,
      cores_required_count: result.coresRequiredCount,
    } as never)
    .eq("id", logData.id);

  // Update skip counts on optionals
  for (const opt of optionalsArr) {
    const done = ((completions ?? []) as { optional_id: string | null; completed: boolean }[])
      .some(c => c.optional_id === opt.id && c.completed);
    const newCount = updateSkipCount(opt.consecutive_skip_count, done);
    if (newCount !== opt.consecutive_skip_count) {
      await supabase
        .from("optionals")
        .update({ consecutive_skip_count: newCount } as never)
        .eq("id", opt.id);
    }
  }

  // Update level streak
  const newStreak = applyDayResultToLevelStreak(runData, qualified);
  const levelUp = shouldLevelUp(runData, qualified);

  if (levelUp) {
    const newLevel = runData.current_level + 1;
    await supabase
      .from("runs")
      .update({ current_level: newLevel, level_streak: 0 } as never)
      .eq("id", runData.id);

    // Apply level effect
    const { data: catalogue } = await supabase
      .from("level_catalogue")
      .select("*")
      .eq("run_id", input.runId)
      .eq("level_number", newLevel)
      .single();

    if (catalogue) {
      const catData = catalogue as { id: string; effect_kind: string; new_optional_label: string | null; new_optional_measurement: string | null; new_optional_target_numeric: number | null; new_optional_unit: string | null };

      await supabase.from("level_history").insert({
        run_id: input.runId,
        user_id: user.id,
        level_number: newLevel,
        catalogue_id: catData.id,
        achieved_on: input.logDate,
      });

      // If UNLOCK, create new optional
      if (catData.effect_kind === "UNLOCK" && catData.new_optional_label) {
        await supabase.from("optionals").insert({
          run_id: input.runId,
          user_id: user.id,
          label: catData.new_optional_label,
          measurement: (catData.new_optional_measurement ?? "binary") as "binary" | "numeric",
          target_numeric: catData.new_optional_target_numeric,
          unit: catData.new_optional_unit,
          unlocked_at_level: newLevel,
        });
      }
    }
  } else {
    await supabase
      .from("runs")
      .update({ level_streak: newStreak } as never)
      .eq("id", runData.id);
  }

  // Update locked-in state for tomorrow
  for (const opt of optionalsArr) {
    const done = ((completions ?? []) as { optional_id: string | null; completed: boolean }[])
      .some(c => c.optional_id === opt.id && c.completed);
    const newCount = updateSkipCount(opt.consecutive_skip_count, done);
    const shouldLock = computeLockedInState({ id: opt.id, consecutive_skip_count: newCount });
    if (shouldLock !== opt.is_locked_in_today) {
      await supabase
        .from("optionals")
        .update({ is_locked_in_today: shouldLock } as never)
        .eq("id", opt.id);
    }
  }

  revalidatePath("/today");
  revalidatePath("/levels");
  revalidatePath("/quest-log");

  return { status: result.status, levelUp, newLevel: levelUp ? runData.current_level + 1 : null };
}
