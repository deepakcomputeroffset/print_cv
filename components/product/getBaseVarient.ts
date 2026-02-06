import {
    productAttributeWithOptions,
    ProductItemTypeWithAttribute,
} from "@/types/types";

export const getBaseVarient = (
    distinctAttributeWithOptions: productAttributeWithOptions[],
    productItems?: ProductItemTypeWithAttribute[],
) => {
    // If there's a default variant, derive selections from it
    if (productItems) {
        const defaultItem = productItems.find((item) => item.isDefault);
        if (defaultItem) {
            const baseVariant: Record<number, number> = {};
            defaultItem.productAttributeOptions.forEach((opt) => {
                baseVariant[opt.productAttributeType.id] = opt.id;
            });
            return baseVariant;
        }
    }

    // Fallback: pick the first option of each attribute type
    const baseVariant: Record<number, number> = {};
    distinctAttributeWithOptions.forEach((attr) => {
        if (attr.productAttributeOptions.length > 0) {
            baseVariant[attr.id] = attr.productAttributeOptions?.[0]?.id;
        }
    });

    return baseVariant;
};
