import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/shell/topbar";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_run_id, day_close_time")
    .eq("id", user.id)
    .single();

  const profileData = profile as { active_run_id: string | null; day_close_time: string } | null;
  const runId = profileData?.active_run_id;
  if (!runId) redirect("/onboarding");

  const { data: run } = await supabase
    .from("runs")
    .select("start_date, current_level")
    .eq("id", runId)
    .single();

  const runData = run as { start_date: string; current_level: number } | null;
  const currentDay = runData?.start_date
    ? Math.floor(
        (new Date().getTime() - new Date(runData.start_date).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    : 1;
  const daysLeft = 90 - currentDay + 1;

  // Fetch cores
  const { data: cores } = await supabase.from("cores").select("*").eq("run_id", runId);
  const coresArr = (cores ?? []) as { id: string; kind: string; schedule_days: number[] }[];

  // Fetch subtasks for targets
  const coreIds = coresArr.map((c) => c.id);
  const { data: subtasks } = await supabase
    .from("subtasks")
    .select("*")
    .in("core_id", coreIds.length > 0 ? coreIds : ["none"]);
  const subtasksArr = (subtasks ?? []) as {
    id: string;
    core_id: string;
    label: string;
    target_numeric: number | null;
    unit: string | null;
  }[];

  // Fetch rewards
  const { data: rewards } = await supabase
    .from("rewards")
    .select("*")
    .eq("run_id", runId)
    .order("scheduled_day");

  const rewardsArr = (rewards ?? []) as {
    id: string;
    scheduled_day: number;
    name: string;
    price_amount: number | null;
  }[];

  const bodyCore = coresArr.find((c) => c.kind === "body");
  const fuelCore = coresArr.find((c) => c.kind === "fuel");
  const craftCore = coresArr.find((c) => c.kind === "craft");

  const bodySubs = subtasksArr.filter((s) => s.core_id === bodyCore?.id);
  const fuelSubs = subtasksArr.filter((s) => s.core_id === fuelCore?.id);
  const craftSubs = subtasksArr.filter((s) => s.core_id === craftCore?.id);

  const lockedItems = [
    {
      k: "Core I: Body",
      v: `${bodyCore?.schedule_days.length ?? 0}× / week · ${bodySubs.map((s) => s.label).join(", ")}`,
    },
    {
      k: "Core II: Fuel",
      v: fuelSubs
        .map((s) => `${s.label}${s.target_numeric ? ` ≥ ${s.target_numeric}${s.unit ?? ""}` : ""}`)
        .join(" · "),
    },
    {
      k: "Core III: Craft",
      v: `${craftCore?.schedule_days.length ?? 0}× / week · ${craftSubs.map((s) => s.label).join(" or ")}`,
    },
    ...rewardsArr.map((r, i) => ({
      k: `Reward ${String(i + 1).padStart(2, "0")}: Day ${r.scheduled_day}`,
      v: `${r.name}${r.price_amount ? ` · ₹${r.price_amount.toLocaleString()}` : ""}`,
    })),
  ];

  return (
    <>
      <Topbar
        crumb="SETTINGS"
        sub="What you can change · what is locked"
        status={`${daysLeft} days left`}
      />
      <div className="flex-1 overflow-auto p-8 pb-12">
        {/* Contract notice */}
        <div className="bg-ink text-bone rounded-[10px] p-[20px_26px]">
          <div className="flex items-center gap-4">
            <span className="font-[var(--font-display)] text-[32px] italic text-ember-l">!</span>
            <div className="flex flex-col flex-1">
              <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-4">
                The contract holds
              </span>
              <p className="font-[var(--font-display)] italic text-[18px] mt-1.5 leading-[1.4]">
                Cores, targets, and reward picks are locked for the remaining {daysLeft} days. This
                is the friction that makes the system work, not a bug.
              </p>
            </div>
          </div>
        </div>

        {/* Locked */}
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3 block mt-6">
          LOCKED · cannot change until day 91
        </span>
        <div className="bg-card border border-hair rounded-[10px] overflow-hidden mt-3">
          {lockedItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-[22px] py-3.5 ${
                i > 0 ? "border-t border-hair-2" : ""
              }`}
            >
              <span className="text-[14px] text-ink-4">🔒</span>
              <span className="flex-1 text-[13.5px] font-medium">{item.k}</span>
              <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em]">
                {item.v}
              </span>
              <span className="font-[var(--font-tactical)] text-[9px] tracking-[0.14em] uppercase px-[7px] py-[3px] border border-hair rounded text-ink-4 font-semibold">
                UNTIL DAY 91
              </span>
            </div>
          ))}
        </div>

        {/* Editable */}
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-ink-3 block mt-8">
          Editable mid-run
        </span>
        <div className="bg-card border border-hair rounded-[10px] overflow-hidden mt-3">
          {[
            { k: "Daily check-in time", v: profileData?.day_close_time ?? "23:59", type: "edit" },
            { k: "Skip-reason min length", v: "50 chars", type: "edit" },
            {
              k: "Push reminders",
              v: "Cores · Optionals · Window-close",
              type: "toggle",
              on: true,
            },
            { k: "End-of-day digest", v: "Email · 22:30", type: "toggle", on: false },
            { k: "Sound on check-off", v: "Off", type: "toggle", on: false },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-[22px] py-3.5 ${
                i > 0 ? "border-t border-hair-2" : ""
              }`}
            >
              <div className="flex flex-col flex-1">
                <span className="text-[13.5px] font-medium">{item.k}</span>
                <span className="font-[var(--font-tactical)] text-[10px] text-ink-3 tracking-[0.04em] mt-0.5">
                  {item.v}
                </span>
              </div>
              {item.type === "toggle" ? (
                <div
                  className={`w-[38px] h-[22px] rounded-full p-0.5 relative cursor-pointer ${
                    item.on ? "bg-ember" : "bg-hair"
                  }`}
                >
                  <div
                    className={`w-[18px] h-[18px] rounded-full bg-white absolute top-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.2)] ${
                      item.on ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </div>
              ) : (
                <button className="px-3 py-[7px] bg-card text-ink-2 border border-hair rounded-[6px] text-[11.5px] font-medium cursor-pointer hover:bg-paper transition-colors">
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Hard exits */}
        <span className="font-[var(--font-tactical)] text-[10px] tracking-[0.18em] uppercase text-rust block mt-8">
          Hard exits
        </span>
        <div className="bg-[#fbf3ed] border border-[#e8c7b5] rounded-[10px] p-5 mt-3">
          <div className="flex items-center gap-4">
            <div className="flex flex-col flex-1">
              <span className="text-[13.5px] font-semibold text-rust">Abandon Run 01</span>
              <p className="font-[var(--font-ui)] text-[12px] text-[#7a4530] leading-[1.5] mt-1">
                Run archives at day {currentDay}. Unclaimed rewards will not unlock. Your level is
                preserved.
              </p>
            </div>
            <button className="px-3 py-[7px] bg-card border border-rust text-rust rounded-[6px] text-[11.5px] font-medium cursor-pointer hover:bg-[#fbf3ed] transition-colors">
              Abandon run
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
