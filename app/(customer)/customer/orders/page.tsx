"use client";

import { use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useOrder } from "@/hooks/use-order";
import { QueryParams } from "@/types/types";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/getStatusColor";

export default function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const params = use(searchParams);
    const { orders } = useOrder(params);

    return (
        <div className="max-w-customHaf lg:max-w-custom mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-[#660A27] dark:text-gray-100">
                My Orders
            </h1>

            <Card className="p-4 sm:p-6 shadow-md rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <Table className="w-full min-w-[600px]">
                        <TableHeader>
                            <TableRow className="bg-gray-100 dark:bg-gray-700">
                                <TableHead>Order ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                                >
                                    <TableCell className="font-medium">
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        {order?.productItem?.product?.name}
                                    </TableCell>
                                    <TableCell>{order?.qty}</TableCell>
                                    <TableCell>₹{order?.amount}</TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(order?.createdAt),
                                            "dd/MM/yyyy",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                getStatusColor(order.status),
                                                "text-sm px-3 py-1 rounded-full hover:text-white",
                                            )}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/customer/orders/${order.id}`}
                                            >
                                                <Eye className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
