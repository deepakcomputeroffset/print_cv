"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useUrlFilters } from "@/hooks/useUrlFilter";
import { productCategory } from "@prisma/client";
import Link from "next/link";
import SparklesText from "../ui/sparkles-text";

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
            router.push(`/products?categoryId=${category.id}`);
        }
    };

    return (
        <div className="flex flex-col space-y-3 md:space-y-10">
            <SparklesText
                text={
                    !!categories?.[0]?.parentCategory
                        ? `${categories?.[0]?.parentCategory?.name} Service`
                        : "List of Printing Services"
                }
                className="text-3xl text-center font-normal uppercase text-zinc-900/75 border-b border-gray-600 pb-2 w-1/2 mx-auto"
                colors={{ first: "green", second: "gray" }}
                sparklesCount={10}
            />

            {categories[0]?.parentCategory !== null && (
                <Link
                    href="/categories"
                    className="flex items-center text-base text-dominant-color hover:underline mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Services
                </Link>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
                {categories.map((category) => (
                    <Card
                        key={category.id}
                        className={`bg-white border border-gray-200 transition-shadow overflow-hidden relative ${
                            category.isAvailable
                                ? "cursor-pointer hover:shadow-xl"
                                : "cursor-not-allowed"
                        }`}
                        onClick={
                            category.isAvailable
                                ? () => handleCategoryClick(category)
                                : undefined
                        }
                    >
                        <div
                            className="h-28 w-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${category.imageUrl})`,
                            }}
                        />
                        <CardHeader className="py-2">
                            <div className="flex items-center justify-center text-center text-[#660A27] font-semibold">
                                <CardTitle>{category.name}</CardTitle>
                            </div>
                        </CardHeader>

                        {!category.isAvailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    Coming Soon
                                </span>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
