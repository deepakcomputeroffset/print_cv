import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import ProductLists from "../../../components/product/productLists";
import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/prisma";
import { ProductTypeOnlyWithPrice } from "@/types/types";
import { redirect } from "next/navigation";
import { CUSTOMER_CATEGORY } from "@prisma/client";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function ProductPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId: string }>;
}) {
    const params = await searchParams;
    const session = await auth();
    const customerCategory = session?.user?.customer
        ?.customerCategory as CUSTOMER_CATEGORY; // LOW, MEDIUM, HIGH

    if (isNaN(parseInt(params?.categoryId))) {
        redirect("/categories");
    }

    const category = await Prisma.productCategory.findUnique({
        where: { id: parseInt(params?.categoryId) },
        select: { name: true, parentCategory: { select: { name: true } } },
    });
    const products = await Prisma.product.findMany({
        where: params?.categoryId
            ? {
                  categoryId: parseInt(params?.categoryId),
                  isAvailable: true,
                  productItems: { some: {} },
              }
            : {},
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            maxPrice: true,
            avgPrice: true,
            minPrice: true,
        },
    });

    const processedProduct = products.map(
        ({ id, name, description, imageUrl, maxPrice, avgPrice, minPrice }) => {
            const price = getPriceAccordingToCategoryOfCustomer(
                customerCategory,
                { avgPrice, maxPrice, minPrice },
            );
            return {
                id,
                name,
                description,
                imageUrl,
                price,
            };
        },
    );

    if (products.length <= 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <div className="bg-white p-6 rounded-full shadow-lg">
                    <Package className="w-16 h-16 text-gray-400" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6">
                    No Products Available
                </h2>
                <p className="text-gray-600 mt-2 max-w-md">
                    It seems like we don’t have any products listed right now.
                    Please check back later or browse other categories.
                </p>

                <Link
                    href="/categories"
                    className="mt-6 bg-dominant-color-2 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                >
                    Back to Services
                </Link>
            </div>
        );
    }

    return (
        <div>
            <ProductLists
                products={processedProduct as ProductTypeOnlyWithPrice[]}
                category={category}
            />
        </div>
    );
}
