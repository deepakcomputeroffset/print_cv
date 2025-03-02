import React, { Suspense } from "react";
import { ProductCategoryList } from "@/components/product-category/product-category";
import { prisma } from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <div className="bg-white p-6 rounded-full shadow-lg">
                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6">
                    No Product Categories Found
                </h2>
                <p className="text-gray-600 mt-2 max-w-md">
                    It looks like there are no categories available at the
                    moment. Please check back later or explore other sections of
                    our store.
                </p>

                <Link
                    href={"/"}
                    className="mt-6 bg-dominant-color-2 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <Suspense fallback={"loading...."}>
            <ProductCategoryList categories={categories} />
        </Suspense>
    );
}
