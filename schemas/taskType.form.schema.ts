import { z } from "zod";

export const taskTypeFormSchema = z.object({
    name: z.string().min(2, "Enter Valid name."),
    description: z.string().min(2, "Enter valid description"),
});
