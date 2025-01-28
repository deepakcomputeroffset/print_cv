import { z } from "zod";

export const productCategorySchema = z.object({
    name: z
        .string({ required_error: "Name is required." })
        .min(1, { message: "Name must be at least 1 character long." }),
    description: z
        .string()
        .min(1, { message: "Description must be at least 1 character long." })
        .optional(),
    image_url: z.string({ message: "Image are required." }),
    parent_category_id: z
        .number()
        .int({ message: "Parent category ID must be an integer." })
        .nullable(),
});
