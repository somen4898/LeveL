"use server";

import { z } from "zod";
import { getClient, AI_CONFIG } from "./client";

// ── Generic AI call: one function, any schema, any prompt ──

interface CallOptions<T extends z.ZodTypeAny> {
  prompt: string;
  schema: T;
  maxTokens?: number;
  temperature?: number;
}

export async function callAI<T extends z.ZodTypeAny>(
  options: CallOptions<T>
): Promise<z.infer<T>> {
  const client = getClient();

  const response = await client.messages.create({
    model: AI_CONFIG.model,
    max_tokens: options.maxTokens ?? AI_CONFIG.defaults.maxTokens,
    messages: [{ role: "user", content: options.prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type");

  // Strip markdown fences if the model wraps them
  const raw = block.text.replace(/^```json?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  return options.schema.parse(JSON.parse(raw));
}
