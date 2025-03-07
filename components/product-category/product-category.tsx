"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { productCategory } from "@prisma/client";
import Link from "next/link";

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
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-4 md:py-8 px-3">
            <div className="flex flex-col space-y-3 md:space-y-6">
                <h1 className="text-4xl font-playfair font-semibold text-[#660A27]">
                    {!!categories?.[0]?.parentCategory
                        ? `${categories?.[0]?.parentCategory?.name} Service`
                        : "Services"}
                </h1>

                {categories[0]?.parentCategory !== null && (
                    <Link
                        href="/customer/categories"
                        className="flex items-center text-base text-dominant-color hover:underline mb-6"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Services
                    </Link>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="cursor-pointer bg-white border border-gray-200 hover:shadow-xl transition-shadow overflow-hidden"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div
                                className="h-32 md:h-40 w-full bg-cover bg-center"
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
