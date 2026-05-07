import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/shell/topbar";

export default async function DayDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
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

  // Fetch run dates for boundary clamping
  const { data: run } = await supabase
    .from("runs")
    .select("start_date, end_date")
    .eq("id", runId)
    .single();
  const runDates = run as { start_date: string; end_date: string } | null;

  // Fetch day log
  const { data: log } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("run_id", runId)
    .eq("log_date", date)
    .single();

  const logData = log as {
    id: string;
    day_index: number;
    status: string;
    cores_complete_count: number;
    cores_required_count: number;
  } | null;

  if (!logData) {
    const isBeforeRun = runDates && date < runDates.start_date;
    const isAfterToday = date > new Date().toISOString().split("T")[0];

    return (
      <>
        <Topbar
          crumb="HISTORY"
          sub={date}
          right={
            <div className="flex gap-1.5">
              {!isBeforeRun && (
                <a
                  href={`/quest-log/${getPrevDate(date)}`}
                  className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium hover:bg-paper transition-colors no-underline"
                >
                  ← Prev
                </a>
              )}
              {!isAfterToday && (
                <a
                  href={`/quest-log/${getNextDate(date)}`}
                  className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium hover:bg-paper transition-colors no-underline"
                >
                  Next →
                </a>
              )}
            </div>
          }
        />
        <div className="flex-1 overflow-auto p-8 pb-12">
          <div className="max-w-[480px]">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
              {isBeforeRun ? "BEFORE YOUR RUN" : isAfterToday ? "FUTURE DAY" : "NO LOG"}
            </span>
            <h1 className="font-[var(--font-display)] text-[42px] leading-[1.05] tracking-[-0.018em] mt-3">
              {isBeforeRun
                ? "This date is before your run started."
                : isAfterToday
                  ? "This day hasn\u2019t happened yet."
                  : "No log recorded for this date."}
            </h1>
            <p className="font-[var(--font-display)] italic text-[16px] text-ink-3 mt-3">
              {isBeforeRun
                ? `Your run began on ${runDates.start_date}.`
                : isAfterToday
                  ? "Check back when the day arrives."
                  : "This day may have been skipped or the run hadn\u2019t started yet."}
            </p>
            <Link
              href="/quest-log"
              className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-ink text-bone rounded-[8px] font-[var(--font-ui)] text-[13px] font-semibold hover:bg-ink-2 transition-colors no-underline"
            >
              Back to Quest Log
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Auto-close past days still stuck as in_progress
  const todayStr = new Date().toISOString().split("T")[0];
  if (logData.status === "in_progress" && date < todayStr) {
    await supabase
      .from("daily_logs")
      .update({ status: "failed", closed_at: new Date().toISOString() } as never)
      .eq("id", logData.id);
    logData.status = "failed";
  }

  // Fetch cores
  const { data: cores } = await supabase.from("cores").select("*").eq("run_id", runId);
  const coresArr = (cores ?? []) as { id: string; kind: string }[];

  // Fetch subtasks
  const coreIds = coresArr.map((c) => c.id);
  const { data: subtasks } = await supabase
    .from("subtasks")
    .select("*")
    .in("core_id", coreIds.length > 0 ? coreIds : ["none"]);

  // Fetch completions
  const { data: completions } = await supabase
    .from("task_completions")
    .select("*")
    .eq("daily_log_id", logData.id);

  // Fetch reasoning
  const { data: reasons } = await supabase
    .from("reasoning_entries")
    .select("*")
    .eq("daily_log_id", logData.id);

  const completionsArr = (completions ?? []) as {
    subtask_id: string | null;
    optional_id: string | null;
    completed: boolean;
  }[];
  const reasonsArr = (reasons ?? []) as {
    id: string;
    optional_id: string;
    reason_text: string;
    tag: string | null;
    logged_at: string;
  }[];
  const subtasksArr = (subtasks ?? []) as { id: string; core_id: string; label: string }[];

  const dateObj = new Date(date);
  const dayLabel = dateObj
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    })
    .toUpperCase();

  const isQualified = logData.status === "qualified";
  const isToday = date === new Date().toISOString().split("T")[0];

  return (
    <>
      <Topbar
        crumb={`HISTORY · DAY ${logData.day_index} · ${dayLabel}`}
        sub={
          isQualified
            ? "Qualified"
            : logData.status === "failed"
              ? "Failed"
              : isToday
                ? "Live"
                : "In progress"
        }
        status={
          isQualified
            ? "Qualified"
            : logData.status === "failed"
              ? "Failed"
              : isToday
                ? "Live"
                : "In progress"
        }
        statusKind={
          isQualified
            ? "moss"
            : logData.status === "failed"
              ? "ember"
              : isToday
                ? "ember"
                : "progress"
        }
        right={
          <div className="flex gap-1.5">
            {(!runDates || getPrevDate(date) >= runDates.start_date) && (
              <a
                href={`/quest-log/${getPrevDate(date)}`}
                className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium hover:bg-paper transition-colors no-underline"
              >
                ← Prev
              </a>
            )}
            {getNextDate(date) <= new Date().toISOString().split("T")[0] && (
              <a
                href={`/quest-log/${getNextDate(date)}`}
                className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium hover:bg-paper transition-colors no-underline"
              >
                Next →
              </a>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
          <div>
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
              Day {logData.day_index}
            </span>
            <h1 className="font-[var(--font-display)] text-[56px] leading-[1.02] tracking-[-0.018em] mt-3">
              {logData.cores_complete_count === logData.cores_required_count
                ? "All cores closed."
                : `${logData.cores_complete_count} of ${logData.cores_required_count} cores.`}
              <br />
              <em className="italic text-ink-3">
                {reasonsArr.length > 0
                  ? `${reasonsArr.length} skip${reasonsArr.length > 1 ? "s" : ""} with reason.`
                  : "No skips."}
              </em>
            </h1>

            {/* Cores */}
            <div className="mt-8">
              <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
                Cores
              </span>
              <div className="bg-card border border-hair rounded-[10px] overflow-hidden mt-3">
                {coresArr.map((core, i) => {
                  const coreSubs = subtasksArr.filter((s) => s.core_id === core.id);
                  const allDone = coreSubs.every((s) =>
                    completionsArr.some((c) => c.subtask_id === s.id && c.completed)
                  );
                  const numerals = ["I", "II", "III"];

                  return (
                    <div
                      key={core.id}
                      className={`flex items-center gap-4 px-[22px] py-[18px] ${
                        i > 0 ? "border-t border-hair-2" : ""
                      }`}
                    >
                      <span className="font-[var(--font-display)] text-[28px] italic text-ember w-[34px]">
                        {numerals[i]}
                      </span>
                      <span
                        className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center text-[12px] font-bold shrink-0 ${
                          allDone
                            ? "bg-ember border-[1.5px] border-ember text-white shadow-[0_0_0_4px_#fbeadb]"
                            : "border-[1.5px] border-ink-4 opacity-60"
                        }`}
                      >
                        {allDone ? "✓" : ""}
                      </span>
                      <div className="flex flex-col flex-1">
                        <span className="text-[14px] font-semibold">
                          {core.kind.charAt(0).toUpperCase() + core.kind.slice(1)}
                        </span>
                        <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-[3px]">
                          {coreSubs.map((s) => s.label).join(" · ")}
                        </span>
                      </div>
                      <span
                        className={`font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] rounded font-semibold ${
                          allDone ? "bg-moss text-white" : "bg-hair text-ink-3"
                        }`}
                      >
                        {allDone ? "MET" : "MISS"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reasoning entries */}
            {reasonsArr.length > 0 && (
              <div className="mt-6">
                <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
                  Reasons
                </span>
                {reasonsArr.map((r) => (
                  <div
                    key={r.id}
                    className="bg-card border border-hair rounded-[10px] p-[22px_26px] mt-3 border-l-[3px] border-l-ember"
                  >
                    <p className="font-[var(--font-display)] italic text-[19px] leading-[1.45] text-ink">
                      &ldquo;{r.reason_text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3.5 mt-3.5">
                      <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                        {r.reason_text.length} CHARS · IMMUTABLE
                      </span>
                      {r.tag && (
                        <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                          {r.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side column */}
          <div className="flex flex-col gap-3.5">
            <div className="bg-card border border-hair rounded-[10px] p-[22px_24px]">
              <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
                Day verdict
              </span>
              <div
                className={`font-[var(--font-tactical)] text-[56px] font-semibold mt-2 tracking-[-0.03em] ${
                  isQualified
                    ? "text-moss"
                    : logData.status === "failed"
                      ? "text-rust"
                      : isToday
                        ? "text-ember"
                        : "text-ink-3"
                }`}
              >
                {isQualified
                  ? "QUAL"
                  : logData.status === "failed"
                    ? "FAIL"
                    : isToday
                      ? "LIVE"
                      : "PEND"}
              </div>
              <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                {isQualified
                  ? "+1 TO REWARD WINDOW · +1 TO LV-UP STREAK"
                  : logData.status === "failed"
                    ? "DID NOT QUALIFY"
                    : isToday
                      ? "CLOSES AT END OF DAY"
                      : "AWAITING CLOSE"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getPrevDate(date: string): string {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function getNextDate(date: string): string {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}
