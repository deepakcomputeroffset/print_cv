"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Eye, Upload } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useOrder } from "@/hooks/use-order";
import { QueryParams } from "@/types/types";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/getStatusColor";
import { OrdersFilter } from "@/components/order/filter";
import { sourceSerif4 } from "@/lib/font";
import { NUMBER_PRECISION } from "@/lib/constants";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/pagination";
import TableLoader from "@/components/loaders/tableLoader";

export default function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const params = use(searchParams);
    const { orders, isLoading, totalPages } = useOrder(params);
    // const [searchTerm, setSearchTerm] = useState(params?.search ?? "");

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <div className="mb-10">
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

                    {/* <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled
                        />
                    </div> */}
                </div>

                <div className="p-6 rounded-xl shadow-sm mb-8">
                    <OrdersFilter filters={params} isLoading={isLoading} />
                </div>
            </div>

            <div className="w-full overflow-x-auto">
                {isLoading && <TableLoader rows={8} />}

                {!isLoading && (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="font-medium text-nowrap text-gray-600">
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
                                <TableHead className="text-end font-medium text-gray-600">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="group hover:bg-primary/5"
                                >
                                    <TableCell className="font-medium text-gray-700">
                                        #{order.id}
                                    </TableCell>
                                    <TableCell className="max-w-[150px] text-nowrap truncate">
                                        {order?.productItem?.product?.name}
                                    </TableCell>
                                    <TableCell>{order?.qty}</TableCell>
                                    <TableCell className="font-medium text-nowrap">
                                        ₹
                                        {order?.total.toFixed(NUMBER_PRECISION)}
                                    </TableCell>
                                    <TableCell className="text-nowrap">
                                        {format(
                                            new Date(order?.createdAt),
                                            "dd MMM yyyy, h:mm a",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                getStatusColor(order.status),
                                                "text-xs px-2.5 py-0.5 rounded-full font-medium hover:text-white",
                                            )}
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-end flex items-center justify-end">
                                        <div className="flex w-full max-w-52 justify-between gap-2">
                                            {order?.status === "PLACED" &&
                                            order?.uploadFilesVia ===
                                                "UPLOAD" ? (
                                                <Button
                                                    variant="destructive"
                                                    // size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/customer/orders/file-upload?orderId=${order.id}`}
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        <span>Upload File</span>
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <span> </span>
                                            )}
                                            <Button
                                                variant="secondary"
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter className="w-full border">
                            <TableRow>
                                <TableCell colSpan={7} className="w-full">
                                    <Pagination
                                        totalPage={totalPages}
                                        isLoading={isLoading}
                                        className="mt-0"
                                    />
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
                {(!orders || orders.length === 0) && !isLoading && (
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
                            No Orders
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}
