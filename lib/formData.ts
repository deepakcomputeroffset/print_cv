import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFormData<T extends Record<string, any>>(
    values: T,
): FormData {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (typeof value === "boolean" || typeof value === "number") {
            formData.append(key, value.toString());
        } else if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, value);
        }
    });

    return formData;
}

// eslint-disable-next-line
export const parseFormData = <T extends z.ZodType<any, any>>(
    formData: FormData,
    schema: T,
): z.SafeParseReturnType<z.infer<T>, z.infer<T>> => {
    const parsedData = Object.fromEntries(
        Array.from(formData.entries()).map(([k, v]) => {
            if (typeof v === "string") {
                if (v === "true") return [k, true];
                if (v === "false") return [k, false];
            }
            return [k, v];
        }),
    );
    return schema.safeParse(parsedData);
};

// eslint-disable-next-line
export const parsePartialFormData = <T extends z.ZodObject<any>>(
    formData: FormData,
    schema: T,
): z.SafeParseReturnType<Partial<z.infer<T>>, Partial<z.infer<T>>> => {
    const parsedData = Object.fromEntries(
        Array.from(formData.entries()).map(([k, v]) => {
            if (typeof v === "string") {
                if (v === "true") return [k, true];
                if (v === "false") return [k, false];
            }
            return [k, v];
        }),
    );

    return schema.partial().safeParse(parsedData);
};
