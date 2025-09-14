import { z } from "zod";

export const getProductCategorySchema = () => {
    const isClient = typeof window !== "undefined";

    return z.object({
        name: z
            .string({ required_error: "Name is required." })
            .min(1, { message: "Name must be at least 1 character long." }),
        description: z
            .string()
            .min(1, {
                message: "Description must be at least 1 character long.",
            })
            .optional(),
        image: isClient
            ? z.instanceof(File, { message: "Invalid file type" }) // Client
            : z
                  .object({
                      size: z.number(),
                      type: z.string(),
                      name: z.string().optional(),
                      arrayBuffer: z
                          .function()
                          .args()
                          .returns(z.promise(z.unknown())),
                  })
                  .optional(), // Server (FileLike)
        isAvailable: z.boolean().optional(),
        isList: z.boolean().optional(),
        parentCategoryId: z
            .string({ message: "Parent category ID must be an integer." })
            .optional(),
    });
};
