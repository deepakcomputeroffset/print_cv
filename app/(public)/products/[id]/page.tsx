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
    const customerCategory = session?.user?.customer?.customerCategory;
    if (!customerCategory) return redirect("/products");

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

    const cityDiscount = await Prisma.cityDiscount.findFirst({
        where: {
            cityId: session.user.customer?.address?.cityId,
            customerCategoryId: customerCategory?.id,
        },
    });

    const transformedProduct = {
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        isTieredPricing: product.isTieredPricing,
        sku: product.sku,
        // price: getPriceAccordingToCategoryOfCustomer(
        //     customerCategory,
        //     cityDiscount,
        //     product.price,
        // ),
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

            // price: getPriceAccordingToCategoryOfCustomer(
            //     customerCategory,
            //     cityDiscount,
            //     item.price,
            // ),
        })),
    };

    return (
        <ProductDetails
            product={transformedProduct}
            cityDiscount={cityDiscount}
            customerCategory={customerCategory}
        />
    );
}
