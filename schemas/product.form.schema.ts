import { z } from "zod";

// Define the schema for product items
const productItemSchema = z
    .object({
        sku: z.string(),
        minQty: z.number().min(1),
        ogPrice: z.number().min(0),
        minPrice: z.number().min(0),
        avgPrice: z.number().min(0),
        maxPrice: z.number().min(0),
        imageUrl: z.array(z.string()),
        isAvailable: z.boolean().default(true),
        productAttributeOptions: z.array(
            z.object({
                id: z.number(),
            }),
        ),
    })
    .refine((item) => item.avgPrice > item.minPrice, {
        message: "Average price must be greater than minimum price.",
        path: ["avgPrice"],
    })
    .refine(
        (item) =>
            item.maxPrice > item.minPrice && item.maxPrice > item.avgPrice,
        {
            message: "Max price must be greater than both min and avg price.",
            path: ["maxPrice"],
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
    isAvailable: z.boolean().default(false),
    categoryId: z.string().refine((v) => v !== "0", "Select Category"),
    imageUrl: z.array(z.string()),
    sku: z.string(),
    minQty: z.number().min(1),
    ogPrice: z.number().min(0),
    minPrice: z.number().min(0),
    avgPrice: z.number().min(0),
    maxPrice: z.number().min(0),
    productItems: z.array(productItemSchema), // Nested product items
});

// Apply `.partial()` on the base schema
export const partialProductFormSchema = baseProductFormSchema.partial();

// Apply refinements separately
export const productFormSchema = baseProductFormSchema
    .refine((data) => data.avgPrice > data.minPrice, {
        message: "Average price must be greater than minimum price.",
        path: ["avgPrice"],
    })
    .refine(
        (data) =>
            data.maxPrice > data.minPrice && data.maxPrice > data.avgPrice,
        {
            message: "Max price must be greater than both min and avg price.",
            path: ["maxPrice"],
        },
    );

// Partial support also needs refinements applied separately
export const partialProductFormSchemaWithValidation = partialProductFormSchema
    .refine(
        (data) => data.avgPrice == null || data.avgPrice > (data.minPrice ?? 0),
        {
            message: "Average price must be greater than minimum price.",
            path: ["avgPrice"],
        },
    )
    .refine(
        (data) =>
            data.maxPrice == null ||
            (data.maxPrice > (data.minPrice ?? 0) &&
                data.maxPrice > (data.avgPrice ?? 0)),
        {
            message: "Max price must be greater than both min and avg price.",
            path: ["maxPrice"],
        },
    );
