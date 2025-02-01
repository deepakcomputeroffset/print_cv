import { z } from "zod";

export const ProductAttributeValueSchema = z.object({
    product_attribute_value: z
        .string()
        .min(1, "Name must be at least 2 characters."),
    product_attribute_type_id: z.number(),
});
