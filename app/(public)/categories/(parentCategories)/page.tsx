import React from "react";
import { ProductCategories } from "@/components/category/list";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export default async function ProductCategoryPage() {
    async function getCategories() {
        try {
            return await Prisma?.productCategory.findMany({
                where: {
                    parentCategoryId: null,
                },
                include: {
                    _count: { select: { subCategories: true } },
                    parentCategory: true,
                },
                orderBy: {
                    id: "asc",
                },
            });
        } catch (error) {
            console.log(
                "Database not available during build, returning empty array",
                error,
            );
            return [];
        }
    }
    const categories = await unstable_cache(
        async () => await getCategories(),
        ["categories"],
        {
            revalidate: 60 * 60 * 24 * 7, // 7 days
            tags: ["categories"],
        },
    )();

    const sortedCategories = categories.sort((a, b) => {
        if (a.isAvailable !== b.isAvailable) {
            return a.isAvailable ? -1 : 1;
        }
        return a.id - b.id;
    });

    if (!sortedCategories || sortedCategories?.length === 0) {
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
    return <ProductCategories categories={sortedCategories} />;
}
