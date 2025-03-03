import { z } from "zod";

export const departmentFormSchema = z.object({
    name: z.string().min(2, "Enter Valid name."),
    description: z.string().min(2, "Enter valid description"),
});
