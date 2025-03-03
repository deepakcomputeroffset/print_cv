import { z } from "zod";

export const jobFormSchema = z.object({
    name: z.string().min(2, "Enter Valid name."),
    isVerified: z.boolean().default(false),
});
