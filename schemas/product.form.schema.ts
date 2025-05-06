import { z } from "zod";

// Define the schema for product items
const productItemSchema = z.object({
    sku: z.string(),
    minQty: z.number().min(1),
    ogPrice: z.number().min(0),
    price: z.number().min(0),
    imageUrl: z.array(z.string()),
    isAvailable: z.boolean().default(true),
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
    minQty: z.number().min(1),
    ogPrice: z.number().min(0),
    price: z.number().min(0),
    productItems: z.array(productItemSchema), // Nested product items
});

export const partialProductFormSchema = productFormSchema.partial();
