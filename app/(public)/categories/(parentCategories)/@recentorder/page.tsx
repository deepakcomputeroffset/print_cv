import RecentOrderList from "@/components/order/recentOrderList";
import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function getOrders(customerId: number) {
    return await Prisma?.order.findMany({
        where: {
            customerId,
        },
        include: {
            productItem: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
}

export default async function RecentOrderPage() {
    const session = await auth();
    if (
        session?.user?.userType !== "customer" ||
        !session?.user?.customer?.id
    ) {
        return null;
    }

    const customerId = session.user.customer.id;

    const orders = await unstable_cache(
        async () => await getOrders(customerId),

        [customerId.toString()],
        { revalidate: 60, tags: ["recentOrders"] },
    )();

    return <RecentOrderList orders={orders} />;
}
