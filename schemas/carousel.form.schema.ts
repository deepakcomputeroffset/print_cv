import { z } from "zod";

export const getCarouselCreateSchema = () => {
    const isClient = typeof window !== "undefined";

    return z.object({
        title: z
            .string({ required_error: "Title is required." })
            .min(1, { message: "Title must be at least 1 character long." }),
        description: z.string().optional(),
        image: isClient
            ? z.instanceof(File, { message: "Image is required" })
            : z.object({
                  size: z.number(),
                  type: z.string(),
                  name: z.string().optional(),
                  arrayBuffer: z
                      .function()
                      .args()
                      .returns(z.promise(z.unknown())),
              }),
        linkUrl: z
            .string()
            .url({ message: "Invalid URL" })
            .optional()
            .or(z.literal("")),
        isActive: z
            .union([z.boolean(), z.string()])
            .transform((val) => val === true || val === "true")
            .optional(),
        order: z.coerce.number().int().min(0).optional(),
    });
};

export const getCarouselEditSchema = () => {
    const isClient = typeof window !== "undefined";

    return z.object({
        title: z
            .string({ required_error: "Title is required." })
            .min(1, { message: "Title must be at least 1 character long." }),
        description: z.string().optional(),
        image: isClient
            ? z.instanceof(File, { message: "Invalid file type" }).optional()
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
                  .optional(),
        linkUrl: z
            .string()
            .url({ message: "Invalid URL" })
            .optional()
            .or(z.literal("")),
        isActive: z
            .union([z.boolean(), z.string()])
            .transform((val) => val === true || val === "true")
            .optional(),
        order: z.coerce.number().int().min(0).optional(),
    });
};
