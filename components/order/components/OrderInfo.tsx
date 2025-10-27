import { InvoiceButton } from "@/components/InvoiceButton";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { OrderDetailsPageProps } from "@/types/types";
import { Calendar } from "lucide-react";

export function OrderInfo({ order }: OrderDetailsPageProps) {
    return (
        <div className="space-y-4 p-4">
            {/* Header Section with Status */}
            <div className="flex items-center justify-between">
                <h2
                    className={cn(
                        sourceSerif4.className,
                        "text-xl font-semibold",
                    )}
                >
                    Order Information
                </h2>
                {order.status === "DISPATCHED" && (
                    <InvoiceButton order={order} />
                )}
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column - Order Details */}
                <div className="space-y-3">
                    {/* <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Order ID
                        </span>
                        <span className="font-medium">{order.id}</span>
                    </div> */}
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Customer
                        </span>
                        <span className="font-medium">
                            {order.customer.name}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Order Date
                        </span>
                        <span className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Upload Method
                        </span>
                        <span className="font-medium text-sm">
                            {order.uploadFilesVia}
                        </span>
                    </div>
                </div>

                {/* Right Column - Order Metrics */}
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Quantity
                        </span>
                        <span className="font-medium">{order.qty} units</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Total Amount
                        </span>
                        <span className="font-medium">
                            ₹{order.total.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">
                            Job Reference
                        </span>
                        <span className="font-medium">
                            {order?.job?.name || "Not assigned"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Product Attributes Section */}
            <div className="mt-6">
                <h3
                    className={cn(
                        sourceSerif4.className,
                        "text-lg font-semibold mb-3",
                    )}
                >
                    Product Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.productItem.productAttributeOptions.map((pav) => (
                        <div
                            key={pav.id}
                            className="bg-muted/30 rounded-lg p-3"
                        >
                            <span className="text-sm text-muted-foreground block">
                                {pav.productAttributeType.name}
                            </span>
                            <span className="font-medium">
                                {pav.productAttributeValue}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
