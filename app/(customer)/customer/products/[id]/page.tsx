import ProductDetails from "@/components/product/productDetail";
import { auth } from "@/lib/auth";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import { prisma } from "@/lib/prisma";
import {
    ProductItemTypeOnlyWithPrice,
    ProductTypeOnlyWithPrice,
} from "@/types/types";
import { redirect } from "next/navigation";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (isNaN(parseInt(id))) {
        return redirect("/customer/product");
    }
    const session = await auth();
    const customerCategory = session?.user?.customer?.customerCategory || "LOW";

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            category: true,
            productItems: {
                include: {
                    productAttributeOptions: {
                        include: {
                            productAttributeType: true,
                        },
                    },
                },
            },
        },
    });

    if (!product) {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }
    const transformedProduct: ProductTypeOnlyWithPrice & {
        productItems: ProductItemTypeOnlyWithPrice[];
    } = {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        sku: product.sku,
        minQty: product.minQty,
        price: getPriceAccordingToCategoryOfCustomer(customerCategory, {
            avgPrice: product.avgPrice,
            maxPrice: product.maxPrice,
            minPrice: product.minPrice,
        }),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        productItems: product.productItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable,
            minQty: item.minQty,
            productAttributeOptions: item.productAttributeOptions,
            sku: item.sku,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            price: getPriceAccordingToCategoryOfCustomer(customerCategory, {
                avgPrice: item.avgPrice,
                maxPrice: item.maxPrice,
                minPrice: item.minPrice,
            }),
        })),
    };

    return <ProductDetails product={transformedProduct} />;
}
