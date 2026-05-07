import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { WeightCalendar } from "@/components/codex/weight-calendar";
import { ReasoningArchive } from "@/components/codex/reasoning-archive";
import { dayIndex } from "@/lib/utils/dates";

export default async function CodexPage() {
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

  // Fetch run for current day
  const { data: run } = await supabase.from("runs").select("start_date").eq("id", runId).single();
  const runData = run as { start_date: string } | null;
  const currentDay = runData?.start_date ? dayIndex(new Date(runData.start_date), new Date()) : 1;

  // Weight check-ins
  const { data: weightCheckins } = await supabase
    .from("weight_checkins")
    .select("*")
    .eq("run_id", runId)
    .order("day_index");

  const weightData = (weightCheckins ?? []) as {
    id: string;
    day_index: number;
    checkin_date: string;
    weight_kg: number;
    notes: string | null;
  }[];

  // Qualifying days
  const { data: qualifiedLogs } = await supabase
    .from("daily_logs")
    .select("id")
    .eq("run_id", runId)
    .eq("status", "qualified");

  const qualifyingCount = qualifiedLogs?.length ?? 0;

  // All reasoning entries
  const { data: allReasons } = await supabase
    .from("reasoning_entries")
    .select("*, optionals(label)")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false });

  const reasonsArr = (allReasons ?? []) as {
    id: string;
    reason_text: string;
    tag: string | null;
    logged_at: string;
    optionals: { label: string } | null;
  }[];

  // Tag counts
  const tagCounts: Record<string, number> = {};
  reasonsArr.forEach((r) => {
    const t = r.tag ?? "untagged";
    tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  });

  return (
    <>
      <Topbar crumb="CODEX" sub="Reference and reasoning archive" />
      <div className="flex-1 overflow-auto p-8 pb-12">
        {/* Weight calendar */}
        <div className="mb-8">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3 block mb-3">
            Weight history · {weightData.length} check-ins
          </span>
          {weightData.length === 0 ? (
            <p className="text-[13px] text-ink-3 italic">No weight check-ins recorded yet.</p>
          ) : (
            <WeightCalendar
              weights={weightData.map((w) => ({
                day_index: w.day_index,
                weight_kg: w.weight_kg,
                notes: w.notes,
              }))}
              totalDays={currentDay}
            />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-hair rounded-[10px] p-5">
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              QUALIFYING DAYS
            </span>
            <div className="font-[var(--font-tactical)] text-[48px] font-semibold mt-1 tracking-[-0.03em]">
              {qualifyingCount}
            </div>
          </div>
          <div className="bg-card border border-hair rounded-[10px] p-5">
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              TOTAL SKIP REASONS
            </span>
            <div className="font-[var(--font-tactical)] text-[48px] font-semibold mt-1 tracking-[-0.03em]">
              {reasonsArr.length}
            </div>
          </div>
          <div className="bg-card border border-hair rounded-[10px] p-5">
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
              MOST USED TAG
            </span>
            <div className="font-[var(--font-tactical)] text-[48px] font-semibold mt-1 tracking-[-0.03em] uppercase">
              {Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-"}
            </div>
          </div>
        </div>

        {/* Tag filter + Reasoning archive */}
        <ReasoningArchive reasonsArr={reasonsArr} tagCounts={tagCounts} />
      </div>
    </>
  );
}
