import ProductDetails from "@/components/product/productDetail";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductTypeOnlyWithPrice } from "@/types/types";
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

    const query = `
    SELECT 
      p.*,
      CASE
        WHEN $1 = 'LOW' THEN p.maxPrice
        WHEN $1 = 'MEDIUM' THEN p.avgPrice
        WHEN $1 = 'HIGH' THEN p.minPrice
        ELSE p.ogPrice
      END AS price,
      c.name as category_name,
      c.id as categoryId
    FROM product p
    LEFT JOIN productCategory c ON p.categoryId = c.id
    WHERE p.id = $2
  `;

    const products: ProductTypeOnlyWithPrice[] = await prisma.$queryRawUnsafe(
        query,
        customerCategory,
        parseInt(id),
    );

    const product = products[0];

    if (!product) {
        return (
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    // Fetch product items with their attribute options
    const productItems = await prisma.productItem.findMany({
        where: {
            productId: parseInt(id),
        },
        include: {
            productAttributeOptions: {
                include: {
                    productAttributeType: true,
                },
            },
        },
    });

    // Transform the data for the client component
    const transformedProduct = {
        ...product,
        productItems: productItems.map((item) => ({
            ...item,
            price:
                customerCategory === "LOW"
                    ? item.maxPrice
                    : customerCategory === "MEDIUM"
                      ? item.avgPrice
                      : customerCategory === "HIGH"
                        ? item.minPrice
                        : item.ogPrice,
        })),
    };

    return <ProductDetails product={transformedProduct} />;
}
