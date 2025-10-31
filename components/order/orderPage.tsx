"use client";
import Link from "next/link";
import { ArrowLeft, XCircle, MessageCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { getStatusColor } from "@/lib/getStatusColor";
import { OrderTimeline } from "./components/OrderTimeline";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "../motionDiv";
import { CancellationModal } from "./components/CancellationModal";
import { format } from "date-fns";
import { useModal } from "@/hooks/use-modal";
import { OrderDetailsPageProps } from "@/types/types";
import { FileViewer } from "./components/FileViewer";
import { OrderInfo } from "./components/OrderInfo";
import { orderCancellableStatus } from "@/lib/constants";

export default function OrderDetailsPage({ order }: OrderDetailsPageProps) {
    const { onOpen } = useModal();

    return (
        <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-6"
        >
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/customer/orders?search=&sortorder=desc&perpage=100"
                    className="flex items-center text-primary hover:text-primary/80 transition-colors group text-sm"
                >
                    <div className="bg-primary/5 p-1 rounded-full group-hover:bg-primary/10 transition-colors mr-1.5">
                        <ArrowLeft className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">Back to Orders</span>
                </Link>
                {orderCancellableStatus?.includes(order?.status) && (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                            onOpen("cancelOrder", { orderId: order.id })
                        }
                        className="flex items-center gap-1.5 text-sm"
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancel
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="overflow-hidden border-0 shadow-md rounded-lg bg-white">
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-cyan-400 to-primary"></div>

                            <div className="p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-6">
                                    <div>
                                        <div className="flex items-center mb-1.5">
                                            <div className="h-0.5 w-5 bg-gradient-to-r from-primary to-cyan-400 rounded-full mr-2"></div>
                                            <h1
                                                className={cn(
                                                    "text-lg sm:text-xl md:text-2xl font-semibold text-gray-800",
                                                    sourceSerif4.className,
                                                )}
                                            >
                                                Order #{order.id}
                                            </h1>
                                        </div>
                                        <div className="flex items-center ml-7 text-gray-500 text-xs">
                                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                            <p>
                                                Placed on{" "}
                                                {new Date(
                                                    order.createdAt,
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            getStatusColor(order.status),
                                            "text-xs px-3 py-0.5 rounded-full uppercase hover:text-white",
                                        )}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* <ProductDetails order={order} /> */}
                                    <FileViewer order={order} />
                                    {/* <DeliveryDetails order={order} /> */}
                                    <OrderInfo order={order} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </MotionDiv>

                {/* Comments Section */}
                {order.comments && order.comments.length > 0 && (
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="overflow-hidden border-0 shadow-md rounded-lg bg-white">
                            <div className="p-4 md:p-6">
                                <div className="flex items-center mb-4">
                                    <div className="h-0.5 w-5 bg-gradient-to-r from-primary to-cyan-400 rounded-full mr-2"></div>
                                    <h2
                                        className={cn(
                                            "text-lg font-semibold text-gray-800",
                                            sourceSerif4.className,
                                        )}
                                    >
                                        Comments
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {order.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                                        >
                                            <div className="flex justify-between items-start mb-1.5">
                                                <div className="flex items-center text-sm">
                                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                                    <span className="font-medium text-gray-800">
                                                        {comment.commentType ===
                                                        "CANCELLATION"
                                                            ? "Cancellation Reason"
                                                            : comment.commentType.replace(
                                                                  /_/g,
                                                                  " ",
                                                              )}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-gray-500">
                                                    {format(
                                                        new Date(
                                                            comment.createdAt,
                                                        ),
                                                        "MMM d, yyyy h:mm a",
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm">
                                                {comment.comment}
                                            </p>
                                            <div className="mt-1.5 text-[11px] text-gray-500">
                                                By:{" "}
                                                {comment.staff
                                                    ? comment.staff.name
                                                    : "System"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </MotionDiv>
                )}

                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="overflow-hidden border-0 shadow-md rounded-lg bg-white">
                        <OrderTimeline order={order} />
                    </Card>
                </MotionDiv>
            </div>

            <CancellationModal />
        </MotionDiv>
    );
}
