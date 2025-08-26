"use client";
import React from "react";
import { QueryParams } from "@/types/types";
import { useOrdersPlaced } from "@/hooks/use-orders-placed";
import { defaultOrderPerPage, NUMBER_PRECISION } from "@/lib/constants";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { OrdersFilter } from "./components/filter";
import { IndianRupee, Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/pagination";
import Link from "next/link";

export default function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { isLoading, orders, totalPages } = useOrdersPlaced({
        ...filters,
        sortorder:
            filters?.sortorder !== undefined ? filters?.sortorder : "desc",
        perpage: filters?.perpage || defaultOrderPerPage,
        orderStatus: "PLACED",
    });

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-bold">File Uploading</h1>
            </div>
            <div className="space-y-4">
                <OrdersFilter filters={filters} />

                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="animate-spin w-4 h-4" />
                    </div>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Id</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>File</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length > 0 ? (
                                        orders?.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    {order.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {
                                                                order.customer
                                                                    ?.name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                order.customer
                                                                    ?.phone
                                                            }
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                order.customer
                                                                    ?.businessName
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {
                                                                order
                                                                    .productItem
                                                                    ?.product
                                                                    ?.name
                                                            }{" "}
                                                            (
                                                            {
                                                                order
                                                                    .productItem
                                                                    ?.sku
                                                            }
                                                            )
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                order
                                                                    .productItem
                                                                    ?.product
                                                                    ?.category
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.qty}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <IndianRupee className="w-3 h-3" />
                                                        {order.total.toFixed(
                                                            NUMBER_PRECISION,
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs">
                                                            {format(
                                                                order.createdAt,
                                                                "dd/MM/yyyy",
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(
                                                                order.createdAt,
                                                                "hh:MMa",
                                                            )}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size={"sm"}
                                                        variant={"destructive"}
                                                    >
                                                        <Link
                                                            href={`/admin/file-upload/${order.id}`}
                                                        >
                                                            Upload
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center space-x-6 lg:space-x-8">
                                <Pagination
                                    totalPage={totalPages}
                                    isLoading={isLoading}
                                    className="mt-0"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
