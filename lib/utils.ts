import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z, ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function stringToNumber(value: string): { isNum: boolean; num: number } {
    const num = parseInt(value);
    return isNaN(num) ? { isNum: false, num } : { isNum: true, num };
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

// export const getDirtyFieldsWithValues = <T>(
//     dirtyFields: Partial<Record<keyof T, boolean>>,
//     formValues: T,
// ): Partial<T> => {
//     const dirtyFieldValues: Partial<T> = {};

//     for (const key in dirtyFields) {
//         if (dirtyFields.hasOwnProperty(key)) {
//             if (dirtyFields[key]) {
//                 dirtyFieldValues[key] = formValues[key];
//             }
//         }
//     }

//     return dirtyFieldValues;
// };

// export const getDirtyFieldsWithValues = <T extends ZodSchema>(
//     dirtyFields: Partial<Record<keyof z.infer<T>, any>>, // `any` allows nested objects/arrays
//     formValues: z.infer<T>
// ): Partial<z.infer<T>> => {
//     const dirtyFieldValues: Partial<z.infer<T>> = {};

//     for (const key in dirtyFields) {
//         if (dirtyFields[key]) {
//             if (Array.isArray(dirtyFields[key]) && Array.isArray(formValues[key])) {
//                 // Handle array case
//                 dirtyFieldValues[key] = (dirtyFields[key] as any[]).map((field, index) =>
//                     field ? getDirtyFieldsWithValues(field, (formValues[key] as any[])[index]) : undefined
//                 ).filter(Boolean); // Remove undefined entries
//             } else if (typeof dirtyFields[key] === "object" && typeof formValues[key] === "object") {
//                 // Handle nested object case
//                 dirtyFieldValues[key] = getDirtyFieldsWithValues(dirtyFields[key], formValues[key]);
//             } else {
//                 // Assign primitive values
//                 dirtyFieldValues[key] = formValues[key];
//             }
//         }
//     }

//     return dirtyFieldValues;
// };

// export const getDirtyFieldsWithValues = <T extends ZodSchema>(
//     dirtyFields: Partial<Record<keyof z.infer<T>, any>> | null, // Allow null
//     formValues: z.infer<T> | null, // Allow null
// ): Partial<z.infer<T>> => {
//     if (!dirtyFields || !formValues) return {}; // Return empty object if null

//     const dirtyFieldValues: Partial<z.infer<T>> = {};

//     for (const key in dirtyFields) {
//         if (dirtyFields[key]) {
//             if (
//                 Array.isArray(dirtyFields[key]) &&
//                 Array.isArray(formValues[key])
//             ) {
//                 // Handle arrays: Apply function recursively on each array element
//                 dirtyFieldValues[key] = (dirtyFields[key] as any[])
//                     .map((field, index) =>
//                         field && formValues[key]
//                             ? getDirtyFieldsWithValues(
//                                   field,
//                                   (formValues[key] as any[])[index],
//                               )
//                             : undefined,
//                     )
//                     .filter(Boolean); // Remove undefined entries
//             } else if (
//                 typeof dirtyFields[key] === "object" &&
//                 dirtyFields[key] !== null &&
//                 typeof formValues[key] === "object" &&
//                 formValues[key] !== null
//             ) {
//                 // Handle nested object case
//                 dirtyFieldValues[key] = getDirtyFieldsWithValues(
//                     dirtyFields[key],
//                     formValues[key],
//                 );
//             } else {
//                 // Assign primitive values
//                 dirtyFieldValues[key] = formValues[key];
//             }
//         }
//     }

//     return dirtyFieldValues;
// };

// export const getDirtyFieldsWithValues = <T extends ZodSchema>(
//     dirtyFields: Partial<Record<keyof z.infer<T>, any>> | null, // Allow null
//     formValues: z.infer<T> | null // Allow null
// ): Partial<z.infer<T>> => {
//     if (!dirtyFields || !formValues) return {}; // Return empty object if null

//     const dirtyFieldValues: Partial<z.infer<T>> = {};

//     for (const key in dirtyFields) {
//         if (!dirtyFields[key]) continue; // Skip non-dirty fields

//         const dirtyField = dirtyFields[key];
//         const formValue = formValues[key];

//         if (Array.isArray(dirtyField) && Array.isArray(formValue)) {
//             // ✅ Handle nested arrays and check objects by `id` if present
//             dirtyFieldValues[key] = formValue
//                 .filter((fv) =>
//                     typeof fv === "object" && fv !== null && "id" in fv
//                         ? dirtyField.some((df) => df?.id === fv.id) // Match by `id`
//                         : true // Include if no `id`
//                 )
//                 .map((fv, index) => {
//                     const correspondingDirtyField = dirtyField.find(
//                         (df) => df?.id === fv?.id
//                     );

//                     return correspondingDirtyField
//                         ? getDirtyFieldsWithValues(correspondingDirtyField, fv)
//                         : fv;
//                 });
//         } else if (
//             typeof dirtyField === "object" &&
//             dirtyField !== null &&
//             typeof formValue === "object" &&
//             formValue !== null
//         ) {
//             // ✅ Handle nested objects properly
//             dirtyFieldValues[key] = getDirtyFieldsWithValues(dirtyField, formValue);
//         } else {
//             // ✅ Assign primitive values
//             dirtyFieldValues[key] = formValue;
//         }
//     }

//     return dirtyFieldValues;
// };
