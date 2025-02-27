import { redirect } from "next/navigation";
import OrderDetailsPage from "./orderPage";
import { prisma } from "@/lib/prisma";

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

        const order = await prisma.order.findFirst({
            where: { id: parseInt(id) },
            include: {
                customer: {
                    select: {
                        address: {
                            select: {
                                line: true,
                                city: {
                                    select: {
                                        name: true,
                                        state: {
                                            select: {
                                                name: true,
                                                country: {
                                                    select: {
                                                        name: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                pinCode: true,
                            },
                        },
                        businessName: true,
                        name: true,
                        phone: true,
                    },
                },
                productItem: {
                    select: {
                        productId: true,
                        sku: true,
                        product: {
                            select: {
                                description: true,
                                imageUrl: true,
                                name: true,
                                category: {
                                    select: {
                                        name: true,
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                },
                process: true,
            },
        });

        if (!order) {
            return (
                <div>
                    <p>Not any order found</p>
                </div>
            );
        }

        return <OrderDetailsPage order={order} />;
    } catch (error) {
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
