import { productAttributeWithOptions } from "@/types/types";

export const getBaseVarient = (
    distinctAttributeWithOptions: productAttributeWithOptions[],
) => {
    const baseVariant: Record<number, number> = {};
    distinctAttributeWithOptions.forEach((attr) => {
        if (attr.product_attribute_options.length > 0) {
            baseVariant[attr.id] = attr.product_attribute_options?.[0]?.id;
        }
    });

    return baseVariant;
};
