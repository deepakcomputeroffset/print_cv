import { Session } from "next-auth";
import { Prisma } from "@/lib/prisma";
import RecentOrderList from "./recentOrderList";

export default async function RecentOrders({
    session,
}: {
    session?: Session | null;
}) {
    const orders = await Prisma?.order.findMany({
        where: {
            customerId: session?.user?.customer?.id,
        },
        include: {
            productItem: {
                include: {
                    product: true,
                },
            },
        },
    });

    return <RecentOrderList orders={orders} />;
}
