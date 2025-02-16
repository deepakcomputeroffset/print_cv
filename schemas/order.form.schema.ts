import { z } from "zod";

export const orderFormSchema = z.object({
    productItemId: z.number(),
    qty: z.number().min(1),
});
