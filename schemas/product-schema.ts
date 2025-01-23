import { z } from "zod";

export const productFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    price: z
        .string()
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Price must be a positive number",
        }),
    imageUrl: z.string().url("Must be a valid URL"),
    categoryId: z.string().min(1, "Category is required"),
});
