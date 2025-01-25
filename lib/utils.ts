import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function stringToNumber(value: string): { isNum: boolean; num: number } {
    const num = parseInt(value);
    return isNaN(num) ? { isNum: false, num } : { isNum: true, num };
}

export const getDirtyFieldsWithValues = <T>(
    dirtyFields: Partial<Record<keyof T, boolean>>,
    formValues: T,
): Partial<T> => {
    const dirtyFieldValues: Partial<T> = {};

    for (let field in dirtyFields) {
        if (dirtyFields.hasOwnProperty(field)) {
            const key = field as keyof T;

            if (dirtyFields[key]) {
                dirtyFieldValues[key] = formValues[key];
            }
        }
    }

    return dirtyFieldValues;
};
