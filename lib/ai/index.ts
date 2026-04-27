"use server";

import { z } from "zod";
import { callAI } from "./call";
import { PROMPTS } from "./prompts";
import {
  FormattedActivitySchema,
  TightenSuggestionSchema,
  UnlockSuggestionSchema,
  RefinedTargetsSchema,
} from "./schemas";
import type {
  FormattedActivity,
  TightenSuggestion,
  UnlockSuggestion,
  RefinedTargets,
} from "./schemas";

// ── Public API: import { ai } from "@/lib/ai" ──

export const ai = {
  async formatActivity(input: string): Promise<FormattedActivity> {
    return callAI({
      prompt: PROMPTS.formatActivity(input),
      schema: FormattedActivitySchema,
    });
  },

  async suggestTighten(
    name: string,
    currentValue: string,
    unit: string,
    kind: "core" | "optional"
  ): Promise<TightenSuggestion[]> {
    return callAI({
      prompt: PROMPTS.suggestTighten(name, currentValue, unit, kind),
      schema: z.array(TightenSuggestionSchema),
    });
  },

  async suggestUnlock(input: string, existingOptionals: string[]): Promise<UnlockSuggestion> {
    return callAI({
      prompt: PROMPTS.suggestUnlock(input, existingOptionals),
      schema: UnlockSuggestionSchema,
    });
  },

  async refineTargets(
    calculated: { calories: number; protein: number; exercise: string },
    context: string
  ): Promise<RefinedTargets> {
    return callAI({
      prompt: PROMPTS.refineTargets(calculated, context),
      schema: RefinedTargetsSchema,
    });
  },
};
