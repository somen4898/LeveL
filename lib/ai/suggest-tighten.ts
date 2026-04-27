"use server";

import { z } from "zod";
import { getClaudeClient } from "./client";

const SuggestionSchema = z.object({
  label: z.string(),
  adjustment: z.string(),
  newValue: z.string(),
  reasoning: z.string(),
});

export type TightenSuggestion = z.infer<typeof SuggestionSchema>;

export async function suggestTighten(input: {
  targetName: string;
  currentValue: string;
  unit: string;
  kind: "core" | "optional";
  history?: string[];
}): Promise<TightenSuggestion[]> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `A user is leveling up in their 90-day habit tracker. They chose to strengthen "${input.targetName}" (currently ${input.currentValue} ${input.unit}).

This is a ${input.kind}. Suggest exactly 3 ways to tighten this target. Each suggestion should be a small, incremental increase that feels achievable but meaningful.

${input.history?.length ? `Recent pattern: ${input.history.join(", ")}` : ""}

Return ONLY a JSON array (no markdown, no explanation):
[
  {
    "label": "Name of the adjustment",
    "adjustment": "+50 kcal" or "+5 min" or similar,
    "newValue": "The new target value with unit",
    "reasoning": "One sentence why this makes sense"
  }
]

Rules:
- Keep increments small (5-15% of current value)
- Make each suggestion different in magnitude (easy / moderate / stretch)
- Write in the voice of a training contract, not a coach. Brief. Factual.`,
      },
    ],
  });

  const textContent = response.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type");
  }

  const parsed = JSON.parse(textContent.text);
  return z.array(SuggestionSchema).parse(parsed);
}
