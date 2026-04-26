import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role key for cron
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find all open daily logs where the day should have ended
  const { data: openLogs } = await supabase
    .from("daily_logs")
    .select("id, run_id, log_date, user_id")
    .eq("status", "in_progress")
    .is("closed_at", null);

  if (!openLogs || openLogs.length === 0) {
    return NextResponse.json({ message: "No open logs to close", count: 0 });
  }

  let closedCount = 0;

  for (const log of openLogs) {
    const logDate = new Date(log.log_date);
    const now = new Date();

    // Only close if the log date is in the past
    if (logDate.toDateString() === now.toDateString()) continue;

    try {
      // Import and call close-day logic inline since we can't use server actions from cron
      // For now, just mark as failed if still open past midnight
      await supabase
        .from("daily_logs")
        .update({
          status: "failed",
          closed_at: new Date().toISOString(),
        })
        .eq("id", log.id);

      closedCount++;
    } catch (err) {
      console.error(`Failed to close log ${log.id}:`, err);
    }
  }

  return NextResponse.json({ message: "Cron complete", closedCount });
}
