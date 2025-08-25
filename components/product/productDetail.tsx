"use client";

import { useState } from "react";
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
import ProductFeatures from "./ProductFeature";
import TrustIndicators from "./TrustIndicator";
import ProductDescription from "./ProductDescription";
import PriceBreakdown from "./PriceBreakdown";
import SelectedConfiguration from "./SelectedConfiguration";
import ProductOptions from "./ProductOptions";
import ProductHeader from "./ProductHeader";
import { AxiosError } from "axios";
import { usePricing } from "./use-pricing";
import { useVariantSelection } from "./use-variant-selection";

// Types
interface ProductDetailsProps {
    product: product & {
        productItems: ProductItemTypeWithAttribute[];
    };
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
    product,
    cityDiscount,
    customer,
}: ProductDetailsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [qty, setQty] = useState<number | null>(null);
    const [fileOption, setFileOption] = useState<UPLOADVIA>("UPLOAD");

    const router = useRouter();
    const distinctAttributeWithOptions = getDistinctOptionsWithDetails(product);

    const { selectedAttributes, selectedVariant, handleAttributeChange } =
        useVariantSelection(product, distinctAttributeWithOptions);

    const { basePrice, uploadCharge, igstAmount, totalAmount } = usePricing(
        product,
        selectedVariant,
        qty,
        customer?.customerCategory,
        cityDiscount,
        fileOption,
    );

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
                router.push(`/customer/orders/file-upload/?orderId=${res?.data?.id}`);
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
                <ProductHeader product={product} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images Carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-3"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-primary/10 bg-white relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary z-10"></div>
                            <EmblaCarousel slides={product.imageUrl} />
                        </div>
                    </motion.div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-5"
                    >
                        <ProductHeader product={product} isCompact />

                        {/* Product Options Selection */}
                        <div className="space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <span className="inline-block h-3 w-1 bg-gradient-to-b from-primary to-cyan-500 rounded-full mr-2"></span>
                                Product Configuration
                            </h3>

                            <ProductOptions
                                distinctAttributeWithOptions={
                                    distinctAttributeWithOptions
                                }
                                selectedAttributes={selectedAttributes}
                                onAttributeChange={handleAttributeChange}
                                product={product}
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
                    <ProductFeatures />
                    <ProductDescription description={product.description} />
                    <TrustIndicators />
                </motion.div>
            </div>
        </div>
    );
}
