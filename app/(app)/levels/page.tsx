import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";
import { padTwo } from "@/lib/utils/format";

export default async function LevelsPage() {
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
    id: string; level_number: number; effect_kind: string; description: string;
  }[];

  // Fetch level history
  const { data: history } = await supabase
    .from("level_history")
    .select("level_number, achieved_on")
    .eq("run_id", runId);

  const achievedLevels = new Set(
    ((history ?? []) as { level_number: number }[]).map(h => h.level_number)
  );

  // Stack so far: levels achieved
  const stack = catalogueData.filter(l => l.level_number <= currentLevel);

  // Current level effect
  const currentEffect = catalogueData.find(l => l.level_number === currentLevel);
  const nextEffect = catalogueData.find(l => l.level_number === currentLevel + 1);

  return (
    <>
      <Topbar
        crumb="LEVELS · KAIZEN LADDER"
        sub="Odd tightens · Even unlocks · 3 qualifying days = 1 level"
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
              Each level applies a single small change. The system&apos;s power comes from accumulation, not from any single moment.
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

        {/* Full Ladder */}
        <div className="mt-5">
          <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3">
            Full ladder · 30 levels
          </span>
          <div className="mt-3 grid grid-cols-2 border border-hair rounded-[10px] overflow-hidden bg-card">
            {catalogueData.map((l, i) => {
              const done = l.level_number <= currentLevel;
              const isCurrent = l.level_number === currentLevel;
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={l.id}
                  className={`flex items-center gap-3.5 px-[18px] py-3 ${
                    i < 28 ? "border-b border-hair-2" : ""
                  } ${isLeft ? "border-r border-hair-2" : ""} ${
                    isCurrent ? "bg-ember-bg" : done ? "bg-bone" : ""
                  }`}
                >
                  <span
                    className={`font-[var(--font-display)] text-[22px] italic w-[38px] ${
                      done ? "text-ink" : "text-ink-4"
                    }`}
                  >
                    {padTwo(l.level_number)}
                  </span>
                  <span
                    className={`font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] rounded font-semibold shrink-0 ${
                      l.effect_kind === "UNLOCK"
                        ? done
                          ? "bg-ember text-white"
                          : "bg-hair text-ink-3"
                        : done
                          ? "bg-transparent text-ink border border-ink"
                          : "bg-transparent text-ink-3 border border-hair"
                    }`}
                  >
                    {l.effect_kind === "TIGHTEN" ? "TGHTN" : "UNLCK"}
                  </span>
                  <span
                    className={`flex-1 text-[12.5px] ${
                      done ? "text-ink-2" : "text-ink-4"
                    }`}
                  >
                    {l.description}
                  </span>
                  {isCurrent && (
                    <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] bg-ember text-white rounded font-semibold">
                      YOU
                    </span>
                  )}
                  {done && !isCurrent && (
                    <span className="font-[var(--font-tactical)] text-[10px] text-moss font-semibold">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="font-[var(--font-ui)] text-[12px] text-ink-3 leading-[1.55] mt-4">
          A perfectly compliant user reaches Level 30 around Day 90. A realistic user lands around Level 22–25.
        </p>
      </div>
    </>
  );
}
