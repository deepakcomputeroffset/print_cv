import {
    FILE_UPLOAD_EMAIL_CHARGE,
    IGST_TAX_IN_PERCENTAGE,
} from "@/lib/constants";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import { ProductItemTypeWithAttribute } from "@/types/types";
import {
    cityDiscount,
    customerCategory,
    product,
    UPLOADVIA,
} from "@prisma/client";
import { useCallback, useMemo } from "react";

export const usePricing = (
    product: product & {
        productItems: ProductItemTypeWithAttribute[];
    },
    selectedVariant: ProductItemTypeWithAttribute | null,
    qty: number | null,
    customerCategory: customerCategory | undefined,
    cityDiscount: cityDiscount | null,
    fileOption: UPLOADVIA,
) => {
    const findPrice = useCallback(() => {
        const isTieredPricing = product?.isTieredPricing;
        if (selectedVariant) {
            if (isTieredPricing)
                return selectedVariant?.pricing?.find((v) => v.qty === qty);
            return selectedVariant?.pricing?.[0];
        }
        return null;
    }, [selectedVariant, qty, product]);

    return useMemo(() => {
        if (!selectedVariant) {
            return {
                basePrice: 0,
                uploadCharge: 0,
                igstAmount: 0,
                totalAmount: 0,
            };
        }

        const discountedPrice =
            getPriceAccordingToCategoryOfCustomer(
                customerCategory,
                cityDiscount,
                findPrice()?.price as number,
            ) || 0;

        const priceForItems = product?.isTieredPricing
            ? discountedPrice
            : discountedPrice * ((qty || 0) / (findPrice()?.qty ?? 1));

        const calculatedUploadCharge =
            fileOption === "EMAIL" ? FILE_UPLOAD_EMAIL_CHARGE : 0;

        const subtotal = priceForItems + calculatedUploadCharge;
        const calculatedIgst = subtotal * IGST_TAX_IN_PERCENTAGE;
        const calculatedTotal = subtotal + calculatedIgst;

        return {
            basePrice: priceForItems,
            uploadCharge: calculatedUploadCharge,
            igstAmount: calculatedIgst,
            totalAmount: calculatedTotal,
        };
    }, [
        selectedVariant,
        product,
        qty,
        customerCategory,
        cityDiscount,
        findPrice,
        fileOption,
    ]);
};
