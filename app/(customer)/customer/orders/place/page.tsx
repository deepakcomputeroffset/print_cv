import CheckoutPage from "@/components/order/placeOrder";
import { auth } from "@/lib/auth";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import { ProductItemType } from "@/types/types";
import { productAttributeValue } from "@prisma/client";
import { redirect } from "next/navigation";
import { Prisma } from "@/lib/prisma";

export default async function PlaceOrderPage({
    searchParams,
}: {
    searchParams: Promise<{ productItemId: string; qty: string }>;
}) {
    try {
        const params = await searchParams;
        const session = await auth();
        const customerCategory =
            session?.user?.customer?.customerCategory || "LOW";

        if (!session) return redirect("/");

        if (
            !params?.productItemId ||
            !params?.qty ||
            isNaN(parseInt(params?.productItemId)) ||
            isNaN(parseInt(params?.qty))
        ) {
            return redirect("/customer/products");
        }

        const productItem = await Prisma?.productItem.findUnique({
            where: {
                id: parseInt(params?.productItemId),
            },
            include: {
                productAttributeOptions: true,
                product: {
                    select: {
                        name: true,
                        categoryId: true,
                        description: true,
                        imageUrl: true,
                    },
                },
            },
        });

        if (!productItem) {
            return (
                <div>
                    <p>No product Found</p>
                </div>
            );
        }

        const transformedProductItem: ProductItemType & {
            productAttributeOptions: productAttributeValue[];
            product: {
                name: string;
                categoryId: number;
                description: string;
                imageUrl: string[];
            };
            price: number;
            qty: number;
        } = {
            id: productItem.id,
            productId: productItem.productId,
            imageUrl: productItem.imageUrl,
            isAvailable: productItem.isAvailable,
            minQty: productItem.minQty,
            productAttributeOptions: productItem.productAttributeOptions,
            sku: productItem.sku,
            createdAt: productItem.createdAt,
            updatedAt: productItem.updatedAt,
            price: getPriceAccordingToCategoryOfCustomer(customerCategory, {
                avgPrice: productItem.avgPrice,
                maxPrice: productItem.maxPrice,
                minPrice: productItem.minPrice,
            }),
            product: productItem.product,
            qty: parseInt(params.qty),
        };

        return (
            <div className="px-4 pt-10 md:pt-20">
                <CheckoutPage product={transformedProductItem} />
            </div>
        );
    } catch (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    Error while loading place order:
                    {error instanceof Error
                        ? error.message
                        : "An error occurred"}
                </div>
            </div>
        );
    }
}
