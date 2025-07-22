"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    ShoppingCart,
    Package,
    Truck,
    Shield,
    Check,
    Star,
    Award,
    Sparkles,
    ThumbsUp,
} from "lucide-react";
import EmblaCarousel from "@/components/ui/embla-carousel/js/EmblaCarousel";
import getDistinctOptionsWithDetails from "@/components/product/getAttributeWithOptions";
import { useRouter } from "next/navigation";
import { getBaseVarient } from "@/components/product/getBaseVarient";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cityDiscount, customerCategory, product } from "@prisma/client";
import { ProductItemTypeWithAttribute } from "@/types/types";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import { toast } from "sonner";

export default function ProductDetails({
    product,
    cityDiscount,
    customerCategory,
}: {
    product: product & {
        productItems: ProductItemTypeWithAttribute[];
    };
    cityDiscount: cityDiscount | null;
    customerCategory: customerCategory;
}) {
    const distinctAttributeWithOptions = getDistinctOptionsWithDetails(product);

    const [selectedAttributes, setSelectedAttributes] = useState<
        Record<number, number>
    >(getBaseVarient(distinctAttributeWithOptions));
    const [selectedVariant, setSelectedVariant] =
        useState<ProductItemTypeWithAttribute | null>(null);
    const router = useRouter();
    const [qty, setQty] = useState<number | null>(null);

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
    }, [selectedAttributes, product]);

    const findPrice = useCallback(() => {
        const isTieredPricing = product?.isTieredPricing;
        if (selectedVariant) {
            if (isTieredPricing)
                return selectedVariant?.pricing?.find((v) => v.qty === qty);
            return selectedVariant?.pricing?.[0];
        }
        return null;
    }, [selectedVariant, qty]);

    useEffect(() => {
        const variant = findVariant();
        if (variant) {
            setSelectedVariant(variant);
        }
    }, [selectedAttributes, findVariant, qty]);

    const handleAttributeChange = (typeId: number, valueId: number) => {
        setSelectedAttributes((prev) => ({ ...prev, [typeId]: valueId }));
    };

    const handleBuy = async () => {
        if (!selectedVariant) return toast.message("Select all options.");
        if (!qty) return toast.message("Select Quantity.");
        router.push(
            `/customer/orders/place?productItemId=${selectedVariant?.id}&qty=${qty ?? 0}`,
        );
    };

    return (
        <div className="relative bg-gradient-to-b from-background to-blue-50/30 py-3">
            <div className="container mx-auto px-4 md:px-8">
                {/* Breadcrumb Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                >
                    <Breadcrumb className="mb-3">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/"
                                    className="cursor-pointer text-gray-600 hover:text-primary"
                                >
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/categories"
                                    className="cursor-pointer text-gray-600 hover:text-primary"
                                >
                                    Categories
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href={`/products?categoryId=${product.categoryId}`}
                                    className="cursor-pointer text-gray-600 hover:text-primary"
                                >
                                    Products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-primary font-medium">
                                    {product.name}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images Carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-3"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-primary/10 bg-white relative group">
                            {/* Premium badge */}
                            {/* <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
                                <Award className="w-3 h-3 mr-1" />
                                PREMIUM
                            </div> */}

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
                        {/* Product Title */}
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                <span className="text-xs text-primary font-medium uppercase tracking-wider">
                                    Premium Product
                                </span>
                            </div>

                            <h1
                                className={cn(
                                    "text-xl md:text-2xl font-bold mb-3 ml leading-tight",
                                    sourceSerif4.className,
                                )}
                            >
                                <span className="text-gray-800">
                                    {product.name}
                                </span>
                            </h1>

                            {/* Quick highlights */}
                            {/* <div className="flex flex-wrap gap-2 mb-3">
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 text-primary border-primary/20 rounded-full font-normal text-xs"
                                >
                                    <Clock className="w-3 h-3 mr-1" /> Fast Delivery
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 text-primary border-primary/20 rounded-full font-normal text-xs"
                                >
                                    <ThumbsUp className="w-3 h-3 mr-1" /> Top Quality
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="bg-primary/5 text-primary border-primary/20 rounded-full font-normal text-xs"
                                >
                                    <Check className="w-3 h-3 mr-1" /> In Stock
                                </Badge>
                            </div> */}
                        </div>

                        {/* Product Options Selection */}
                        <div className="space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <span className="inline-block h-3 w-1 bg-gradient-to-b from-primary to-cyan-500 rounded-full mr-2"></span>
                                Product Configuration
                            </h3>

                            {distinctAttributeWithOptions.map((type) => (
                                <div key={type.id}>
                                    <label className="text-xs font-medium mb-1 block text-gray-700">
                                        {type.name}
                                    </label>
                                    <Select
                                        value={selectedAttributes[
                                            type.id
                                        ]?.toString()}
                                        onValueChange={(value) =>
                                            handleAttributeChange(
                                                type.id,
                                                parseInt(value),
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9">
                                            <SelectValue
                                                placeholder={`Select ${type.name}`}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {type?.productAttributeOptions?.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.id}
                                                        value={opt?.id?.toString()}
                                                    >
                                                        {
                                                            opt?.productAttributeValue
                                                        }
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}

                            <div>
                                <label className="text-xs font-medium mb-1 block text-gray-700">
                                    Quantity
                                </label>
                                {product?.isTieredPricing ? (
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={qty?.toString() ?? ""}
                                            onValueChange={(value) =>
                                                setQty(Number(value))
                                            }
                                        >
                                            <SelectTrigger className="w-full border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9">
                                                <SelectValue
                                                    placeholder={`Select Qty`}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {product?.productItems?.[0]?.pricing?.map(
                                                    (pricing) => (
                                                        <SelectItem
                                                            key={pricing.id}
                                                            value={pricing?.qty?.toString()}
                                                        >
                                                            {pricing?.qty}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={
                                                selectedVariant?.pricing?.[0]
                                                    ?.qty
                                            }
                                            value={qty ?? ""}
                                            step={
                                                selectedVariant?.pricing?.[0]
                                                    ?.qty
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Allow empty string (for clearing/typing)
                                                if (value === "") {
                                                    setQty(null);
                                                    return;
                                                }

                                                // Convert to number and update
                                                const numValue =
                                                    parseInt(value);
                                                if (!isNaN(numValue)) {
                                                    setQty(numValue);
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Validate and adjust to nearest valid step on blur
                                                const inputValue = parseInt(
                                                    e.target.value,
                                                );
                                                const minQty =
                                                    selectedVariant
                                                        ?.pricing?.[0]?.qty ||
                                                    1;

                                                if (
                                                    e.target.value === "" ||
                                                    inputValue < minQty
                                                ) {
                                                    setQty(minQty);
                                                    toast.message(
                                                        `Minimum quantity is ${minQty}`,
                                                    );
                                                } else {
                                                    // Round to nearest multiple of minQty
                                                    const validQty =
                                                        Math.round(
                                                            inputValue / minQty,
                                                        ) * minQty;
                                                    if (
                                                        validQty !== inputValue
                                                    ) {
                                                        setQty(validQty);
                                                        toast.message(
                                                            `Quantity adjusted to nearest multiple: ${validQty}`,
                                                        );
                                                    }
                                                }
                                            }}
                                            className="w-24 border-primary/20 focus:ring-primary/30 focus:border-primary/40 bg-white h-9 text-sm"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Min:{" "}
                                            {selectedVariant?.pricing?.[0]?.qty}{" "}
                                            (in multiples of{" "}
                                            {selectedVariant?.pricing?.[0]?.qty}
                                            )
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all"
                                    onClick={handleBuy}
                                    disabled={!selectedVariant}
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Buy Now
                                </Button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-primary/5 to-cyan-500/5 p-2 px-4 rounded-xl border border-primary/10 relative">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1 px-2 rounded-full shadow-md transform rotate-3">
                                    SALE
                                </div>
                            </div>

                            <div className="flex items-baseline gap-3">
                                <span className="text-lg font-bold text-gray-800">
                                    ₹
                                    {selectedVariant &&
                                        (product?.isTieredPricing
                                            ? getPriceAccordingToCategoryOfCustomer(
                                                  customerCategory,
                                                  cityDiscount,
                                                  findPrice()?.price as number,
                                              ).toFixed(2) || 0
                                            : findPrice()?.qty &&
                                              qty &&
                                              (
                                                  getPriceAccordingToCategoryOfCustomer(
                                                      customerCategory,
                                                      cityDiscount,
                                                      findPrice()
                                                          ?.price as number,
                                                  ) *
                                                  (qty /
                                                      (findPrice()?.qty ?? 0))
                                              ).toFixed(2))}
                                </span>
                            </div>
                        </div>

                        {/* Selected Options Summary */}
                        {selectedVariant && (
                            <Card className="bg-white shadow-md border-0 rounded-xl overflow-hidden">
                                <div className="p-4">
                                    <h3 className="font-semibold mb-3 flex items-center text-gray-800 text-sm">
                                        <Check className="w-4 h-4 mr-2 text-primary" />
                                        Selected Configuration
                                    </h3>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {selectedVariant.productAttributeOptions.map(
                                            (opt) => (
                                                <div
                                                    key={opt.id}
                                                    className="flex items-center gap-1"
                                                >
                                                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                                                    <span className="text-gray-500 capitalize text-xs">
                                                        {
                                                            opt
                                                                .productAttributeType
                                                                .name
                                                        }
                                                        :
                                                    </span>
                                                    <span className="font-medium text-xs text-gray-800">
                                                        {
                                                            opt.productAttributeValue
                                                        }
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                        <div className="flex items-center gap-1">
                                            <div className="h-1 w-1 rounded-full bg-primary"></div>
                                            <span className="text-gray-500 text-xs">
                                                SKU:
                                            </span>
                                            <span className="font-medium text-xs text-gray-800">
                                                {selectedVariant.sku}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-1 w-1 rounded-full bg-primary"></div>
                                            <span className="text-gray-500 text-xs">
                                                Quantity:
                                            </span>
                                            <span className="font-medium text-xs text-gray-800">
                                                {qty} units
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
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
                    {/* Product Features */}
                    <div>
                        <div className="text-center mb-6">
                            <h2
                                className={cn(
                                    "text-xl font-bold relative inline-block",
                                    sourceSerif4.className,
                                )}
                            >
                                <span className="relative z-10">
                                    Premium Features
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-cyan-500/30"></span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-4 border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden group">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <Package className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors text-sm">
                                            Premium Quality
                                        </h3>
                                        <p className="text-gray-500 text-xs">
                                            High-quality materials and attention
                                            to detail.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden group">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <Truck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors text-sm">
                                            Fast Delivery
                                        </h3>
                                        <p className="text-gray-500 text-xs">
                                            Quick processing within 3-5 business
                                            days.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden group">
                                <div className="flex items-start gap-3">
                                    <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors text-sm">
                                            Satisfaction Guarantee
                                        </h3>
                                        <p className="text-gray-500 text-xs">
                                            100% money-back guarantee on all
                                            products.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="bg-white shadow-md rounded-xl overflow-hidden border-0">
                        <div className="border-b border-gray-100 px-4 py-3">
                            <h2
                                className={cn(
                                    "text-lg font-bold text-gray-800",
                                    sourceSerif4.className,
                                )}
                            >
                                Product Description
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="prose prose-sm prose-gray max-w-none prose-headings:font-semibold prose-h3:text-primary">
                                <Markdown>{product.description}</Markdown>
                            </div>
                        </div>
                    </div>

                    {/* Trust indicators */}
                    <div className="bg-gradient-to-r from-primary/5 to-cyan-500/5 rounded-xl p-4 border border-primary/10">
                        <div className="max-w-2xl mx-auto text-center">
                            <h3
                                className={cn(
                                    "text-lg font-bold mb-4",
                                    sourceSerif4.className,
                                )}
                            >
                                Why Choose Our Premium Printing
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                        <Award className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">
                                        Award Winning
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                        <Star className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">
                                        10+ Years Experience
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                        <ThumbsUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">
                                        5000+ Happy Clients
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">
                                        Premium Quality
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
