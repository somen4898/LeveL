"use server";

import { z } from "zod";
import { callAI } from "./call";
import { PROMPTS } from "./prompts";
import { KNOWLEDGE } from "./knowledge";
import {
  FormattedActivitySchema,
  TightenSuggestionSchema,
  UnlockSuggestionSchema,
  RefinedTargetsSchema,
  QuestionnaireTargetsSchema,
  CheckinAnalysisSchema,
  OptionalFromInputSchema,
} from "./schemas";
import type {
  FormattedActivity,
  TightenSuggestion,
  UnlockSuggestion,
  RefinedTargets,
  QuestionnaireTargets,
  CheckinAnalysis,
  OptionalFromInput,
} from "./schemas";

// ── Public API: import { ai } from "@/lib/ai" ──

export const ai = {
  // ── Fast (Haiku): formatting, structuring ──

  async formatActivity(input: string): Promise<FormattedActivity> {
    return callAI({
      prompt: PROMPTS.formatActivity(input),
      schema: FormattedActivitySchema,
      model: "fast",
    });
  },

  // ── Reasoning (Sonnet): suggestions, analysis, nutrition ──

  async suggestTighten(
    name: string,
    currentValue: string,
    unit: string,
    kind: "core" | "optional"
  ): Promise<TightenSuggestion[]> {
    return callAI({
      prompt: PROMPTS.suggestTighten(name, currentValue, unit, kind),
      schema: z.array(TightenSuggestionSchema),
      model: "reasoning",
    });
  },

  async suggestUnlock(input: string, existingOptionals: string[]): Promise<UnlockSuggestion> {
    return callAI({
      prompt: PROMPTS.suggestUnlock(input, existingOptionals),
      schema: UnlockSuggestionSchema,
      model: "reasoning",
    });
  },

  async refineTargets(
    calculated: { calories: number; protein: number; exercise: string },
    context: string
  ): Promise<RefinedTargets> {
    return callAI({
      prompt: PROMPTS.refineTargets(calculated, context),
      schema: RefinedTargetsSchema,
      model: "reasoning",
      system: KNOWLEDGE.nutrition,
    });
  },

  async calculateFromQuestionnaire(data: {
    age: number;
    sex: string;
    weightKg: number;
    heightCm: number;
    goal: string;
    activityLevel: string;
    trainingExperience: string;
    context: string;
  }): Promise<QuestionnaireTargets> {
    return callAI({
      prompt: PROMPTS.calculateFromQuestionnaire(data),
      schema: QuestionnaireTargetsSchema,
      model: "reasoning",
      system: KNOWLEDGE.nutrition,
      maxTokens: 1024,
    });
  },

  async checkinAnalysis(data: {
    goal: string;
    currentCalories: number;
    currentProtein: number;
    weightTrend: {
      changeKg: number;
      changePercent: number;
      direction: string;
      weeksOfData: number;
    };
    weekNumber: number;
    domainDecision: {
      shouldAdjust: boolean;
      suggestedCalories: number;
      reasoning: string;
      rule: string;
    };
  }): Promise<CheckinAnalysis> {
    return callAI({
      prompt: PROMPTS.weeklyCheckinAnalysis(data),
      schema: CheckinAnalysisSchema,
      model: "reasoning",
      system: KNOWLEDGE.nutrition,
    });
  },

  async suggestOptionalFromInput(
    input: string,
    goal: string,
    existingOptionals: string[]
  ): Promise<OptionalFromInput> {
    return callAI({
      prompt: PROMPTS.suggestOptionalFromInput(input, goal, existingOptionals),
      schema: OptionalFromInputSchema,
      model: "reasoning",
      system: KNOWLEDGE.nutrition,
    });
  },
};
