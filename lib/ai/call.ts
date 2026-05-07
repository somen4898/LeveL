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

  // Extract JSON from response — handles markdown fences, trailing text, etc.
  let raw = block.text.trim();

  // Strip markdown fences
  raw = raw
    .replace(/^```json?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  // Find the first { and last matching } to extract just the JSON object
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    raw = raw.slice(start, end + 1);
  }

  return options.schema.parse(JSON.parse(raw));
}
