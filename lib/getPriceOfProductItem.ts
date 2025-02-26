import { CUSTOMER_CATEGORY } from "@prisma/client";

export function getPriceAccordingToCategoryOfCustomer(
    customerCategory: CUSTOMER_CATEGORY,
    prices: { maxPrice: number; avgPrice: number; minPrice: number },
): number {
    switch (customerCategory) {
        case "LOW":
            return prices?.maxPrice;
        case "MEDIUM":
            return prices?.avgPrice;
        case "HIGH":
            return prices?.minPrice;
        default:
            return prices?.maxPrice;
    }
}
