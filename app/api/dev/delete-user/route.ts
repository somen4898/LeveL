import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_APP_MODE !== "dev") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find user by email
  const {
    data: { users },
    error: listErr,
  } = await admin.auth.admin.listUsers();
  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: `User ${email} not found` }, { status: 404 });
  }

  // Delete all user data first (profiles cascade should handle most, but be explicit)
  const tables = [
    "weight_checkins",
    "daily_logs",
    "rewards",
    "subtasks",
    "cores",
    "runs",
    "profiles",
  ];
  for (const table of tables) {
    await admin.from(table).delete().eq("user_id", user.id);
  }

  // Delete auth user
  const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id);
  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deleted: email });
}
