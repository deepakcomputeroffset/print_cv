import { redirect } from "next/navigation";
import OrderDetailsPage from "@/components/order/orderPage";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";

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
            where: {
                id: parseInt(id),
                customerId: session?.user?.customer?.id,
            },
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
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-5">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full shadow-md mb-3">
                        <ClipboardList className="w-10 h-10 text-primary/60" />
                    </div>

                    <h2
                        className={cn(
                            "text-xl font-semibold text-gray-800 dark:text-gray-100",
                            sourceSerif4.className,
                        )}
                    >
                        No Order Found
                    </h2>
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
