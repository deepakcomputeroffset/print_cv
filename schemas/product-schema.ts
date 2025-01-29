import { z } from "zod";

export const productFormSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Product description must be at least 10 characters.",
    }),
    product_category_id: z.string(),
    image_url: z.array(z.string()),

    product_items: z.array(
        z.object({
            sku: z.string(),
            min_qty: z.number().min(1),
            og_price: z.number().min(0),
            min_price: z.number().min(0),
            avg_price: z.number().min(0),
            max_price: z.number().min(0),
            image_url: z.array(z.string()),
            available: z.boolean().default(true),
            product_attribute_options: z.array(
                z.object({
                    product_attribute_type_id: z.number(),
                    product_attribute_type_value: z.string(),
                }),
            ),
        }),
    ),
});
