import { Prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductDetails from "./components/productDetail";
import { auth } from "@/lib/auth";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ categoryId: string }>;
}) {
    const { categoryId } = await params;
    if (isNaN(parseInt(categoryId))) {
        return redirect("/categories");
    }

    const category = await Prisma.productCategory.findUnique({
        where: {
            id: parseInt(categoryId),
            isAvailable: true,
            isList: true,
        },
        include: {
            products: {
                include: {
                    productItems: {
                        include: {
                            productAttributeOptions: {
                                include: { productAttributeType: true },
                                orderBy: {
                                    productAttributeType: { name: "asc" },
                                },
                            },
                            pricing: true,
                        },
                        where: { isAvailable: true },
                    },
                },
            },
        },
    });

    const products = category?.products ?? [];

    if (!products) {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    const session = await auth();

    const cityDiscount = !!session
        ? await Prisma.cityDiscount.findFirst({
              where: {
                  cityId: session?.user.customer?.address?.cityId,
                  customerCategoryId:
                      session?.user.customer?.customerCategory?.id,
              },
          })
        : null;

    // const transformedProducts = products?.map((product) => ({
    //     id: product.id,
    //     name: product.name,
    //     categoryId: product.categoryId,
    //     description: product.description,
    //     imageUrl: product.imageUrl,
    //     isAvailable: product.isAvailable,
    //     isTieredPricing: product.isTieredPricing,
    //     sku: product.sku,
    //     createdAt: product.createdAt,
    //     updatedAt: product.updatedAt,
    //     productItems: product.productItems.map((item) => ({
    //         id: item.id,
    //         productId: item.productId,
    //         isAvailable: item.isAvailable,
    //         productAttributeOptions: item.productAttributeOptions,
    //         sku: item.sku,
    //         createdAt: item.createdAt,
    //         updatedAt: item.updatedAt,
    //         pricing: item.pricing,
    //         uploadGroupId: item.uploadGroupId,
    //     })),
    // }));
    return (
        <div>
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
                    <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 p-8 rounded-full shadow-md border border-primary/10">
                        <Package className="w-10 h-10 text-primary/70" />
                    </div>

                    <h2
                        className={cn(
                            "text-xl font-bold mt-4 mb-3",
                            sourceSerif4.className,
                        )}
                    >
                        <span>No Products</span>{" "}
                        <span className="text-primary relative inline-block">
                            Available
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-md">
                        Currently, there are no products available in this
                        category. Please check back later or explore other
                        categories.
                    </p>
                </div>
            ) : (
                <ProductDetails
                    cityDiscount={cityDiscount}
                    customer={session?.user?.customer}
                    products={products}
                />
            )}
        </div>
    );
}
