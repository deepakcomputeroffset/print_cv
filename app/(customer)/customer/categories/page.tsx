import React, { Suspense } from "react";
import { ProductCategoryList } from "@/components/product-category/product-category";
import { prisma } from "@/lib/prisma";
export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ parent_category_id: string }>;
}) {
    const params = await searchParams;

    const categories = await prisma?.product_category.findMany({
        where: {
            parent_category_id: Number(params?.parent_category_id) ?? null,
        },
        include: {
            _count: { select: { sub_categories: true } },
            parent_category: true,
        },
    });

    return (
        <Suspense fallback={"loading...."}>
            <ProductCategoryList categories={categories} />
        </Suspense>
    );
}
