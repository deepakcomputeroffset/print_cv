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
    const customerCategory =
        session?.user?.customer?.customer_category || "LOW";

    const query = `
    SELECT 
      p.*,
      CASE
        WHEN $1 = 'LOW' THEN p.max_price
        WHEN $1 = 'MEDIUM' THEN p.avg_price
        WHEN $1 = 'HIGH' THEN p.min_price
        ELSE p.og_price
      END AS price,
      c.name as category_name,
      c.id as category_id
    FROM product p
    LEFT JOIN product_category c ON p.category_id = c.id
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
    const productItems = await prisma.product_item.findMany({
        where: {
            product_id: parseInt(id),
        },
        include: {
            product_attribute_options: {
                include: {
                    product_attribute_type: true,
                },
            },
        },
    });

    // Transform the data for the client component
    const transformedProduct = {
        ...product,
        product_items: productItems.map((item) => ({
            ...item,
            price:
                customerCategory === "LOW"
                    ? item.max_price
                    : customerCategory === "MEDIUM"
                      ? item.avg_price
                      : customerCategory === "HIGH"
                        ? item.min_price
                        : item.og_price,
        })),
    };

    return <ProductDetails product={transformedProduct} />;
}
