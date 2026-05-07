"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  computeWeightTrend,
  computeAdjustmentDecision,
  type WeightDataPoint,
} from "@/lib/domain/checkin";
import { calculateBMR, calculateTDEE } from "@/lib/domain/calculator";
import { SubmitCheckinSchema, ConfirmAdjustmentSchema } from "@/lib/schemas/checkin";
import { callAI } from "@/lib/ai/call";
import { PROMPTS } from "@/lib/ai/prompts";

const AICheckinSchema = z.object({
  suggestedCalories: z.number(),
  suggestedProtein: z.number(),
  reasoning: z.string(),
  encouragement: z.string(),
});

export async function submitWeighIn(rawInput: unknown) {
  const input = SubmitCheckinSchema.parse(rawInput);

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Insert into weight_checkins
  const { error: insertErr } = await supabase.from("weight_checkins").insert({
    run_id: input.runId,
    user_id: user.id,
    weight_kg: input.weightKg,
    day_index: input.dayIndex,
    checkin_date: new Date().toISOString().split("T")[0],
    notes: input.notes ?? null,
  } as never);
  if (insertErr) throw new Error(`Weight insert failed: ${insertErr.message}`);

  // Fetch all checkins for this run ordered by day_index
  const { data: allCheckins } = await supabase
    .from("weight_checkins")
    .select("weight_kg, day_index")
    .eq("run_id", input.runId)
    .order("day_index", { ascending: true });

  const dataPoints = (allCheckins ?? []) as WeightDataPoint[];
  const trend = computeWeightTrend(dataPoints);

  // Fetch fuel core to get current calorie subtask
  const { data: fuelCores } = await supabase
    .from("cores")
    .select("id")
    .eq("run_id", input.runId)
    .eq("kind", "fuel");

  const fuelCoresArr = (fuelCores ?? []) as { id: string }[];
  const fuelCoreIds = fuelCoresArr.map((c) => c.id);

  let currentCalories = 2000; // sensible default

  if (fuelCoreIds.length > 0) {
    const { data: calorieSubtask } = await supabase
      .from("subtasks")
      .select("target_numeric")
      .in("core_id", fuelCoreIds)
      .eq("unit", "kcal")
      .limit(1)
      .single();

    const sub = calorieSubtask as { target_numeric: number | null } | null;
    if (sub?.target_numeric != null) {
      currentCalories = sub.target_numeric;
    }
  }

  // Fetch run biometrics (goal) — use defaults if not available
  const { data: run } = await supabase
    .from("runs")
    .select("goal, sex, height_cm, age")
    .eq("id", input.runId)
    .single();

  const runData = run as {
    goal: "gain" | "lose" | "maintain" | null;
    sex: "male" | "female" | null;
    height_cm: number | null;
    age: number | null;
  } | null;

  const sex = runData?.sex ?? "male";
  const heightCm = runData?.height_cm ?? 175;
  const age = runData?.age ?? 25;
  const goal = runData?.goal ?? "lose";
  const activityLevel = "light" as const;

  // Compute TDEE from current weight
  const bmr = calculateBMR(sex, trend.currentWeight, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  const decision = computeAdjustmentDecision({
    goal,
    currentCalories,
    currentWeight: trend.currentWeight,
    changePercent: trend.changePercent,
    direction: trend.direction,
    weeksOfData: trend.weeksOfData,
    tdee,
    sex,
  });

  // Fetch current protein target
  let currentProtein = 150; // sensible default
  if (fuelCoreIds.length > 0) {
    const { data: proteinSubtask } = await supabase
      .from("subtasks")
      .select("target_numeric")
      .in("core_id", fuelCoreIds)
      .eq("unit", "g")
      .limit(1)
      .single();

    const protSub = proteinSubtask as { target_numeric: number | null } | null;
    if (protSub?.target_numeric != null) {
      currentProtein = protSub.target_numeric;
    }
  }

  // AI enriched analysis (non-blocking — falls back to null on failure)
  let aiAnalysis: { reasoning: string; encouragement: string } | null = null;
  try {
    const weekNumber = Math.ceil(input.dayIndex / 7);
    const aiResult = await callAI({
      prompt: PROMPTS.weeklyCheckinAnalysis({
        goal,
        currentCalories,
        currentProtein,
        weightTrend: {
          changeKg: trend.changeKg,
          changePercent: trend.changePercent,
          direction: trend.direction,
          weeksOfData: trend.weeksOfData,
        },
        weekNumber,
        domainDecision: {
          shouldAdjust: decision.shouldAdjust,
          suggestedCalories: decision.suggestedCalories,
          reasoning: decision.reasoning,
          rule: decision.rule,
        },
      }),
      schema: AICheckinSchema,
      model: "fast",
    });
    aiAnalysis = {
      reasoning: aiResult.reasoning,
      encouragement: aiResult.encouragement,
    };
  } catch {
    // AI failure is non-fatal — domain logic is the source of truth
    aiAnalysis = null;
  }

  revalidatePath("/today");
  revalidatePath("/check-in");

  return { trend, decision, aiAnalysis };
}

export async function confirmAdjustment(rawInput: unknown) {
  const input = ConfirmAdjustmentSchema.parse(rawInput);

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // Fetch run's current_level
  const { data: run } = await supabase
    .from("runs")
    .select("current_level, goal")
    .eq("id", input.runId)
    .single();

  const runData = run as {
    current_level: number;
    goal: "gain" | "lose" | "maintain" | null;
  } | null;
  if (!runData) throw new Error("Run not found");

  const newLevel = runData.current_level + 1;

  // Fetch fuel core
  const { data: fuelCores } = await supabase
    .from("cores")
    .select("id")
    .eq("run_id", input.runId)
    .eq("kind", "fuel");

  const fuelCoresArr = (fuelCores ?? []) as { id: string }[];
  const fuelCoreIds = fuelCoresArr.map((c) => c.id);

  // Fetch current calorie subtask to record old→new in description
  let oldCalories: number | null = null;
  let calorieSubtaskId: string | null = null;

  if (fuelCoreIds.length > 0) {
    const { data: calorieSubtask } = await supabase
      .from("subtasks")
      .select("id, target_numeric")
      .in("core_id", fuelCoreIds)
      .eq("unit", "kcal")
      .limit(1)
      .single();

    const sub = calorieSubtask as {
      id: string;
      target_numeric: number | null;
    } | null;
    if (sub) {
      calorieSubtaskId = sub.id;
      oldCalories = sub.target_numeric;
    }
  }

  // Update fuel core calorie subtask target_numeric
  if (calorieSubtaskId) {
    await supabase
      .from("subtasks")
      .update({ target_numeric: input.newCalorieTarget } as never)
      .eq("id", calorieSubtaskId);
  }

  const description = `Calories adjusted from ${oldCalories ?? "?"} → ${input.newCalorieTarget} kcal. Rule: ${input.rule}. ${input.reasoning}`;

  // Insert level_catalogue entry
  const { data: catalogueEntry } = await supabase
    .from("level_catalogue")
    .insert({
      run_id: input.runId,
      level_number: newLevel,
      effect_kind: "TIGHTEN",
      description,
    } as never)
    .select("id")
    .single();

  const catalogueData = catalogueEntry as { id: string } | null;

  // Insert level_history entry
  await supabase.from("level_history").insert({
    run_id: input.runId,
    user_id: user.id,
    level_number: newLevel,
    catalogue_id: catalogueData?.id ?? null,
    achieved_on: new Date().toISOString().split("T")[0],
  } as never);

  // Update run: current_level = newLevel, level_streak = 0
  await supabase
    .from("runs")
    .update({ current_level: newLevel, level_streak: 0 } as never)
    .eq("id", input.runId);

  revalidatePath("/today");
  revalidatePath("/levels");
  revalidatePath("/check-in");

  return { newLevel };
}
