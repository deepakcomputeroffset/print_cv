import { z } from "zod";

export const taskSchema = z.object({
    jobId: z.number(),
    taskTypeId: z.number().min(1, "Task type is required"),
    assignedStaffId: z.number().optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
