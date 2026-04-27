"use server";

import { z } from "zod";
import { getClient, AI_CONFIG } from "./client";

// ── Generic AI call: one function, any schema, any prompt ──

export type ModelTier = "fast" | "reasoning";

interface CallOptions<T extends z.ZodTypeAny> {
  prompt: string;
  schema: T;
  model?: ModelTier;
  system?: string;
  maxTokens?: number;
}

export async function callAI<T extends z.ZodTypeAny>(options: CallOptions<T>): Promise<z.infer<T>> {
  const client = getClient();
  const tier = options.model ?? "fast";

  const response = await client.messages.create({
    model: AI_CONFIG.models[tier],
    max_tokens: options.maxTokens ?? AI_CONFIG.defaults.maxTokens,
    system: options.system,
    messages: [{ role: "user", content: options.prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");

  // Strip markdown fences if the model wraps them
  const raw = block.text
    .replace(/^```json?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  return options.schema.parse(JSON.parse(raw));
}
