"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

// Types
import { addressType, ProductItemTypeWithAttribute } from "@/types/types";
import {
    cityDiscount,
    customer,
    customerCategory,
    product,
    UPLOADVIA,
} from "@prisma/client";

// Components
import { Button } from "@/components/ui/button";

import EmblaCarousel from "@/components/ui/embla-carousel/js/EmblaCarousel";
import getDistinctOptionsWithDetails from "@/components/product/getAttributeWithOptions";
import { createOrder } from "@/lib/api/order";

// Custom Components
import ProductFeatures from "@/components/product/ProductFeature";
import TrustIndicators from "@/components/product/TrustIndicator";
import ProductDescription from "@/components/product/ProductDescription";
import PriceBreakdown from "@/components/product/PriceBreakdown";
import SelectedConfiguration from "@/components/product/SelectedConfiguration";
import ProductOptions from "@/components/product/ProductOptions";
import ProductHeader from "@/components/product/ProductHeader";
import { AxiosError } from "axios";
import { usePricing } from "@/components/product/use-pricing";
import { useVariantSelection } from "@/components/product/use-variant-selection";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
type productType = product & {
    productItems: ProductItemTypeWithAttribute[];
};
interface ProductDetailsProps {
    products: productType[];
    initialProductId?: string | null;
    cityDiscount: cityDiscount | null;
    customer?: Omit<
        customer,
        "createdAt" | "gstNumber" | "password" | "referenceId" | "updatedAt"
    > & {
        wallet?: { id: number; balance: number };
        customerCategory: customerCategory;
        address?: addressType;
    };
}

// Main Component
export default function ProductDetails({
    products,
    initialProductId,
    cityDiscount,
    customer,
}: ProductDetailsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [qty, setQty] = useState<number | null>(null);
    const [fileOption, setFileOption] = useState<UPLOADVIA>("UPLOAD");
    const router = useRouter();
    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        initialProductId ?? products?.[0]?.id?.toString() ?? null,
    );

    const selectedProduct: productType = useMemo(() => {
        if (!selectedProductId) {
            return products[0];
        }
        return (
            products.find((p) => p.id === parseInt(selectedProductId)) ??
            products[0]
        );
    }, [selectedProductId, products]);

    const distinctAttributeWithOptions = useMemo(
        () => getDistinctOptionsWithDetails(selectedProduct),
        [selectedProduct],
    );

    const { selectedAttributes, selectedVariant, handleAttributeChange } =
        useVariantSelection(selectedProduct, distinctAttributeWithOptions);

    const { basePrice, uploadCharge, igstAmount, totalAmount } = usePricing(
        selectedProduct,
        selectedVariant,
        qty,
        customer?.customerCategory,
        cityDiscount,
        fileOption,
    );

    const defaultQtyHandler = useCallback(
        (variant: ProductItemTypeWithAttribute | null) => {
            if (variant && !selectedProduct.isTieredPricing) {
                setQty(variant.pricing[0]?.qty || 0);
            } else {
                setQty(null);
            }
        },
        [selectedVariant, selectedProduct],
    );

    useEffect(() => {
        defaultQtyHandler(selectedVariant);
    }, [selectedVariant, defaultQtyHandler]);

    const handleBuy = async () => {
        try {
            if (!selectedVariant) return toast.message("Select all options.");
            if (!qty) return toast.message("Select Quantity.");
            if (!customer) return router.push("/login");

            const { data: res } = await createOrder({
                productItemId: selectedVariant.id,
                fileOption,
                qty: qty,
            });

            if (res?.success) {
                toast.success(res?.message);
                router.push(
                    `/customer/orders/file-upload/?orderId=${res?.data?.id}`,
                );
            } else {
                toast.warning(res.message);
            }
        } catch (error) {
            toast.warning(
                error instanceof AxiosError
                    ? error.response?.data?.error
                    : "Order not placed.",
            );
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-gradient-to-b from-background to-blue-50/30 py-3">
            <div className="container mx-auto px-4 md:px-8">
                <ProductHeader
                    product={selectedProduct}
                    isProductPage={false}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-5 order-2 lg:order-1"
                    >
                        {/* <ProductHeader product={selectedProduct} isCompact /> */}

                        {/* Product Options Selection */}
                        <div className="space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <div>
                                <label className="text-xs font-medium mb-1 block text-gray-700">
                                    Products
                                </label>
                                <Select
                                    value={selectedProductId ?? undefined}
                                    onValueChange={(v) => {
                                        setSelectedProductId(v);
                                    }}
                                >
                                    <SelectTrigger className="w-full border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9">
                                        <SelectValue
                                            placeholder={`Select Product`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((opt) => (
                                            <SelectItem
                                                key={opt.id}
                                                value={opt.id.toString()}
                                            >
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <span className="inline-block h-3 w-1 bg-gradient-to-b from-primary to-cyan-500 rounded-full mr-2"></span>
                                Product Configuration
                            </h3> */}

                            <ProductOptions
                                distinctAttributeWithOptions={
                                    distinctAttributeWithOptions
                                }
                                selectedAttributes={selectedAttributes}
                                onAttributeChange={handleAttributeChange}
                                product={selectedProduct}
                                qty={qty}
                                onQtyChange={setQty}
                                selectedVariant={selectedVariant}
                                fileOption={fileOption}
                                onFileOptionChange={setFileOption}
                            />

                            <PriceBreakdown
                                basePrice={basePrice}
                                uploadCharge={uploadCharge}
                                igstAmount={igstAmount}
                                totalAmount={totalAmount}
                            />

                            {/* Action Button */}
                            <div className="pt-2">
                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all"
                                    onClick={handleBuy}
                                    disabled={!selectedVariant || isLoading}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Buy Now
                                </Button>
                            </div>
                        </div>

                        {/* Selected Options Summary */}
                        {selectedVariant && (
                            <SelectedConfiguration
                                selectedVariant={selectedVariant}
                                qty={qty}
                            />
                        )}
                    </motion.div>

                    {/* Product Images Carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-3 order-1 lg:order-2"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-primary/10 bg-white relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary z-10"></div>
                            <EmblaCarousel slides={selectedProduct.imageUrl} />
                        </div>
                    </motion.div>
                </div>

                {/* Product Features and Description */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-8 space-y-6"
                >
                    <ProductDescription
                        description={selectedProduct.description}
                    />
                    <ProductFeatures />
                    <TrustIndicators />
                </motion.div>
            </div>
        </div>
    );
}
