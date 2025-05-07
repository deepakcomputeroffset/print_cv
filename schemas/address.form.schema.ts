import { z } from "zod";

// Address Schema
export const addressSchema = z.object({
    country: z.string({
        required_error: "Select country",
    }),
    state: z.string({
        required_error: "Select state",
    }),
    city: z.string({
        required_error: "Select city",
    }),
    pinCode: z
        .string({ required_error: "Enter pin code." })
        .min(6, "Enter valid pin code.")
        .max(6, "Enter valid pin code."),
    line: z
        .string({ required_error: "Enter address" })
        .min(4, "Enter valid address"),
});
