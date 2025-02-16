"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, ArrowLeft } from "lucide-react";
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
    const [searchTerm, setSearchTerm] = useState("");

    const handleCategoryClick = async (category: productCategoryType) => {
        if (category?._count?.subCategories > 0) {
            setParam("parentCategoryId", category?.id.toString());
        } else {
            router.push(`/customer/products?categoryId=${category.id}`);
        }
    };

    const filteredCategories = categories?.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">
                        {!!categories?.[0]?.parentCategory
                            ? `${categories?.[0]?.parentCategory?.name} Service`
                            : "Printing Services"}
                    </h1>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {categories[0]?.parentCategory !== null && (
                    <ArrowLeft
                        onClick={() => router?.push("/customer/categories")}
                        className="cursor-pointer"
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <Card
                            key={category.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div
                                className="h-48 w-full bg-cover bg-center rounded-t-lg"
                                style={{
                                    backgroundImage: `url(${category.imageUrl})`,
                                }}
                            />
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{category.name}</CardTitle>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-2">
                                    {category.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
