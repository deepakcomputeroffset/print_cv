"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { productCategory } from "@prisma/client";

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

    const handleCategoryClick = async (category: productCategoryType) => {
        if (category?._count?.subCategories > 0) {
            setParam("parentCategoryId", category?.id.toString());
        } else {
            router.push(`/customer/products?categoryId=${category.id}`);
        }
    };

    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-8">
            <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-playfair font-semibold text-[#660A27]">
                        {!!categories?.[0]?.parentCategory
                            ? `${categories?.[0]?.parentCategory?.name} Service`
                            : "Services"}
                    </h1>
                </div>

                {categories[0]?.parentCategory !== null && (
                    <ArrowLeft
                        onClick={() => router?.push("/customer/categories")}
                        className="cursor-pointer text-[#A6192E] hover:text-[#870F20] transition"
                    />
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="cursor-pointer bg-white border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div
                                className="h-40 w-full bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${category.imageUrl})`,
                                }}
                            />
                            <CardHeader>
                                <div className="flex items-center justify-center text-center text-[#660A27] font-semibold">
                                    <CardTitle>{category.name}</CardTitle>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
