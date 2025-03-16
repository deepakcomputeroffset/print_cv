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
    // AlertCircle,
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

    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-8">
            <Link
                href="/customer/orders"
                className="flex items-center text-primary hover:underline mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
            </Link>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Order #{order.id}
                            </h1>
                            <p className="text-muted-foreground">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <Badge
                            className={cn(
                                getStatusColor(order.status),
                                "hover:text-white",
                            )}
                        >
                            {order.status}
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Order and Product */}
                        <div>
                            <h2 className="font-semibold mb-4">
                                Product Details
                            </h2>
                            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                                <Image
                                    src={
                                        order?.productItem?.product?.imageUrl[0]
                                    }
                                    alt={order?.productItem?.product?.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="font-medium text-lg">
                                {order?.productItem?.product?.name}
                            </h3>

                            {/* Order */}
                            <div className="mt-4 space-y-2">
                                <p>
                                    <span className="font-medium">
                                        Quantity:
                                    </span>{" "}
                                    {order?.qty}
                                </p>
                                <p>
                                    <span className="font-medium">Amount:</span>{" "}
                                    ${order?.amount.toFixed(2)}
                                </p>
                                {order?.attachment &&
                                    order?.attachment?.urls.map((u, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center"
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            <Link
                                                href={u}
                                                className="text-primary hover:underline"
                                                target="_blank"
                                            >
                                                View File {idx}
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div>
                            <h2 className="font-semibold mb-4">
                                Delivery Details
                            </h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">
                                        Business Name:
                                    </span>{" "}
                                    {order?.customer?.businessName}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Address:
                                    </span>{" "}
                                    {order?.customer?.address?.line}
                                </p>
                                <p>
                                    <span className="font-medium">City:</span>{" "}
                                    {order?.customer?.address?.city?.name}
                                </p>
                                <p>
                                    <span className="font-medium">State:</span>{" "}
                                    {
                                        order?.customer?.address?.city?.state
                                            ?.name
                                    }
                                </p>
                                <p>
                                    <span className="font-medium">
                                        PIN Code:
                                    </span>{" "}
                                    {order.customer?.address?.pinCode}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Country:
                                    </span>{" "}
                                    {
                                        order?.customer?.address?.city?.state
                                            ?.country?.name
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* TIME LINE */}

                <Card className="p-6">
                    <h2 className="font-semibold mb-6">Order Timeline</h2>
                    <div className="relative">
                        {timelineEvents.map((event, index) => (
                            <div
                                key={index}
                                className="flex items-start mb-8 last:mb-0"
                            >
                                <div
                                    className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${
                      event.status === "DISPATCHED"
                          ? "bg-green-100 text-green-600"
                          : event.status === "PENDING"
                            ? "bg-blue-100 text-blue-600"
                            : event.status === "CANCELLED"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-400"
                  }
                `}
                                >
                                    {event.icon}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {event.description}
                                            </p>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {event.date}
                                        </span>
                                    </div>
                                    {index < timelineEvents.length - 1 && (
                                        <div className="absolute left-6 ml-[-1px] w-0.5 h-16 bg-gray-200" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
