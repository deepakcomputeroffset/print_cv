"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { ProductCategoryCard } from "./Product-category-card";
import ProductCategoryHeader from "./product-category-header";
import { productCategoryType } from "@/types/types";

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

    return (
        <div className="flex flex-col space-y-12 md:space-y-20">
            <ProductCategoryHeader category={categories[0]} />

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
