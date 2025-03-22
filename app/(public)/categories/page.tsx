import React, { Suspense } from "react";
import ProductCategoryPage from "@/components/product-category/product-category-page";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ parentCategoryId: string }>;
}) {
    const params = await searchParams;

    return (
        <Suspense
            fallback={
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-3 w-full h-full max-w-customHaf lg:max-w-custom mx-auto py-10">
                    {Array.from({ length: 15 })
                        .fill(null)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                className="w-full h-full min-h-36 min-w-36 rounded-lg"
                            />
                        ))}
                </div>
            }
        >
            <ProductCategoryPage params={params} />
        </Suspense>
    );
}
