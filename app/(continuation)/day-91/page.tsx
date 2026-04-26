import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { padTwo } from "@/lib/utils/format";

export default async function Day91Page() {
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
    .select("*")
    .eq("id", runId)
    .single();

  const runData = run as {
    id: string; start_date: string; end_date: string;
    current_level: number;
  } | null;

  // Count stats
  const { data: qualLogs } = await supabase
    .from("daily_logs")
    .select("id")
    .eq("run_id", runId)
    .eq("status", "qualified");

  const { data: claimedRewards } = await supabase
    .from("rewards")
    .select("id")
    .eq("run_id", runId)
    .eq("status", "claimed");

  const qualifyingDays = qualLogs?.length ?? 0;
  const rewardsClaimed = claimedRewards?.length ?? 0;
  const level = runData?.current_level ?? 1;

  const startFormatted = runData?.start_date
    ? new Date(runData.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
    : "";
  const endFormatted = runData?.end_date
    ? new Date(runData.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-paper relative z-[1] overflow-auto">
      <div className="max-w-[1080px] mx-auto px-14 py-13">
        {/* Header */}
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect x="3" y="20" width="9" height="9" rx="1.5" fill="#161311" opacity="0.4" />
            <rect x="10" y="13" width="9" height="9" rx="1.5" fill="#161311" opacity="0.7" />
            <rect x="17" y="6" width="9" height="9" rx="1.5" fill="#161311" />
          </svg>
          <div className="flex-1" />
          <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
            DAY 91 · {endFormatted}
          </span>
        </div>

        <div className="mt-14">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
            Day 91 · the day after
          </span>
          <h1 className="font-[var(--font-display)] text-[80px] leading-[0.98] tracking-[-0.018em] mt-4">
            Run 01 closed.
            <br />
            <em className="italic text-ink-3">The system stays open.</em>
          </h1>
          <p className="font-[var(--font-display)] italic text-[22px] leading-[1.45] text-ink-2 mt-5 max-w-[700px]">
            Your level holds. Your active task list holds. The chain resets, the windows reset, the rewards reset. Pick again, or close the book here.
          </p>
        </div>

        {/* Run summary */}
        <div className="bg-ink text-bone rounded-[10px] p-8 mt-11">
          <div className="flex items-center justify-between">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
              RUN 01 · ARCHIVED
            </span>
            <span className="font-[var(--font-tactical)] text-[10px] text-ink-4 tracking-[0.04em]">
              {startFormatted} → {endFormatted}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-6">
            {[
              ["QUALIFYING DAYS", String(qualifyingDays), "OF 90"],
              ["LONGEST WINDOW", "-", "-"],
              ["REWARDS CLAIMED", String(rewardsClaimed), "OF 6"],
              ["LEVEL REACHED", String(level), "OF 30"],
            ].map(([k, v, sub]) => (
              <div key={k} className="flex flex-col">
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-4 tracking-[0.04em]">
                  {k}
                </span>
                <span className="font-[var(--font-tactical)] text-[48px] font-semibold mt-1.5 tracking-[-0.03em] tabular-nums">
                  {v}
                </span>
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-4 tracking-[0.04em]">
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Three doors */}
        <div className="mt-8">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
            Three doors
          </span>
        </div>
        <div className="mt-3.5 grid grid-cols-3 gap-3.5">
          {/* Run 02 */}
          <div className="bg-card border border-ink rounded-[10px] p-7 shadow-[var(--shadow-md)]">
            <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ember text-white rounded font-semibold">
              RECOMMENDED
            </span>
            <h3 className="font-[var(--font-display)] text-[28px] italic mt-4">
              Sign Run 02.
            </h3>
            <p className="text-[13.5px] leading-[1.6] text-ink-2 mt-3">
              Same three Cores. Pick six fresh rewards. Keep your level (Lv {padTwo(level)}) and active Optionals. Chain resets. New 90.
            </p>
            <hr className="border-none h-px bg-hair-2 my-4" />
            <div className="flex gap-2">
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                CORES · LOCKED
              </span>
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                LV {padTwo(level)} KEPT
              </span>
            </div>
            <button className="w-full mt-5 py-3 bg-ink text-bone rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-black transition-colors">
              Begin Run 02 →
            </button>
          </div>

          {/* Re-spec */}
          <div className="bg-card border border-hair rounded-[10px] p-7">
            <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
              CORE RESET
            </span>
            <h3 className="font-[var(--font-display)] text-[28px] italic mt-4">
              Pick new Cores.
            </h3>
            <p className="text-[13.5px] leading-[1.6] text-ink-2 mt-3">
              Replace one or all three Cores. Keep your level. Re-sign the contract. The system is the same; the body of work is new.
            </p>
            <hr className="border-none h-px bg-hair-2 my-4" />
            <div className="flex gap-2">
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                RE-SIGN
              </span>
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                LV {padTwo(level)} KEPT
              </span>
            </div>
            <button className="w-full mt-5 py-3 bg-card text-ink border border-ink rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors">
              Re-spec Cores →
            </button>
          </div>

          {/* Maintain */}
          <div className="bg-card border border-hair rounded-[10px] p-7">
            <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
              NON-ARC
            </span>
            <h3 className="font-[var(--font-display)] text-[28px] italic mt-4">
              Maintain mode.
            </h3>
            <p className="text-[13.5px] leading-[1.6] text-ink-2 mt-3">
              Keep doing the work without a 90-day arc, rewards, or finale. Cores remain. Chain still tracks. No countdown.
            </p>
            <hr className="border-none h-px bg-hair-2 my-4" />
            <div className="flex gap-2">
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                NO REWARDS
              </span>
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                NO ARC
              </span>
            </div>
            <button className="w-full mt-5 py-3 bg-card text-ink-2 border border-hair rounded-[7px] text-[13px] font-medium cursor-pointer hover:bg-paper transition-colors">
              Enter maintain →
            </button>
          </div>
        </div>

        {/* Close book */}
        <div className="mt-9 flex items-center gap-4 p-5 bg-bone border border-dashed border-hair rounded-[10px]">
          <div className="flex flex-col flex-1">
            <span className="text-[14px] font-semibold">Close the book.</span>
            <span className="font-[var(--font-ui)] text-[12px] text-ink-3 leading-[1.5] mt-[3px]">
              End your relationship with LeveL. Run 01 is archived; you can re-open any time.
            </span>
          </div>
          <button className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium cursor-pointer hover:bg-paper transition-colors">
            End account
          </button>
        </div>
      </div>
    </div>
  );
}
