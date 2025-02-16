import { productAttributeWithOptions } from "@/types/types";

export const getBaseVarient = (
    distinctAttributeWithOptions: productAttributeWithOptions[],
) => {
    const baseVariant: Record<number, number> = {};
    distinctAttributeWithOptions.forEach((attr) => {
        if (attr.productAttributeOptions.length > 0) {
            baseVariant[attr.id] = attr.productAttributeOptions?.[0]?.id;
        }
    });

    return baseVariant;
};
