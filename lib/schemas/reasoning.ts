import { z } from "zod";

export const SkipReasonSchema = z.object({
  optionalId: z.string().uuid(),
  dailyLogId: z.string().uuid(),
  reasonText: z.string().min(50, "Reason must be at least 50 characters"),
  tag: z.enum(["sick", "tired", "busy", "other"]).optional(),
});

export type SkipReasonInput = z.infer<typeof SkipReasonSchema>;
