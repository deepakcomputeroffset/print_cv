import { Prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductDetails from "./components/productDetail";
import { auth } from "@/lib/auth";

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
            <ProductDetails
                cityDiscount={cityDiscount}
                customer={session?.user?.customer}
                products={products}
            />
        </div>
    );
}
