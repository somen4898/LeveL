import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

// ── Config: change model/defaults in one place ──

export const AI_CONFIG = {
  model: "claude-haiku-4-5-20251001" as string,
  defaults: {
    maxTokens: 512,
    temperature: 0,
  },
} as const;
