"use server";

import { z } from "zod";
import { getClaudeClient } from "./client";

const ActivitySchema = z.object({
  label: z.string(),
  measurement: z.enum(["binary", "numeric"]),
  target: z.number().nullable(),
  unit: z.string().nullable(),
});

export type FormattedActivity = z.infer<typeof ActivitySchema>;

export async function formatActivityInput(
  userInput: string
): Promise<FormattedActivity> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Convert this habit/activity description into a structured format for a daily tracker.

Input: "${userInput}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "label": "Short activity name with target",
  "measurement": "numeric" or "binary",
  "target": number or null,
  "unit": "min" or "kcal" or "g" or "steps" or "sec" or "words" or null
}

Rules:
- If the input mentions a number and unit, use "numeric" measurement
- If it's a yes/no activity (e.g. "no phone before 9am"), use "binary" with target null and unit null
- Keep the label concise but specific (e.g. "Morning meditation · 10 min")
- Use the · separator in labels when combining activity and target`,
      },
    ],
  });

  const textContent = response.content[0];
  if (textContent.type !== "text") {
    throw new Error("Unexpected response type");
  }

  const parsed = JSON.parse(textContent.text);
  return ActivitySchema.parse(parsed);
}
