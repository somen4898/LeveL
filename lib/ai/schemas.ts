import { z } from "zod";

// ── All AI response schemas in one file. Add new ones here. ──

export const FormattedActivitySchema = z.object({
  label: z.string(),
  measurement: z.enum(["binary", "numeric"]),
  target: z.number().nullable(),
  unit: z.string().nullable(),
});

export const TightenSuggestionSchema = z.object({
  label: z.string(),
  adjustment: z.string(),
  newValue: z.string(),
  reasoning: z.string(),
});

export const UnlockSuggestionSchema = z.object({
  label: z.string(),
  measurement: z.enum(["binary", "numeric"]),
  target: z.number().nullable(),
  unit: z.string().nullable(),
  suggestion: z.string(),
});

export const RefinedTargetsSchema = z.object({
  calorieTarget: z.number(),
  proteinG: z.number(),
  bodyMinutes: z.number(),
  bodyDaysPerWeek: z.number(),
  reasoning: z.string(),
});

// Derived types
export type FormattedActivity = z.infer<typeof FormattedActivitySchema>;
export type TightenSuggestion = z.infer<typeof TightenSuggestionSchema>;
export type UnlockSuggestion = z.infer<typeof UnlockSuggestionSchema>;
export type RefinedTargets = z.infer<typeof RefinedTargetsSchema>;
