import { z } from "zod";

export const cancellationFormSchema = z.object({
    reason: z
        .string({ required_error: "Please provide a reason for cancellation" })
        .min(10, "Reason must be at least 10 characters long")
        .max(500, "Reason must not exceed 500 characters"),
});
