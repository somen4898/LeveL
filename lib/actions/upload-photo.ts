"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadProgressPhoto(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  const file = formData.get("photo") as File;
  const runId = formData.get("runId") as string;
  const dayIndex = Number(formData.get("dayIndex"));

  if (!file || !runId || !dayIndex) throw new Error("Missing required fields");

  const fileName = `${user.id}/${runId}/day-${dayIndex}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("progress-photos")
    .upload(fileName, file);

  if (uploadError) throw new Error(uploadError.message);

  await supabase.from("progress_photos").insert({
    run_id: runId,
    user_id: user.id,
    photo_date: new Date().toISOString().split("T")[0],
    day_index: dayIndex,
    storage_path: fileName,
  });

  revalidatePath("/today");
  revalidatePath("/codex");

  return { ok: true };
}
