import { redirect } from "next/navigation";
import OrderDetailsPage from "@/components/order/orderPage";
import { Prisma } from "@/lib/prisma";

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

        const order = await Prisma.order.findFirst({
            where: { id: parseInt(id) },
            include: {
                customer: {
                    select: {
                        businessName: true,
                        name: true,
                        phone: true,
                    },
                },
                productItem: {
                    include: {
                        pricing: true,
                        product: true,
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
                        customer: {
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
        const address = await Prisma.address.findFirst({
            where: { ownerId: order?.customerId, ownerType: "CUSTOMER" },
            include: {
                city: {
                    include: {
                        state: {
                            include: {
                                country: true,
                            },
                        },
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
                order={{ ...order, customer: { ...order.customer, address } }}
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
