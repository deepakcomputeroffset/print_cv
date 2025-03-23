"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { productCategory } from "@prisma/client";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { ProductCategoryCard } from "./Product-category-card";

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

    return (
        <div className="flex flex-col space-y-12 md:space-y-20">
            <motion.div
                initial={{ opacity: 0, translateY: 20 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
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
                    <motion.div
                        className="flex justify-center mt-8"
                        initial={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            href="/categories"
                            className="flex items-center text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">
                                Back to all categories
                            </span>
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {categories.map((category, index) => (
                    <ProductCategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        onClick={() => handleCategoryClick(category)}
                    />
                ))}
            </div>
        </div>
    );
};
