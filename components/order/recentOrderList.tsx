"use client";

import { Eye, Package, ShoppingCart, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getStatusColor } from "@/lib/getStatusColor";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { sourceSerif4 } from "@/lib/font";
import { order, product, productItem } from "@prisma/client";
import { NUMBER_PRECISION } from "@/lib/constants";

export default function RecentOrderList({
    orders,
}: {
    orders: (order & { productItem: productItem & { product: product } })[];
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center mb-2">
                        <div className="h-1 w-8 bg-gradient-to-r from-primary to-cyan-400 rounded-full mr-3"></div>
                        <h1
                            className={cn(
                                "text-2xl font-bold text-gray-800",
                                sourceSerif4.className,
                            )}
                        >
                            Recent Orders
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-11">
                        Track and manage your recent printing orders
                    </p>
                </div>
            </div>

            {orders && orders?.length > 0 ? (
                <Card className="overflow-hidden border-0 shadow-md rounded-xl bg-white">
                    <div className="p-1">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="font-medium text-gray-600">
                                            Order ID
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-600">
                                            Product
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-600">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-600">
                                            Amount
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-600">
                                            Date
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-600">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-center font-medium text-gray-600">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders?.map((order, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            key={order.id}
                                            className="group hover:bg-primary/5"
                                        >
                                            <TableCell className="font-medium text-gray-700">
                                                #{order.id}
                                            </TableCell>
                                            <TableCell className="max-w-[150px] truncate">
                                                {
                                                    order?.productItem?.product
                                                        ?.name
                                                }
                                            </TableCell>
                                            <TableCell>{order?.qty}</TableCell>
                                            <TableCell className="font-medium">
                                                ₹
                                                {order?.total.toFixed(
                                                    NUMBER_PRECISION,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(order?.createdAt),
                                                    "dd MMM yyyy",
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        getStatusColor(
                                                            order.status,
                                                        ),
                                                        "text-xs px-2.5 py-0.5 rounded-full font-medium hover:text-white",
                                                    )}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {order?.status === "PLACED" &&
                                                order?.uploadFilesVia ===
                                                    "UPLOAD" ? (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/customer/orders/file-upload?orderId=${order.id}`}
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="group-hover:bg-white/80 group-hover:text-primary transition-colors"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/customer/orders/${order.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </Card>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-white rounded-xl shadow-md border border-primary/5"
                >
                    <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 p-8 rounded-full shadow-sm border border-primary/10">
                        <ShoppingCart className="w-16 h-16 text-primary/70" />
                    </div>

                    <h2
                        className={cn(
                            "text-2xl font-bold mt-8 mb-3",
                            sourceSerif4.className,
                        )}
                    >
                        <span>No Orders </span>
                        <span className="text-primary relative inline-block">
                            Yet
                            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-cyan-500/40"></span>
                        </span>
                    </h2>

                    <p className="text-gray-600 mt-2 max-w-md mb-8">
                        You haven&apos;t placed any orders yet. Once you do,
                        they&apos;ll appear here for easy tracking.
                    </p>

                    <Link href="/categories">
                        <Button className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 px-6 py-2">
                            <Package className="h-4 w-4 mr-2" />
                            Explore Products
                        </Button>
                    </Link>
                </motion.div>
            )}
        </motion.div>
    );
}
