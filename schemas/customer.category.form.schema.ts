import { z } from "zod";

export const customerCategorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    discount: z.number().min(0, "Discount cannot be negative"),
    level: z.number().int().positive("Level must be a positive integer"),
});
