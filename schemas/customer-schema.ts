import { z } from "zod";

export const customerFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    business_name: z
        .string()
        .min(2, "Business name must be atleast 2 characters"),

    country: z.string({
        required_error: "Select country",
    }),
    state: z.string({
        required_error: "Select state",
    }),
    city: z.string({
        required_error: "Select city",
    }),
    pin_code: z
        .string({ required_error: "Enter pin code." })
        .min(6, "Enter valid pin code.")
        .max(6, "Enter valid pin code."),

    gst_number: z.string().optional(),

    line: z
        .string({ required_error: "Enter address" })
        .min(4, "Enter valid address"),

    phone: z
        .string()
        .min(10, "Enter valid phone number")
        .regex(/^\d{1,10}$/, "Invalid phone number format. e.g., 1234567890."),
    email: z.string().email("Enter valid email address."),
    reference_id: z.string().optional(),

    password: z.string().min(8, "Password must be at least 8 characters long."),
});
