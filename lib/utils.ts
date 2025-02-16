import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getDirtyFieldsWithValues = <T extends ZodSchema>(
    dirtyFields: Partial<
        Record<keyof z.infer<T>, boolean | object | boolean[]>
    > | null, // Allow null
    formValues: z.infer<T> | null, // Allow null
): Partial<z.infer<T>> => {
    if (!dirtyFields || !formValues) return {}; // Return empty object if null

    const dirtyFieldValues: Partial<z.infer<T>> = {};

    for (const key in dirtyFields) {
        if (!dirtyFields[key]) continue; // Skip non-dirty fields

        const dirtyField = dirtyFields[key];
        const formValue = formValues[key];

        if (Array.isArray(dirtyField) && Array.isArray(formValue)) {
            // ✅ Handle nested arrays properly
            dirtyFieldValues[key] = dirtyField
                .map((field, index) =>
                    field
                        ? getDirtyFieldsWithValues(field, formValue[index])
                        : undefined,
                )
                .filter((item) => item !== undefined); // Remove undefined values
        } else if (
            typeof dirtyField === "object" &&
            dirtyField !== null &&
            typeof formValue === "object" &&
            formValue !== null
        ) {
            // ✅ Handle nested objects properly
            dirtyFieldValues[key] = getDirtyFieldsWithValues(
                dirtyField,
                formValue,
            );
        } else {
            // ✅ Assign primitive values
            dirtyFieldValues[key] = formValue;
        }
    }

    return dirtyFieldValues;
};
