import { z } from "zod";

export const jobFormSchema = z.object({
    name: z.string().min(1, "Enter valid name."),
    isVerified: z.boolean().default(false),
    prefixId: z.number().int().positive().nullable().optional(),
});

export const jobPrefixFormSchema = z.object({
    prefix: z
        .string()
        .min(1, "Prefix is required")
        .max(10, "Max 10 characters")
        .regex(/^[A-Za-z0-9]+$/, "Only letters and numbers allowed"),
});

export const addOrdersToJobFormSchema = z.object({
    orders: z.array(z.number().min(1)),
});
