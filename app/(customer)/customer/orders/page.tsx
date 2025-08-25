"use client";

import { use, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import {
    ClipboardList,
    Eye,
    FileText,
    Calendar,
    Package,
    ShoppingBag,
    AlertCircle,
    Search,
    Upload,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useOrder } from "@/hooks/use-order";
import { QueryParams } from "@/types/types";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/getStatusColor";
import { OrdersFilter } from "@/components/order/filter";
import { Input } from "@/components/ui/input";
import { LabelButton } from "@/components/order/components/labelButton";
import { sourceSerif4 } from "@/lib/font";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { order, product, productItem } from "@prisma/client";
import { NUMBER_PRECISION } from "@/lib/constants";

export default function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const params = use(searchParams);
    const { orders, isLoading } = useOrder(params);
    const [searchTerm, setSearchTerm] = useState("");
    const { data } = useSession();

    return (
        <div className="container mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="h-1 w-10 bg-gradient-to-r from-primary to-blue-500 rounded-full mr-3"></div>
                            <h1
                                className={cn(
                                    "text-3xl font-bold text-gray-800 dark:text-gray-100",
                                    sourceSerif4.className,
                                )}
                            >
                                My Orders
                            </h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 ml-14">
                            View and manage your order history
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-sm mb-8">
                    <OrdersFilter filters={params} />
                </div>
            </motion.div>

            {!!orders && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card
                                    key={i}
                                    className="p-6 shadow-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-60 animate-pulse"
                                >
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders?.map((order, index) => (
                                <OrderCard
                                    key={order?.id}
                                    order={order}
                                    index={index}
                                    data={data}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {(!orders || orders.length === 0) && !isLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10"
                >
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full shadow-md mb-6">
                        <ClipboardList className="w-20 h-20 text-primary/60" />
                    </div>

                    <h2
                        className={cn(
                            "text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-6",
                            sourceSerif4.className,
                        )}
                    >
                        No Orders Yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
                        You haven&lsquo;t placed any orders yet. Once you do,
                        they&lsquo;ll appear here for easy tracking and
                        management.
                    </p>

                    <Button
                        className="mt-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-medium py-2 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                        size="lg"
                        asChild
                    >
                        <Link href="/customer/categories">
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Browse Products
                        </Link>
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

const getStatusClass = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-500";
        case "DISPATCHED":
            return "bg-blue-500";
        case "PROCESSING":
            return "bg-amber-500";
        default:
            return "bg-gray-500";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "PENDING":
            return <AlertCircle className="h-4 w-4 mr-2" />;
        case "PROCESSING":
            return <Package className="h-4 w-4 mr-2" />;
        case "DISPATCHED":
            return <ShoppingBag className="h-4 w-4 mr-2" />;
        case "COMPLETED":
            return <FileText className="h-4 w-4 mr-2" />;
        default:
            return null;
    }
};

const OrderCard = ({
    order,
    index,
    data,
}: {
    order: order & {
        productItem: productItem & {
            product: product;
        };
    };
    index: number;
    data: Session | null;
}) => {
    return (
        <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
            }}
        >
            <Card className="overflow-hidden shadow-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center mb-1">
                                <div
                                    className={cn(
                                        "h-2 w-2 rounded-full mr-2",
                                        getStatusClass(order.status),
                                    )}
                                ></div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                                    Order #{order.id}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order?.productItem?.product?.name}
                            </p>
                        </div>
                        <Badge
                            className={cn(
                                getStatusColor(order.status),
                                "text-xs px-2 py-1 rounded-full uppercase font-medium",
                            )}
                        >
                            {getStatusIcon(order.status)}
                            {order.status}
                        </Badge>
                    </div>

                    <div className="flex flex-col space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Quantity:
                            </span>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                {order?.qty} units
                            </span>
                        </div>

                        {/* Total Amount */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                Total Amount:
                            </span>
                            <span className="font-bold text-primary">
                                ₹ {order?.total.toFixed(NUMBER_PRECISION)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400 flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                Ordered on:
                            </span>
                            <span className="text-gray-700 dark:text-gray-200">
                                {format(
                                    new Date(order?.createdAt),
                                    "dd MMM yyyy",
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {!!data?.user?.customer?.address && (
                            <div className="flex space-x-2">
                                {order?.status === "PLACED" &&
                                order?.uploadFilesVia === "UPLOAD" ? (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        asChild
                                    >
                                        <Link
                                            href={`/customer/orders/file-upload?orderId=${order.id}`}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Files
                                        </Link>
                                    </Button>
                                ) : (
                                    <LabelButton
                                        order={{
                                            ...order,
                                            customer: {
                                                businessName:
                                                    data?.user?.customer
                                                        ?.businessName || "",
                                                name:
                                                    data?.user?.customer
                                                        ?.name || "",
                                                phone:
                                                    data?.user?.customer
                                                        ?.phone || "",
                                                address:
                                                    data?.user?.customer
                                                        ?.address,
                                            },
                                        }}
                                    />
                                )}
                            </div>
                        )}
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            asChild
                        >
                            <Link href={`/customer/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};
