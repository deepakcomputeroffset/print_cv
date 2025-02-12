import { stringToNumber } from "@/lib/utils";
import ProductLists from "../../../../components/product/product-lists";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductTypeOnlyWithPrice } from "@/types/types";

export default async function ProductPage({
    searchParams,
}: {
    searchParams: Promise<{ category_id: string }>;
}) {
    const params = await searchParams;
    const session = await auth();
    const customerCategory = session?.user?.customer?.customer_category; // LOW, MEDIUM, HIGH

    let query = `
    SELECT
        id,
        name,
        description,
        image_url,
        CASE
            WHEN $1 = 'LOW' THEN max_price
            WHEN $1 = 'MEDIUM' THEN avg_price
            WHEN $1 = 'HIGH' THEN min_price
            ELSE og_price
        END AS price
    FROM
        product
`;

    const { isNum, num } = stringToNumber(params?.category_id);
    if (isNum) {
        query += ` WHERE category_id = $2`;
    }

    const products = await prisma.$queryRawUnsafe(
        query,
        customerCategory,
        isNum && num,
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
            <ProductLists products={products as ProductTypeOnlyWithPrice[]} />
        </div>
    );
}
