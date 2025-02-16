import { z } from "zod";

// Define the schema for product items
const productItemSchema = z
    .object({
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
    })
    .refine((item) => item.avg_price > item.min_price, {
        message: "Average price must be greater than minimum price.",
        path: ["avg_price"],
    })
    .refine(
        (item) =>
            item.max_price > item.min_price && item.max_price > item.avg_price,
        {
            message: "Max price must be greater than both min and avg price.",
            path: ["max_price"],
        },
    );

// Define the main product schema
export const baseProductFormSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Product description must be at least 10 characters.",
    }),
    is_avialable: z.boolean().default(false),
    category_id: z.string().refine((v) => v !== "0", "Select Category"),
    image_url: z.array(z.string()),
    sku: z.string(),
    min_qty: z.number().min(1),
    og_price: z.number().min(0),
    min_price: z.number().min(0),
    avg_price: z.number().min(0),
    max_price: z.number().min(0),
    product_items: z.array(productItemSchema), // Nested product items
});

// Apply `.partial()` on the base schema
export const partialProductFormSchema = baseProductFormSchema.partial();

// Apply refinements separately
export const productFormSchema = baseProductFormSchema
    .refine((data) => data.avg_price > data.min_price, {
        message: "Average price must be greater than minimum price.",
        path: ["avg_price"],
    })
    .refine(
        (data) =>
            data.max_price > data.min_price && data.max_price > data.avg_price,
        {
            message: "Max price must be greater than both min and avg price.",
            path: ["max_price"],
        },
    );

// Partial support also needs refinements applied separately
export const partialProductFormSchemaWithValidation = partialProductFormSchema
    .refine(
        (data) =>
            data.avg_price == null || data.avg_price > (data.min_price ?? 0),
        {
            message: "Average price must be greater than minimum price.",
            path: ["avg_price"],
        },
    )
    .refine(
        (data) =>
            data.max_price == null ||
            (data.max_price > (data.min_price ?? 0) &&
                data.max_price > (data.avg_price ?? 0)),
        {
            message: "Max price must be greater than both min and avg price.",
            path: ["max_price"],
        },
    );
