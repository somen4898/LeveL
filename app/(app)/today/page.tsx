import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { TodayContent } from "@/components/today/today-content";
import { dayIndex } from "@/lib/utils/dates";
import { calculateExercisePlan, type Goal } from "@/lib/domain/calculator";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_run_id, timezone")
    .eq("id", user.id)
    .single();

  const runId = (profile as { active_run_id: string | null } | null)?.active_run_id;
  if (!runId) redirect("/onboarding");

  const { data: run } = await supabase.from("runs").select("*").eq("id", runId).single();

  const runData = run as {
    id: string;
    start_date: string;
    end_date: string;
    current_level: number;
    level_streak: number;
    goal: Goal | null;
  } | null;
  if (!runData?.start_date) redirect("/onboarding");

  const now = new Date();
  const currentDay = dayIndex(new Date(runData.start_date), now);
  const dayOfWeek = now.getDay();

  // Fetch cores with subtasks
  const { data: cores } = await supabase.from("cores").select("*").eq("run_id", runId);

  const coresData = (cores ?? []) as {
    id: string;
    kind: string;
    schedule_days: number[];
  }[];

  const scheduledCores = coresData.filter((c) => c.schedule_days.includes(dayOfWeek));

  // Fetch subtasks for all cores
  const coreIds = coresData.map((c) => c.id);
  const { data: subtasks } = await supabase
    .from("subtasks")
    .select("*")
    .in("core_id", coreIds.length > 0 ? coreIds : ["none"]);

  // Auto-close any past days still marked in_progress
  const todayDate = now.toISOString().split("T")[0];
  const { data: staleLogs } = await supabase
    .from("daily_logs")
    .select("id, log_date")
    .eq("run_id", runId)
    .eq("status", "in_progress")
    .lt("log_date", todayDate);

  if (staleLogs && staleLogs.length > 0) {
    for (const stale of staleLogs as { id: string; log_date: string }[]) {
      await supabase
        .from("daily_logs")
        .update({
          status: "failed",
          closed_at: new Date().toISOString(),
        } as never)
        .eq("id", stale.id);
    }
  }

  // Fetch today's daily log
  let { data: dailyLog } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("run_id", runId)
    .eq("log_date", todayDate)
    .single();

  // Create if missing
  if (!dailyLog) {
    const { data: newLog } = await supabase
      .from("daily_logs")
      .insert({
        run_id: runId,
        user_id: user.id,
        log_date: todayDate,
        day_index: Math.min(currentDay, 90),
        cores_required_count: scheduledCores.length,
      })
      .select("*")
      .single();
    dailyLog = newLog;
  }

  const logData = dailyLog as { id: string; status: string; day_index: number } | null;

  // Fetch task completions for today
  const { data: completions } = await supabase
    .from("task_completions")
    .select("*")
    .eq("daily_log_id", logData?.id ?? "none");

  // Fetch optionals
  const { data: optionals } = await supabase.from("optionals").select("*").eq("run_id", runId);

  // Fetch reasoning entries for today
  const { data: reasoningEntries } = await supabase
    .from("reasoning_entries")
    .select("*")
    .eq("daily_log_id", logData?.id ?? "none");

  // Fetch rewards
  const { data: rewards } = await supabase
    .from("rewards")
    .select("*")
    .eq("run_id", runId)
    .order("scheduled_day");

  // Compute qualifying days count
  const { data: qualifiedLogs } = await supabase
    .from("daily_logs")
    .select("id")
    .eq("run_id", runId)
    .eq("status", "qualified");

  const qualifyingDays = qualifiedLogs?.length ?? 0;

  // Compute exercise plan from run goal + fuel calorie target
  const goal: Goal = runData.goal ?? "gain";
  const allSubtasks = (subtasks ?? []) as {
    id: string;
    core_id: string;
    unit: string | null;
    target_numeric: number | null;
  }[];
  const fuelCore = coresData.find((c) => c.kind === "fuel");
  const kcalSubtask = fuelCore
    ? allSubtasks.find((s) => s.core_id === fuelCore.id && s.unit === "kcal")
    : null;
  const calorieTarget = kcalSubtask?.target_numeric ?? 2500;
  const exercisePlan = calculateExercisePlan(goal, calorieTarget);

  // Check if user already checked in today
  const { data: todayCheckin } = await supabase
    .from("weight_checkins")
    .select("id")
    .eq("run_id", runId)
    .eq("day_index", Math.min(currentDay, 90))
    .limit(1);
  const checkedInToday = (todayCheckin?.length ?? 0) > 0;

  const dayLabel = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();

  return (
    <>
      <Topbar
        crumb={`TODAY · ${dayLabel}`}
        sub={`Day ${currentDay} / 90, Run 01`}
        status={
          logData?.status === "qualified"
            ? "Qualified"
            : logData?.status === "failed"
              ? "Failed"
              : "In progress"
        }
        statusKind={
          logData?.status === "qualified"
            ? "moss"
            : logData?.status === "failed"
              ? "ember"
              : "progress"
        }
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <TodayContent
          cores={coresData}
          scheduledCores={scheduledCores}
          subtasks={
            (subtasks ?? []) as {
              id: string;
              core_id: string;
              label: string;
              measurement: string;
              target_numeric: number | null;
              unit: string | null;
              active_from_level: number;
              active_until_level: number | null;
            }[]
          }
          completions={
            (completions ?? []) as {
              id: string;
              subtask_id: string | null;
              optional_id: string | null;
              completed: boolean;
            }[]
          }
          optionals={
            (optionals ?? []) as {
              id: string;
              label: string;
              consecutive_skip_count: number;
              is_locked_in_today: boolean;
            }[]
          }
          reasoningEntries={
            (reasoningEntries ?? []) as { id: string; optional_id: string; reason_text: string }[]
          }
          rewards={
            (rewards ?? []) as {
              id: string;
              scheduled_day: number;
              tier: string;
              name: string;
              status: string;
            }[]
          }
          dailyLogId={logData?.id ?? ""}
          currentDay={currentDay}
          currentLevel={runData.current_level}
          levelStreak={runData.level_streak}
          qualifyingDays={qualifyingDays}
          endDate={runData.end_date}
          userId={user.id}
          checkedInToday={checkedInToday}
          exercisePlan={exercisePlan}
        />
      </div>
    </>
  );
}
