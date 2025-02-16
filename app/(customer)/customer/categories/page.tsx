import React, { Suspense } from "react";
import { ProductCategoryList } from "@/components/product-category/product-category";
import { prisma } from "@/lib/prisma";
export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ parentCategoryId: string }>;
}) {
    const params = await searchParams;

    const categories = await prisma?.productCategory.findMany({
        where: {
            parentCategoryId: Number(params?.parentCategoryId) ?? null,
        },
        include: {
            _count: { select: { subCategories: true } },
            parentCategory: true,
        },
    });

    if (categories.length === 0) {
        return (
            <div>
                <p>No Product Category found!!</p>
            </div>
        );
    }

    return (
        <Suspense fallback={"loading...."}>
            <ProductCategoryList categories={categories} />
        </Suspense>
    );
}
