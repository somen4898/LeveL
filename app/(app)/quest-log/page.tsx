import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import Link from "next/link";

export default async function QuestLogPage() {
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

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("run_id", runId)
    .order("day_index", { ascending: false });

  const logsData = (logs ?? []) as {
    id: string; log_date: string; day_index: number; status: string;
    cores_complete_count: number; cores_required_count: number;
    closed_at: string | null;
  }[];

  return (
    <>
      <Topbar crumb="QUEST LOG · RUN 01" sub="All days in this run" />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <div className="max-w-[700px]">
          {logsData.map((log) => {
            const date = new Date(log.log_date);
            const dayLabel = date.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }).toUpperCase();

            return (
              <Link
                key={log.id}
                href={`/quest-log/${log.log_date}`}
                className="flex items-center gap-4 py-4 border-b border-hair-2 hover:bg-bone/50 transition-colors -mx-4 px-4 rounded-lg no-underline text-ink"
              >
                <span className="font-[var(--font-display)] text-[22px] italic text-ember w-[38px]">
                  {String(log.day_index).padStart(2, "0")}
                </span>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-semibold">Day {log.day_index}</span>
                  <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-0.5">
                    {dayLabel} · {log.cores_complete_count}/{log.cores_required_count} CORES
                  </span>
                </div>
                <span
                  className={`font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] rounded font-semibold ${
                    log.status === "qualified"
                      ? "bg-moss text-white"
                      : log.status === "failed"
                        ? "bg-rust text-white"
                        : "bg-hair text-ink-3"
                  }`}
                >
                  {log.status === "qualified" ? "QUAL" : log.status === "failed" ? "FAIL" : "OPEN"}
                </span>
              </Link>
            );
          })}
          {logsData.length === 0 && (
            <p className="text-[13px] text-ink-3 italic">No days logged yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
