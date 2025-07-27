import { z } from "zod";

export const productPriceSchema = z.object({
    qty: z.number().min(0),
    price: z.number().min(0),
});

// Define the schema for product items
export const productItemSchema = z.object({
    sku: z.string(),
    imageUrl: z.array(z.string()),
    isAvailable: z.boolean().default(true),
    pricing: z.array(productPriceSchema),
    productAttributeOptions: z.array(
        z.object({
            id: z.number(),
        }),
    ),
});

// Define the main product schema
export const productFormSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Product description must be at least 10 characters.",
    }),
    isAvailable: z.boolean().default(false),
    categoryId: z.string().refine((v) => v !== "0", "Select Category"),
    imageUrl: z.array(z.string()),
    sku: z.string(),
    isTieredPricing: z.boolean().default(true),
    productItems: z.array(productItemSchema), // Nested product items
});

export const partialProductFormSchema = productFormSchema.partial().extend({
    productItems: z.array(productItemSchema.partial()).optional(),
});
