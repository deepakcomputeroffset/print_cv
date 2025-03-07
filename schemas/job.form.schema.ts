import { z } from "zod";

export const jobFormSchema = z.object({
    name: z.string().min(2, "Enter Valid name."),
    isVerified: z.boolean().default(false),
});

export const addOrdersToJobFormSchema = z.object({
    orders: z.array(z.number().min(1)),
});
