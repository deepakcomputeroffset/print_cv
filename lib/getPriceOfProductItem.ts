import { product_item } from "@prisma/client";
import { Session } from "next-auth";

export function getPriceAccordingToCategoryOfCustomer(
    session: Session,
    productItem: product_item,
): number {
    switch (session?.user?.customer?.customer_category) {
        case "LOW":
            return productItem?.max_price;
        case "MEDIUM":
            return productItem?.avg_price;
        case "HIGH":
            return productItem?.min_price;
    }
}
