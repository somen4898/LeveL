import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { padTwo } from "@/lib/utils/format";

export default async function LevelsPage() {
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
    .select("current_level, level_streak")
    .eq("id", runId)
    .single();

  const runData = run as { current_level: number; level_streak: number } | null;
  const currentLevel = runData?.current_level ?? 1;
  const streak = runData?.level_streak ?? 0;

  // Fetch level catalogue
  const { data: catalogue } = await supabase
    .from("level_catalogue")
    .select("*")
    .eq("run_id", runId)
    .order("level_number");

  const catalogueData = (catalogue ?? []) as {
    id: string;
    level_number: number;
    effect_kind: string;
    description: string;
  }[];

  // Fetch level history
  // level_history available via supabase query if needed

  // Stack so far: levels achieved
  const stack = catalogueData.filter((l) => l.level_number <= currentLevel);

  // Current level effect
  const currentEffect = catalogueData.find((l) => l.level_number === currentLevel);
  const nextEffect = catalogueData.find((l) => l.level_number === currentLevel + 1);

  return (
    <>
      <Topbar
        crumb="LEVELS · YOUR PROGRESSION"
        sub="Each confirmed check-in adjustment earns a level"
        status={`Lv ${padTwo(currentLevel)} / 30`}
        statusKind="ember"
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        <div className="grid grid-cols-[1.1fr_1fr] gap-4">
          {/* Hero */}
          <div className="bg-ink text-bone rounded-[10px] p-8">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
              CURRENT LEVEL
            </span>
            <div className="flex items-baseline gap-4 mt-1.5">
              <span className="font-[var(--font-tactical)] text-[96px] font-semibold leading-none tracking-[-0.04em]">
                {padTwo(currentLevel)}
              </span>
              <span className="font-[var(--font-display)] text-[22px] italic text-ember-l">
                of thirty
              </span>
            </div>
            <hr className="border-none h-px bg-[#3a342d] my-5" />
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
              EFFECT · LEVEL {padTwo(currentLevel)} · {currentEffect?.effect_kind ?? ""}
            </span>
            <p className="font-[var(--font-display)] text-[22px] italic mt-2.5 leading-[1.3]">
              {currentEffect?.description ?? "No effect"}
            </p>
            <p className="font-[var(--font-ui)] text-[12px] text-ink-4 leading-[1.5] mt-2.5">
              Each level applies a single small change. The system&apos;s power comes from
              accumulation, not from any single moment.
            </p>
            <hr className="border-none h-px bg-[#3a342d] my-6" />
            {nextEffect && (
              <>
                <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
                  NEXT: LV {padTwo(currentLevel + 1)} · {nextEffect.effect_kind}
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-[var(--font-tactical)] text-[28px] font-semibold tabular-nums">
                    {streak} / 3
                  </span>
                  <span className="text-[13px] text-ink-4">
                    qualifying days · {3 - streak} to go
                  </span>
                </div>
                <div className="h-1.5 bg-[#3a342d] rounded-full mt-3">
                  <div
                    className="h-full bg-ember rounded-full"
                    style={{ width: `${(streak / 3) * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Stack */}
          <div className="bg-card border border-hair rounded-[10px] p-6">
            <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
              Stack so far · {stack.length} effects active
            </span>
            <div className="mt-3.5">
              {stack.map((l, i) => (
                <div
                  key={l.id}
                  className={`flex items-center gap-3.5 py-2.5 ${
                    i < stack.length - 1 ? "border-b border-hair-2" : ""
                  }`}
                >
                  <span className="font-[var(--font-display)] text-[18px] italic text-ember w-7">
                    {padTwo(l.level_number)}
                  </span>
                  <span
                    className={`font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] rounded font-semibold shrink-0 ${
                      l.effect_kind === "UNLOCK"
                        ? "bg-ember text-white"
                        : "bg-transparent text-ink border border-ink"
                    }`}
                  >
                    {l.effect_kind === "TIGHTEN" ? "TGHTN" : "UNLCK"}
                  </span>
                  <span className="flex-1 text-[13px] text-ink-2">{l.description}</span>
                </div>
              ))}
              {stack.length === 0 && (
                <p className="text-[13px] text-ink-3 italic">No levels achieved yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Progression list */}
        <div className="mt-5">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
            Progression · {catalogueData.length} {catalogueData.length === 1 ? "level" : "levels"}{" "}
            earned
          </span>
          {catalogueData.length === 0 ? (
            <p className="mt-3 text-[13px] text-ink-3 italic">
              No levels yet. Your first adjustment comes at the Week 2 check-in.
            </p>
          ) : (
            <div className="mt-3 flex flex-col border border-hair rounded-[10px] overflow-hidden bg-card">
              {catalogueData.map((l, i) => {
                const isCurrent = l.level_number === currentLevel;
                return (
                  <div
                    key={l.id}
                    className={`flex items-center gap-3.5 px-[18px] py-3 ${
                      i < catalogueData.length - 1 ? "border-b border-hair-2" : ""
                    } ${isCurrent ? "bg-ember-bg" : "bg-bone"}`}
                  >
                    <span className="font-[var(--font-display)] text-[22px] italic w-[38px] text-ink">
                      {padTwo(l.level_number)}
                    </span>
                    <span
                      className={`font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] rounded font-semibold shrink-0 ${
                        l.effect_kind === "UNLOCK"
                          ? "bg-ember text-white"
                          : "bg-transparent text-ink border border-ink"
                      }`}
                    >
                      {l.effect_kind === "TIGHTEN" ? "TGHTN" : "UNLCK"}
                    </span>
                    <span className="flex-1 text-[12.5px] text-ink-2">{l.description}</span>
                    {isCurrent && (
                      <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ember text-white rounded font-semibold">
                        YOU
                      </span>
                    )}
                    {!isCurrent && (
                      <span className="font-[var(--font-tactical)] text-[10px] text-moss font-semibold">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
