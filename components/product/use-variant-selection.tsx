import { ProductItemTypeWithAttribute } from "@/types/types";
import { product } from "@prisma/client";
import getDistinctOptionsWithDetails from "./getAttributeWithOptions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getBaseVarient } from "./getBaseVarient";

export const useVariantSelection = (
    product: product & {
        productItems: ProductItemTypeWithAttribute[];
    },
    distinctAttributeWithOptions: ReturnType<
        typeof getDistinctOptionsWithDetails
    >,
) => {
    const baseVariant = useMemo(
        () =>
            getBaseVarient(distinctAttributeWithOptions, product.productItems),
        [distinctAttributeWithOptions, product.productItems],
    );
    const [selectedAttributes, setSelectedAttributes] =
        useState<Record<number, number>>(baseVariant);
    const [selectedVariant, setSelectedVariant] =
        useState<ProductItemTypeWithAttribute | null>(null);

    /**
     * When the product or available options change, reset the selected attributes
     * to the computed base variant so the UI reflects the new product immediately.
     */
    useEffect(() => {
        setSelectedAttributes(baseVariant);
    }, [baseVariant]);

    const findVariant = useCallback(() => {
        return product.productItems.find((item) =>
            Object.entries(selectedAttributes).every(([typeId, valueId]) =>
                item.productAttributeOptions.some(
                    (opt) =>
                        opt.productAttributeType.id === parseInt(typeId) &&
                        opt.id === valueId,
                ),
            ),
        );
    }, [selectedAttributes, product.productItems]);

    useEffect(() => {
        const variant = findVariant();
        if (variant) {
            setSelectedVariant(variant);
        }
    }, [selectedAttributes, findVariant]);

    const handleAttributeChange = (typeId: number, valueId: number) => {
        setSelectedAttributes((prev) => ({ ...prev, [typeId]: valueId }));
    };

    return {
        selectedAttributes,
        selectedVariant,
        handleAttributeChange,
    };
};
