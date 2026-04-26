import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shell/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile and active run
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, active_run_id")
    .eq("id", user.id)
    .single();

  const profileData = profile as { display_name: string | null; active_run_id: string | null } | null;

  let day = 1;
  let level = 1;
  const runId = profileData?.active_run_id ?? null;

  if (runId) {
    const { data: run } = await supabase
      .from("runs")
      .select("current_level, start_date")
      .eq("id", runId)
      .single();

    const runData = run as { current_level: number; start_date: string | null } | null;

    if (runData) {
      level = runData.current_level;
      if (runData.start_date) {
        const start = new Date(runData.start_date);
        const now = new Date();
        day = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
  } else {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen overflow-hidden relative z-[1]">
      <Sidebar
        displayName={profileData?.display_name ?? "player"}
        level={level}
        day={day}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
