import { TRANSACTION_TYPE } from "@prisma/client";
import { z } from "zod";

export const transactionFormSchema = z.object({
    customerId: z.number(),
    amount: z.number(),
    type: z.nativeEnum(TRANSACTION_TYPE, {
        message: "Invalid transaction type.",
    }),
    description: z.string({ message: "Enter about transaction" }),
});
