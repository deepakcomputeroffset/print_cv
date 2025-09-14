"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { CCard } from "./card";
import Header from "./header";
import { productCategoryType } from "@/types/types";

export const List = ({ categories }: { categories: productCategoryType[] }) => {
    const router = useRouter();
    const { setParam } = useUrlFilters();

    const handleCategoryClick = (category: productCategoryType) => {
        if (category?._count?.subCategories > 0) {
            setParam("parentCategoryId", category?.id.toString());
        } else if (category?.isList) {
            router.push(`/products/list/${category.id}`);
        } else {
            router.push(`/products?categoryId=${category.id}`);
        }
    };

    return (
        <div className="flex flex-col space-y-12">
            <Header category={categories[0]} />

            <div className="grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {categories.map((category, index) => (
                    <CCard
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
