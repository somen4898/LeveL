import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { RewardVaultContent } from "@/components/reward-vault/reward-vault-content";

export default async function RewardVaultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

  const currentDay = Math.floor(
    (Date.now() - new Date(runData.start_date).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const { data: rewards } = await supabase
    .from("rewards")
    .select("*")
    .eq("run_id", runId)
    .order("scheduled_day");

  const rewardsData = (rewards ?? []) as {
    id: string; scheduled_day: number; tier: string; name: string;
    price_amount: number | null; price_currency: string | null;
    status: string; claimed_at: string | null; motivation_note: string | null;
  }[];

  // Count qualifying days in each window
  const { data: qualifiedLogs } = await supabase
    .from("daily_logs")
    .select("day_index")
    .eq("run_id", runId)
    .eq("status", "qualified");

  const qualifiedDays = ((qualifiedLogs ?? []) as { day_index: number }[]).map(l => l.day_index);

  const claimedCount = rewardsData.filter(r => r.status === "claimed").length;
  const qualifyingCount = rewardsData.filter(r => r.status === "qualifying").length;

  return (
    <>
      <Topbar
        crumb="REWARD CALENDAR · RUN 01"
        sub="Six rewards. Locked at sign. No downgrades."
        status={`Day ${currentDay} / 90`}
        statusKind="ember"
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <RewardVaultContent
          rewards={rewardsData}
          currentDay={currentDay}
          qualifiedDays={qualifiedDays}
          runId={runId}
          userId={user.id}
        />
      </div>
    </>
  );
}
