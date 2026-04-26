import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";

export default async function CodexPage() {
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
    id: string; reason_text: string; tag: string | null; logged_at: string;
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
              {Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"}
            </div>
          </div>
        </div>

        {/* Tag filter */}
        <div className="flex gap-2 mb-6">
          {Object.entries(tagCounts).map(([tag, count]) => (
            <span
              key={tag}
              className="font-[var(--font-tactical)] text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full bg-card border border-hair text-ink-2 font-medium"
            >
              {tag} · {count}
            </span>
          ))}
        </div>

        {/* Reasoning archive */}
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3 block mb-3">
          Reasoning archive
        </span>
        <div className="flex flex-col gap-3">
          {reasonsArr.map((r) => (
            <div key={r.id} className="bg-card border border-hair rounded-[10px] p-5 border-l-[3px] border-l-ember">
              <div className="flex items-center gap-2 mb-2">
                {r.optionals && (
                  <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-ink rounded text-ink font-semibold">
                    {r.optionals.label}
                  </span>
                )}
                {r.tag && (
                  <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ink text-bone rounded font-semibold">
                    {r.tag}
                  </span>
                )}
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] ml-auto">
                  {new Date(r.logged_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="font-[var(--font-display)] italic text-[17px] leading-[1.45] text-ink">
                &ldquo;{r.reason_text}&rdquo;
              </p>
            </div>
          ))}
          {reasonsArr.length === 0 && (
            <p className="text-[13px] text-ink-3 italic">No skip reasons recorded yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
