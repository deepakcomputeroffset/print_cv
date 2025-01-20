import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function stringToNumber(value: string): { isNum: boolean; num: number } {
    const num = parseInt(value);
    return isNaN(num) ? { isNum: false, num } : { isNum: true, num };
}
