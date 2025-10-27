import { redirect } from "next/navigation";
import OrderDetailsPage from "@/components/order/orderPage";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function OrderPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {
    try {
        const { id } = await params;

        if (!id || isNaN(parseInt(id))) {
            return redirect("/customer/orders");
        }
        const session = await auth();
        const order = await Prisma.order.findFirst({
            where: { id: parseInt(id) },
            include: {
                productItem: {
                    include: {
                        pricing: true,
                        product: true,
                        productAttributeOptions: {
                            include: {
                                productAttributeType: true,
                            },
                        },
                    },
                },
                job: {
                    include: {
                        staff: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        tasks: {
                            include: {
                                taskType: true,
                                assignee: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                            orderBy: {
                                completedAt: "asc",
                            },
                        },
                    },
                },
                attachment: true,
                comments: {
                    include: {
                        staff: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!order) {
            return (
                <div>
                    <p>Not any order found</p>
                </div>
            );
        }
        return (
            <OrderDetailsPage
                order={{
                    ...order,
                    customer: {
                        address: session?.user.customer?.address,
                        businessName: session?.user.customer
                            ?.businessName as string,
                        name: session?.user.customer?.name as string,
                        phone: session?.user.customer?.phone as string,
                    },
                }}
            />
        );
    } catch (error) {
        console.error("Error loading order:", error);
        return (
            <div>
                <p>
                    Error{" "}
                    {error instanceof Error
                        ? error.message
                        : "While loading order"}
                </p>
            </div>
        );
    }
}
