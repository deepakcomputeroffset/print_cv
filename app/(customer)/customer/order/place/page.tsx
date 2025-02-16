import { redirect } from "next/navigation";

export default async function PlaceOrderPage({
    searchParams,
}: {
    searchParams: Promise<{ productId: string; qty: string }>;
}) {
    try {
        const params = await searchParams;
        if (
            !params?.productId ||
            !params?.qty ||
            isNaN(parseInt(params?.productId)) ||
            isNaN(parseInt(params?.qty))
        ) {
            return redirect("/customer/products");
        }

        const productItem = await prisma?.product_item.findUnique({
            where: {
                id: parseInt(params?.productId),
            },
        });

        if (!productItem) {
            return (
                <div>
                    <p>No product Found</p>
                </div>
            );
        }

        return (
            <div>
                <p>{productItem?.id}</p>
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
