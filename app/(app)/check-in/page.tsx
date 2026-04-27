import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { CheckinFlow } from "@/components/checkin/checkin-flow";
import { dayIndex } from "@/lib/utils/dates";

export default async function CheckInPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_run_id")
    .eq("id", user.id)
    .single();

  const runId = (profile as { active_run_id: string | null } | null)?.active_run_id;
  if (!runId) redirect("/onboarding");

  const { data: run } = await supabase
    .from("runs")
    .select("start_date, current_level")
    .eq("id", runId)
    .single();

  const runData = run as { start_date: string; current_level: number } | null;
  if (!runData?.start_date) redirect("/onboarding");

  const now = new Date();
  const currentDay = dayIndex(new Date(runData.start_date), now);
  const weekNumber = Math.ceil(currentDay / 7);

  // Fetch past weight checkins
  const { data: checkins } = await supabase
    .from("weight_checkins")
    .select("weight_kg, day_index, created_at")
    .eq("run_id", runId)
    .order("day_index", { ascending: true });

  const pastCheckins = (checkins ?? []) as {
    weight_kg: number;
    day_index: number;
    created_at: string;
  }[];

  // Check if already checked in this week
  const weekStart = (weekNumber - 1) * 7 + 1;
  const weekEnd = weekNumber * 7;
  const alreadyCheckedIn = pastCheckins.some(
    (c) => c.day_index >= weekStart && c.day_index <= weekEnd
  );

  return (
    <>
      <Topbar
        crumb={`WEEKLY CHECK-IN · WEEK ${weekNumber}`}
        status={alreadyCheckedIn ? "Completed" : "Due"}
        statusKind={alreadyCheckedIn ? "moss" : "ember"}
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <CheckinFlow
          runId={runId}
          userId={user.id}
          currentDay={currentDay}
          weekNumber={weekNumber}
          pastCheckins={pastCheckins}
          currentLevel={runData.current_level}
          alreadyCheckedIn={alreadyCheckedIn}
        />
      </div>
    </>
  );
}
