import { productItem } from "@prisma/client";
import { Session } from "next-auth";

export function getPriceAccordingToCategoryOfCustomer(
    session: Session,
    productItem: productItem,
): number {
    switch (session?.user?.customer?.customerCategory) {
        case "LOW":
            return productItem?.maxPrice;
        case "MEDIUM":
            return productItem?.avgPrice;
        case "HIGH":
            return productItem?.minPrice;
    }
}
