"use server";

import { callAI } from "@/lib/ai/call";
import { PROMPTS } from "@/lib/ai/prompts";
import { KNOWLEDGE } from "@/lib/ai/knowledge";
import { QuestionnaireTargetsSchema } from "@/lib/ai/schemas";

export async function calculateWithAI(data: {
  age: number;
  sex: string;
  weightKg: number;
  heightCm: number;
  goal: string;
  activityLevel: string;
  trainingExperience: string;
  context: string;
}) {
  return callAI({
    prompt: PROMPTS.calculateFromQuestionnaire(data),
    schema: QuestionnaireTargetsSchema,
    model: "reasoning",
    system: KNOWLEDGE.nutrition,
    maxTokens: 1024,
  });
}
