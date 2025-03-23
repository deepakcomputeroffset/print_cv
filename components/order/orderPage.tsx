"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    Clock,
    Printer,
    Package,
    Truck,
    XCircle,
    ExternalLink,
    Calendar,
    ReceiptText,
} from "lucide-react";
import {
    attachment,
    job,
    order,
    staff,
    STATUS,
    task,
    taskType,
} from "@prisma/client";
import { getStatusColor } from "@/lib/getStatusColor";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TimelineEvent {
    icon: React.ReactNode;
    title: string;
    description: string;
    date: string;
    status: STATUS;
}

interface Order extends order {
    productItem: {
        productId: number;
        sku: string;
        product: {
            description: string;
            imageUrl: string[];
            name: string;
            category: {
                name: string;
                id: number;
            };
        };
    };
    customer: {
        address: {
            line?: string;
            city?: {
                name?: string;
                state?: {
                    name?: string;
                    country: {
                        name: string;
                    };
                };
            };
            pinCode: string;
        } | null;
        businessName: string;
        name: string;
        phone: string;
    };
    job:
        | (job & {
              staff: Pick<staff, "id" | "name"> | null;
              tasks: (task & {
                  taskType: taskType | null;
                  assignee: Pick<staff, "id" | "name"> | null;
              })[];
          })
        | null;

    attachment: attachment | null;
}

export default function OrderDetailsPage({ order }: { order: Order }) {
    const getTimelineEvents = (order: Order): TimelineEvent[] => {
        const baseDate = new Date(order.createdAt);
        const events: TimelineEvent[] = [
            {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Order Placed",
                description: "Your order has been confirmed",
                date: baseDate.toLocaleDateString(),
                status: "PENDING",
            },
        ];

        if (order.status === "CANCELLED") {
            events.push({
                icon: <XCircle className="h-6 w-6" />,
                title: "Order Cancelled",
                description: "This order has been cancelled",
                date: new Date(
                    baseDate.getTime() + 1 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString(),
                status: "CANCELLED",
            });
        } else {
            events.push(
                {
                    icon: <Clock className="h-6 w-6" />,
                    title: "Order Processing",
                    description: "We're preparing your order",
                    date: new Date(
                        baseDate.getTime() + 1 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status: "PROCESSING",
                },
                {
                    icon: <Printer className="h-6 w-6" />,
                    title: "Printing Started",
                    description: "Your items are being printed",
                    date: new Date(
                        baseDate.getTime() + 2 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status: "PROCESSING",
                },
                {
                    icon: <Package className="h-6 w-6" />,
                    title: "Quality Check",
                    description: "Final quality inspection",
                    date: new Date(
                        baseDate.getTime() + 3 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status: "PROCESSING",
                },
                {
                    icon: <Truck className="h-6 w-6" />,
                    title: "Order Completed",
                    description:
                        "Your order has been completed and ready for pickup",
                    date: new Date(
                        baseDate.getTime() + 4 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString(),
                    status: "DISPATCHED",
                },
            );
        }

        return events;
    };

    const timelineEvents = getTimelineEvents(order);
    const currentStatusIndex = timelineEvents.length - 1;

    // Find active status index based on order status
    let activeStatusIndex = 0;
    if (order.status === "PROCESSING") {
        activeStatusIndex = Math.min(3, currentStatusIndex);
    } else if (order.status === "DISPATCHED") {
        activeStatusIndex = currentStatusIndex;
    } else if (order.status === "CANCELLED") {
        activeStatusIndex = 1;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-customHaf lg:max-w-custom mx-auto py-8"
        >
            <Link
                href="/customer/orders"
                className="flex items-center text-primary hover:text-primary/80 transition-colors mb-8 group"
            >
                <div className="bg-primary/5 p-1.5 rounded-full group-hover:bg-primary/10 transition-colors mr-2">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Back to Orders</span>
            </Link>

            <div className="space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-white">
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary"></div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full mr-3"></div>
                                            <h1
                                                className={cn(
                                                    "text-xl sm:text-2xl md:text-3xl font-bold text-gray-800",
                                                    sourceSerif4.className,
                                                )}
                                            >
                                                Order #{order.id}
                                            </h1>
                                        </div>
                                        <div className="flex items-center ml-10 text-gray-500">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <p>
                                                Placed on{" "}
                                                {new Date(
                                                    order.createdAt,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            getStatusColor(order.status),
                                            "text-sm px-4 py-1 rounded-full uppercase",
                                        )}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    {/* Order and Product */}
                                    <div className="space-y-6">
                                        <div>
                                            <h2
                                                className={cn(
                                                    "text-lg font-semibold mb-4 flex items-center text-gray-800",
                                                    sourceSerif4.className,
                                                )}
                                            >
                                                <Package className="h-5 w-5 mr-2 text-primary/70" />
                                                Product Details
                                            </h2>

                                            <div className="bg-gray-50 rounded-xl overflow-hidden p-4">
                                                <div className="relative h-60 mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-100 group">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <Image
                                                        src={
                                                            order?.productItem
                                                                ?.product
                                                                ?.imageUrl[0]
                                                        }
                                                        alt={
                                                            order?.productItem
                                                                ?.product?.name
                                                        }
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-105 duration-500"
                                                    />
                                                </div>

                                                <h3
                                                    className={cn(
                                                        "font-medium text-lg mb-4 text-gray-800",
                                                        sourceSerif4.className,
                                                    )}
                                                >
                                                    {
                                                        order?.productItem
                                                            ?.product?.name
                                                    }
                                                </h3>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                                        <span className="text-gray-600">
                                                            Quantity
                                                        </span>
                                                        <span className="font-medium">
                                                            {order?.qty} units
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                                        <span className="text-gray-600">
                                                            SKU
                                                        </span>
                                                        <span className="font-medium text-gray-800">
                                                            {
                                                                order
                                                                    ?.productItem
                                                                    ?.sku
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">
                                                            Total Amount
                                                        </span>
                                                        <span className="text-lg font-semibold text-primary">
                                                            ₹
                                                            {order?.amount.toFixed(
                                                                2,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order?.attachment &&
                                                order?.attachment?.urls
                                                    ?.length > 0 && (
                                                    <div className="mt-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                                        <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                                                            <FileText className="h-4 w-4 mr-2 text-primary" />
                                                            Attached Files
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {order?.attachment?.urls.map(
                                                                (u, idx) => (
                                                                    <Link
                                                                        key={
                                                                            idx
                                                                        }
                                                                        href={u}
                                                                        target="_blank"
                                                                        className="flex items-center p-2 bg-white rounded-md hover:bg-blue-50 transition-colors text-primary group"
                                                                    >
                                                                        <ReceiptText className="h-4 w-4 mr-2" />
                                                                        <span className="flex-1 text-gray-700">
                                                                            Attachment{" "}
                                                                            {idx +
                                                                                1}
                                                                        </span>
                                                                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                                                                    </Link>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Delivery Details */}
                                    <div>
                                        <h2
                                            className={cn(
                                                "text-lg font-semibold mb-4 flex items-center text-gray-800",
                                                sourceSerif4.className,
                                            )}
                                        >
                                            <Truck className="h-5 w-5 mr-2 text-primary/70" />
                                            Delivery Details
                                        </h2>

                                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">
                                                    Business Details
                                                </h3>
                                                <div className="font-medium text-gray-800">
                                                    {
                                                        order?.customer
                                                            ?.businessName
                                                    }
                                                </div>
                                                <div className="text-gray-600 text-sm mt-1">
                                                    Contact:{" "}
                                                    {order?.customer?.name}
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Phone:{" "}
                                                    {order?.customer?.phone}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">
                                                    Shipping Address
                                                </h3>
                                                <div className="text-gray-800">
                                                    {
                                                        order?.customer?.address
                                                            ?.line
                                                    }
                                                </div>
                                                <div className="text-gray-800">
                                                    {
                                                        order?.customer?.address
                                                            ?.city?.name
                                                    }
                                                    ,{" "}
                                                    {
                                                        order?.customer?.address
                                                            ?.city?.state?.name
                                                    }{" "}
                                                    {
                                                        order?.customer?.address
                                                            ?.pinCode
                                                    }
                                                </div>
                                                <div className="text-gray-800">
                                                    {
                                                        order?.customer?.address
                                                            ?.city?.state
                                                            ?.country?.name
                                                    }
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-primary/20 text-primary hover:bg-primary/5"
                                                >
                                                    View Shipping Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* TIME LINE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-white">
                        <div className="p-6 md:p-8">
                            <h2
                                className={cn(
                                    "text-lg font-semibold mb-8 flex items-center",
                                    sourceSerif4.className,
                                )}
                            >
                                <div className="h-1 w-6 bg-gradient-to-r from-primary to-cyan-400 rounded-full mr-3"></div>
                                Order Timeline
                            </h2>

                            <div className="relative">
                                {timelineEvents.map((event, index) => {
                                    const isActive = index <= activeStatusIndex;
                                    const isCancelled =
                                        event.status === "CANCELLED";

                                    return (
                                        <div
                                            key={index}
                                            className="mb-8 last:mb-0"
                                        >
                                            <div className="flex items-start">
                                                <div
                                                    className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300",
                                                        isCancelled
                                                            ? "bg-red-100 text-red-600"
                                                            : isActive
                                                              ? "bg-primary/10 text-primary"
                                                              : "bg-gray-100 text-gray-400",
                                                    )}
                                                >
                                                    {event.icon}
                                                </div>

                                                <div className="ml-5 flex-1">
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                                                        <h3
                                                            className={cn(
                                                                "font-medium text-base",
                                                                isCancelled
                                                                    ? "text-red-800"
                                                                    : isActive
                                                                      ? "text-gray-900"
                                                                      : "text-gray-500",
                                                            )}
                                                        >
                                                            {event.title}
                                                        </h3>
                                                        <span
                                                            className={cn(
                                                                "text-sm",
                                                                isCancelled
                                                                    ? "text-red-500"
                                                                    : isActive
                                                                      ? "text-primary/70"
                                                                      : "text-gray-400",
                                                            )}
                                                        >
                                                            {event.date}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={cn(
                                                            "text-sm mt-1",
                                                            isCancelled
                                                                ? "text-red-500"
                                                                : isActive
                                                                  ? "text-gray-600"
                                                                  : "text-gray-400",
                                                        )}
                                                    >
                                                        {event.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {index <
                                                timelineEvents.length - 1 && (
                                                <div
                                                    className={cn(
                                                        "absolute left-6 ml-[-1px] w-0.5 h-16",
                                                        isCancelled || !isActive
                                                            ? "bg-gray-200"
                                                            : "bg-primary/30",
                                                    )}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
