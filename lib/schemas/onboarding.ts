import { z } from "zod";

export const CoreInputSchema = z.object({
  kind: z.enum(["body", "fuel", "craft"]),
  scheduleDays: z.array(z.number().min(0).max(6)).min(1),
  subtasks: z.array(
    z.object({
      label: z.string().min(1),
      measurement: z.enum(["binary", "numeric"]),
      targetNumeric: z.number().optional(),
      unit: z.string().optional(),
    })
  ).min(1),
});

export const OnboardingSchema = z.object({
  cores: z.array(CoreInputSchema).length(3),
  rewards: z.array(
    z.object({
      scheduledDay: z.number().refine((d) => [15, 30, 45, 60, 75, 90].includes(d)),
      tier: z.enum(["small", "big"]),
      name: z.string().min(1),
      priceAmount: z.number().positive().optional(),
      priceCurrency: z.string().default("INR"),
      imageUrl: z.string().url().optional(),
      motivationNote: z.string().optional(),
    })
  ).length(6),
  timezone: z.string().default("UTC"),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
