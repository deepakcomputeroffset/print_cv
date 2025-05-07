import { z } from "zod";
import { addressSchema } from "./address.form.schema";

// Customer Info Schema
export const customerInfoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    businessName: z
        .string()
        .min(2, "Business name must be at least 2 characters"),
    gstNumber: z.string().optional(),
    phone: z
        .string()
        .min(10, "Enter valid phone number")
        .regex(/^\d{10}$/, "Invalid phone number format. e.g., 1234567890."),
    email: z.string().email("Enter valid email address."),
    referenceId: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    customerCategoryId: z.number().default(1),
});

// Combined Schema
export const customerFormSchema = customerInfoSchema.merge(addressSchema);

export const changePasswordFormSchema = z
    .object({
        oldPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long."),
        confirmPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long."),
    })
    .refine((data) => data.oldPassword !== data.password, {
        path: ["password"],
        message: "New password cannot be the same as the old password",
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });
