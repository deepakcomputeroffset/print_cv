import { STATUS } from "@prisma/client";
import { z } from "zod";

// Schema for query parameters
export const QuerySchema = z.object({
    search: z.string().optional(),
    category: z.enum(["LOW", "MEDIUM", "HIGH", "all"]).optional(),
    categoryId: z.string().optional(),
    status: z.enum(["true", "false", "all"]).optional(),
    isAvailable: z.enum(["true", "false", "all"]).optional(),
    page: z.string().transform(Number).optional(),
    perpage: z.string().transform(Number).optional(),
    sortby: z.string().optional(),
    sortorder: z.enum(["asc", "desc"]).optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minQty: z.string().optional(),
    orderId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    totalPages: z.number().optional(),
    parentCategoryId: z.string().optional(),
    walletId: z.string().optional(),
    orderStatus: z.union([z.nativeEnum(STATUS), z.literal("ALL")]).optional(),
    dispatched: z.enum(["true", "false"]).optional(),
    completed: z.enum(["true", "false"]).optional(),
});
