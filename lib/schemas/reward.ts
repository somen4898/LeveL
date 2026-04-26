import { z } from "zod";

export const ClaimRewardSchema = z.object({
  rewardId: z.string().uuid(),
  runId: z.string().uuid(),
});

export type ClaimRewardInput = z.infer<typeof ClaimRewardSchema>;

export const RewardInputSchema = z.object({
  scheduledDay: z.number().refine((d) => [15, 30, 45, 60, 75, 90].includes(d)),
  tier: z.enum(["small", "big"]),
  name: z.string().min(1),
  priceAmount: z.number().positive().optional(),
  priceCurrency: z.string().default("INR"),
  imageUrl: z.string().url().optional(),
  motivationNote: z.string().optional(),
});

export type RewardInput = z.infer<typeof RewardInputSchema>;
