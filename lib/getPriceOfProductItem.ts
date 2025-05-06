import { cityDiscount, customerCategory } from "@prisma/client";

export function getPriceAccordingToCategoryOfCustomer(
    customerCategory: customerCategory,
    cityDiscount: cityDiscount | null,
    price: number,
): number {
    if (cityDiscount) {
        return price - (price * cityDiscount.discount) / 100;
    }
    return price - (price * customerCategory.discount) / 100;
}
