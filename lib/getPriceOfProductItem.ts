import { cityDiscount, customerCategory } from "@prisma/client";

export function getPriceAccordingToCategoryOfCustomer(
    customerCategory: customerCategory | null | undefined,
    cityDiscount: Pick<cityDiscount, "id" | "discount"> | null,
    price: number,
): number {
    // Early return if no discounts apply
    if (!cityDiscount && !customerCategory) return price;

    // Calculate the highest applicable discount
    const cityDiscountValue = cityDiscount ? cityDiscount.discount : 0;
    const categoryDiscountValue = customerCategory
        ? customerCategory.discount
        : 0;
    const maxDiscount = Math.max(cityDiscountValue, categoryDiscountValue);

    return price - (price * maxDiscount) / 100;
}
