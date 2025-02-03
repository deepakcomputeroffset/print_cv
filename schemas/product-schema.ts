import { z } from "zod";

export const productFormSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Product description must be at least 10 characters.",
    }),
    is_avialable: z.boolean().default(false),
    product_category_id: z.string().refine((v) => v !== "0", "Select Category"),
    image_url: z.array(z.string()),
    sku: z.string(),
    min_qty: z.number().min(1),
    og_price: z.number().min(0),
    min_price: z.number().min(0),
    avg_price: z.number().min(0),
    max_price: z.number().min(0),

    product_items: z.array(
        z.object({
            sku: z.string(),
            min_qty: z.number().min(1),
            og_price: z.number().min(0),
            min_price: z.number().min(0),
            avg_price: z.number().min(0),
            max_price: z.number().min(0),
            image_url: z.array(z.string()),
            is_avialable: z.boolean().default(true),
            product_attribute_options: z.array(
                z.object({
                    id: z.number(),
                }),
            ),
        }),
    ),
});
