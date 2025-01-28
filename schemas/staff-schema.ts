import { ROLE } from "@prisma/client";
import { z } from "zod";

export const staffFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Enter valid email address."),
    phone: z
        .string()
        .min(10, "Enter valid phone number")
        .regex(
            /^\d{1,10}$/,
            "Invalid phone number format. Include country code, e.g., +1234567890.",
        ),
    role: z.nativeEnum(ROLE, { message: "Invalid role." }),
    password: z.string().min(8, "Password must be at least 8 characters long."),
});
