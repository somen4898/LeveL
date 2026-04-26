import { z } from "zod";

export const LogTaskSchema = z.object({
  dailyLogId: z.string().uuid(),
  taskKind: z.enum(["subtask", "optional"]),
  subtaskId: z.string().uuid().optional(),
  optionalId: z.string().uuid().optional(),
  completed: z.boolean(),
  numericValue: z.number().optional(),
  note: z.string().optional(),
}).refine(
  (data) =>
    (data.taskKind === "subtask" && data.subtaskId && !data.optionalId) ||
    (data.taskKind === "optional" && data.optionalId && !data.subtaskId),
  { message: "Exactly one of subtaskId or optionalId must be provided" }
);

export type LogTaskInput = z.infer<typeof LogTaskSchema>;
