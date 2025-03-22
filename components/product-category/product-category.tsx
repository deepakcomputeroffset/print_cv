"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { productCategory } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

type productCategoryType = productCategory & {
    _count: {
        subCategories: number;
    };
    parentCategory: productCategory | null;
};

export const ProductCategoryList = ({
    categories,
}: {
    categories: productCategoryType[];
}) => {
    const router = useRouter();
    const { setParam } = useUrlFilters();

    const handleCategoryClick = (category: productCategoryType) => {
        if (category?._count?.subCategories > 0) {
            setParam("parentCategoryId", category?.id.toString());
        } else {
            router.push(`/products?categoryId=${category.id}`);
        }
    };

    // CategoryCard component defined inside the parent component to access the required context
    const CategoryCard = ({
        category,
        onClick,
    }: {
        category: productCategoryType;
        onClick: () => void;
    }) => {
        return (
            <div className="h-full">
                <Card
                    className={cn(
                        "bg-white transition-all duration-300 overflow-hidden relative h-full border-0 rounded-2xl shadow-md hover:shadow-xl",
                        category.isAvailable
                            ? "cursor-pointer group hover:-translate-y-2"
                            : "cursor-not-allowed opacity-80",
                    )}
                    onClick={category.isAvailable ? onClick : undefined}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative h-60 w-full overflow-hidden">
                        {/* Premium gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5 z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-black/10 z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-300"></div>

                        {/* Subtle texture overlay */}
                        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.03] mix-blend-overlay z-10"></div>

                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                            style={{
                                backgroundImage: `url(${category.imageUrl || "/placeholder-image.jpg"})`,
                                transformOrigin: "center",
                            }}
                        />

                        {/* Category name overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                            <h3 className="text-2xl font-bold text-white drop-shadow-md mb-2 transition-transform duration-300 ease-out group-hover:-translate-y-1">
                                {category.name}
                            </h3>

                            {category.isAvailable && (
                                <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    {category._count.subCategories > 0
                                        ? `Explore ${category._count.subCategories} subcategories`
                                        : "View available products"}
                                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-70" />
                                </div>
                            )}
                        </div>

                        {/* Interactive accent elements */}
                        {category.isAvailable && (
                            <>
                                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ChevronRight className="h-5 w-5 text-white" />
                                </div>
                                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-all duration-300 z-10 rounded-2xl"></div>
                            </>
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-1 w-8 bg-gradient-to-r from-primary to-cyan-400 rounded-full"></div>
                                <div className="text-sm text-gray-500 font-medium">
                                    {category._count.subCategories > 0
                                        ? `${category._count.subCategories} subcategories`
                                        : "Direct products"}
                                </div>
                            </div>

                            {category.isAvailable && (
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 text-sm">
                            {category.isAvailable
                                ? "Click to explore this category"
                                : "This category will be available soon"}
                        </p>
                    </div>

                    {!category.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 shadow-lg">
                                <span className="text-white font-semibold tracking-wide">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    return (
        <div className="flex flex-col space-y-12 md:space-y-20">
            <div
                className={cn(
                    "text-center max-w-3xl mx-auto",
                    sourceSerif4.className,
                )}
            >
                {/* Decorative accent */}
                <div className="flex justify-center mb-6">
                    <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 rounded-full opacity-80"></div>
                </div>

                <div className="inline-flex items-center justify-center mb-5">
                    <div className="h-px w-10 bg-primary/30"></div>
                    <span className="mx-4 text-primary font-medium text-sm uppercase tracking-wider">
                        {!!categories?.[0]?.parentCategory
                            ? "Sub-categories"
                            : "Explore Categories"}
                    </span>
                    <div className="h-px w-10 bg-primary/30"></div>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                    {!!categories?.[0]?.parentCategory ? (
                        <span>
                            {categories[0].parentCategory.name}{" "}
                            <span className="text-primary relative inline-block">
                                Solutions
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                            </span>
                        </span>
                    ) : (
                        <span>
                            Premium{" "}
                            <span className="text-primary relative inline-block">
                                Printing Categories
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                            </span>
                        </span>
                    )}
                </h2>

                <p className="text-gray-600 md:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                    {!!categories?.[0]?.parentCategory
                        ? `Discover our specialized ${categories[0].parentCategory.name.toLowerCase()} solutions tailored to meet your precise printing requirements.`
                        : "Explore our comprehensive range of professional printing services designed for businesses and individuals seeking exceptional quality."}
                </p>

                {categories[0]?.parentCategory !== null && (
                    <div className="flex justify-center mt-8">
                        <Link
                            href="/categories"
                            className="flex items-center text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">
                                Back to all categories
                            </span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onClick={() => handleCategoryClick(category)}
                    />
                ))}
            </div>
        </div>
    );
};
