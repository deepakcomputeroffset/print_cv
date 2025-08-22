import ProductDetails from "@/components/product/productDetail";
import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (isNaN(parseInt(id))) {
        return redirect("/products");
    }
    const session = await auth();

    const product = await Prisma.product.findUnique({
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
                    pricing: true,
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

    const cityDiscount = !!session
        ? await Prisma.cityDiscount.findFirst({
              where: {
                  cityId: session?.user.customer?.address?.cityId,
                  customerCategoryId:
                      session?.user.customer?.customerCategory?.id,
              },
          })
        : null;

    const transformedProduct = {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        isTieredPricing: product.isTieredPricing,
        sku: product.sku,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        productItems: product.productItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            isAvailable: item.isAvailable,
            productAttributeOptions: item.productAttributeOptions,
            sku: item.sku,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            pricing: item.pricing,
            uploadGroupId: item.uploadGroupId,
        })),
    };

    return (
        <ProductDetails
            product={transformedProduct}
            cityDiscount={cityDiscount}
            customer={session?.user?.customer}
        />
    );
}
