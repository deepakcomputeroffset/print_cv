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
     * Reset `selectedAttributes` to the computed `baseVariant` when the
     * product's available options change (for example, when a different
     * product is loaded). This ensures the UI reflects the new product's
     * default configuration.
     *
     * Do NOT reset when the user updates `selectedAttributes` — doing so would
     * immediately overwrite user selections and prevent changes from sticking.
     *
     * To avoid unnecessary updates and render loops, the effect compares
     * numeric `typeId`/`optionId` pairs rather than relying on object identity.
     */
    useEffect(() => {
        const basePairs = Object.entries(baseVariant).map(
            ([typeIdStr, optionId]) => [Number(typeIdStr), Number(optionId)],
        ) as [number, number][];

        if (basePairs.length === 0) return;

        const isMatching = basePairs.every(([typeId, optionId]) => {
            return selectedAttributes[typeId] === optionId;
        });

        if (!isMatching) {
            setSelectedAttributes(baseVariant);
        }
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
        if (variant && variant.id !== selectedVariant?.id) {
            setSelectedVariant(variant);
        }
    }, [selectedAttributes, findVariant, selectedVariant]);

    const handleAttributeChange = (typeId: number, valueId: number) => {
        setSelectedAttributes((prev) => ({ ...prev, [typeId]: valueId }));
    };

    return {
        selectedAttributes,
        selectedVariant,
        handleAttributeChange,
    };
};
