"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const InputSchema = z.object({
  subtaskId: z.string().uuid(),
  newLabel: z.string().min(1),
  reason: z.string().min(20, "Reason must be at least 20 characters"),
});

export async function updateCraftSubtask(rawInput: unknown) {
  const input = InputSchema.parse(rawInput);
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Verify the subtask belongs to a Craft core owned by this user
  const { data: subtask } = await supabase
    .from("subtasks")
    .select("id, core_id, label")
    .eq("id", input.subtaskId)
    .eq("user_id", user.id)
    .single();

  if (!subtask) throw new Error("Subtask not found");

  const subtaskData = subtask as { id: string; core_id: string; label: string };

  const { data: core } = await supabase
    .from("cores")
    .select("kind")
    .eq("id", subtaskData.core_id)
    .single();

  const coreData = core as { kind: string } | null;
  if (coreData?.kind !== "craft") {
    throw new Error("Only Craft subtasks can be changed mid-run");
  }

  const oldLabel = subtaskData.label;

  // Update the subtask
  await supabase
    .from("subtasks")
    .update({ label: input.newLabel } as never)
    .eq("id", input.subtaskId);

  // Log the amendment (we'll store this in reasoning_entries as a special entry,
  // or we could add a dedicated amendments table later)
  // For now, log to console and revalidate
  console.log(
    `[AMENDMENT] User ${user.id} changed Craft subtask: "${oldLabel}" → "${input.newLabel}" | Reason: ${input.reason}`
  );

  revalidatePath("/today");
  revalidatePath("/settings");

  return { ok: true, oldLabel, newLabel: input.newLabel };
}
