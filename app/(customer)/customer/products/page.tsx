import ProductLists from "../../../../components/product/productLists";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductTypeOnlyWithPrice } from "@/types/types";
import { redirect } from "next/navigation";

export default async function ProductPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId: string }>;
}) {
    const params = await searchParams;
    const session = await auth();
    const customerCategory = session?.user?.customer?.customerCategory; // LOW, MEDIUM, HIGH

    if (isNaN(parseInt(params?.categoryId))) {
        redirect("/customer/categories");
    }

    const products = await prisma.product.findMany({
        where: params?.categoryId
            ? {
                  categoryId: parseInt(params?.categoryId),
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
            let price;
            switch (customerCategory) {
                case "LOW":
                    price = maxPrice;
                    break;
                case "MEDIUM":
                    price = avgPrice;
                    break;
                case "HIGH":
                    price = minPrice;
                    break;
                default:
                    price = maxPrice; // Default to maxPrice if category is missing
            }

            return {
                id,
                name,
                description,
                imageUrl,
                price, // Only showing relevant price
            };
        },
    );

    if (!products) {
        return (
            <div>
                <p>No products found</p>
            </div>
        );
    }

    return (
        <div>
            <ProductLists
                products={processedProduct as ProductTypeOnlyWithPrice[]}
            />
        </div>
    );
}
