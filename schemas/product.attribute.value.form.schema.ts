import { z } from "zod";

export const ProductAttributeValueSchema = z.object({
    productAttributeValue: z
        .string()
        .min(1, "Name must be at least 2 characters."),
    productAttributeTypeId: z.number(),
});
