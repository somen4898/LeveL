import { z } from "zod";

export const SubmitCheckinSchema = z.object({
  runId: z.string().uuid(),
  weightKg: z.number().positive(),
  dayIndex: z.number().int().positive(),
  notes: z.string().optional(),
});

export const ConfirmAdjustmentSchema = z.object({
  runId: z.string().uuid(),
  newCalorieTarget: z.number().int().positive(),
  newProteinTarget: z.number().int().positive().optional(),
  reasoning: z.string(),
  rule: z.string(),
});

export type SubmitCheckinInput = z.infer<typeof SubmitCheckinSchema>;
export type ConfirmAdjustmentInput = z.infer<typeof ConfirmAdjustmentSchema>;
