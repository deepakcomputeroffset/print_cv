import Link from "next/link";
import { ArrowLeft, FileText, ReceiptText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { Calendar } from "lucide-react";
import { getStatusColor } from "@/lib/getStatusColor";
import { ProductDetails } from "./components/ProductDetails";
import { DeliveryDetails } from "./components/DeliveryDetails";
import { OrderTimeline } from "./components/OrderTimeline";
import {
    order,
    job,
    staff,
    task,
    taskType,
    attachment,
    UPLOADVIA,
} from "@prisma/client";
import { MotionDiv } from "../motionDiv";

// This type ensures that all Decimal values are converted to numbers
type SerializedOrder = Omit<
    order,
    "price" | "total" | "igst" | "uploadCharge"
> & {
    price: number;
    total: number;
    igst: number;
    uploadCharge: number;
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
    attachment:
        | (attachment & {
              id: number;
              customerId: number | null;
              createdAt: Date;
              updatedAt: Date;
              orderId: number;
              uploadVia: UPLOADVIA;
              urls: string[];
              uploadedById: number | null;
          })
        | null;
};

interface OrderDetailsPageProps {
    order: SerializedOrder;
}

export default function OrderDetailsPage({ order }: OrderDetailsPageProps) {
    // Safe casting to work with child components that expect Decimal types
    // In reality, our order object has number values instead of Decimal objects
    // eslint-disable-next-line
    const orderWithCompatibleTypes = order as any;

    return (
        <MotionDiv
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
                <MotionDiv
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
                                            "text-sm px-4 py-1 rounded-full uppercase hover:text-white",
                                        )}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <ProductDetails
                                        order={orderWithCompatibleTypes}
                                    />
                                    <DeliveryDetails
                                        order={orderWithCompatibleTypes}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </MotionDiv>

                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-white">
                        <OrderTimeline order={orderWithCompatibleTypes} />
                    </Card>
                </MotionDiv>

                {order?.attachment && order?.attachment?.urls?.length > 0 && (
                    <div className="mt-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            Attached Files
                        </h4>
                        <div className="space-y-2">
                            {order?.attachment?.urls.map((u, idx) => (
                                <Link
                                    key={idx}
                                    href={u}
                                    target="_blank"
                                    className="flex items-center p-2 bg-white rounded-md hover:bg-blue-50 transition-colors text-primary group"
                                >
                                    <ReceiptText className="h-4 w-4 mr-2" />
                                    <span className="flex-1 text-gray-700">
                                        Attachment {idx + 1}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MotionDiv>
    );
}
