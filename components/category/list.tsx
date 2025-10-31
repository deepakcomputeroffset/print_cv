"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CategoryCard } from "./card";
import Header from "./header";
import { productCategoryType } from "@/types/types";

export const ProductCategories = ({
    categories,
}: {
    categories: productCategoryType[];
}) => {
    const router = useRouter();

    const handleCategoryClick = (category: productCategoryType) => {
        if (category?._count?.subCategories > 0) {
            router.push(`/categories/${category.id}`);
        } else if (category?.isList) {
            router.push(`/customer/products/list/${category.id}`);
        } else {
            router.push(`/customer/products?categoryId=${category.id}`);
        }
    };

    return (
        <div className="flex flex-col space-y-12">
            <Header category={categories[0]} />

            <div className="grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
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
