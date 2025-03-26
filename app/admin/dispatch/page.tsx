"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryParams } from "@/types/types";
import React, { use } from "react";
import { useDispatch } from "@/hooks/use-dispatch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sourceSerif4 } from "@/lib/font";
import { Package, Truck, MapPin, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { LoadingRow } from "@/components/loading-row";

export default function DispatchPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = use(searchParams);
    const { orders, isLoading, updateOrderDispatch } = useDispatch(filters);
    const {
        orders: dispatchedOrders,
        isLoading: dispatchedOrdersLoading,
        updateOrderDispatch: updateDispatchedOrderDispatch,
    } = useDispatch({ ...filters, dispatched: "true" });
    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1
                        className={cn(
                            "text-2xl font-semibold",
                            sourceSerif4.className,
                        )}
                    >
                        Dispatch Management
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Truck className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button size="sm">
                        <Package className="w-4 h-4 mr-2" />
                        New Dispatch
                    </Button>
                </div>
            </div>

            <Card className="border-primary/5">
                <CardHeader>
                    <CardTitle>Orders to Dispatch</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-medium">
                                        Order ID
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Job Details
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Product
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Customer
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Status
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    <LoadingRow
                                        colSpan={6}
                                        text="Loading orders..."
                                    />
                                ) : orders?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Package className="w-12 h-12 mb-4 text-gray-400" />
                                                <p className="text-sm">
                                                    No orders to dispatch
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders?.map((order) => (
                                        <TableRow key={order?.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-primary" />
                                                    #{order?.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        #{order?.jobId}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(
                                                            new Date(
                                                                order?.createdAt,
                                                            ),
                                                            "MMM d, yyyy",
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {
                                                            order?.productItem
                                                                ?.product?.name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        SKU:{" "}
                                                        {
                                                            order?.productItem
                                                                ?.sku
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">
                                                            {
                                                                order?.customer
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>
                                                            {
                                                                order?.customer
                                                                    ?.address
                                                                    ?.line
                                                            }
                                                            ,{" "}
                                                            {
                                                                order?.customer
                                                                    ?.address
                                                                    ?.pinCode
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {
                                                            order?.customer
                                                                ?.address?.city
                                                                ?.name
                                                        }
                                                        ,{" "}
                                                        {
                                                            order?.customer
                                                                ?.address?.city
                                                                ?.state.name
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {order.status ===
                                                    "PROCESSING"
                                                        ? "Pending"
                                                        : "Dispatched"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const confirmed =
                                                                confirm(
                                                                    "Are you sure you want to dispatch this order?",
                                                                );
                                                            if (confirmed) {
                                                                updateOrderDispatch.mutate(
                                                                    {
                                                                        id: order?.id,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        disabled={
                                                            order?.status ===
                                                                "DISPATCHED" ||
                                                            updateOrderDispatch.isPending
                                                        }
                                                    >
                                                        <Truck className="w-4 h-4 mr-2" />
                                                        Dispatch
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Dispatched Orders */}
            <Card className="border-primary/5">
                <CardHeader>
                    <CardTitle>Dispatched Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-medium">
                                        Order ID
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Job Details
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Product
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Customer
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Status
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {dispatchedOrdersLoading ? (
                                    <LoadingRow
                                        colSpan={6}
                                        text="Loading orders..."
                                    />
                                ) : dispatchedOrders?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Package className="w-12 h-12 mb-4 text-gray-400" />
                                                <p className="text-sm">
                                                    No orders to dispatch
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dispatchedOrders?.map((order) => (
                                        <TableRow key={order?.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-primary" />
                                                    #{order?.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        #{order?.jobId}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(
                                                            new Date(
                                                                order?.createdAt,
                                                            ),
                                                            "MMM d, yyyy",
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {
                                                            order?.productItem
                                                                ?.product?.name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        SKU:{" "}
                                                        {
                                                            order?.productItem
                                                                ?.sku
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">
                                                            {
                                                                order?.customer
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>
                                                            {
                                                                order?.customer
                                                                    ?.address
                                                                    ?.line
                                                            }
                                                            ,{" "}
                                                            {
                                                                order?.customer
                                                                    ?.address
                                                                    ?.pinCode
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {
                                                            order?.customer
                                                                ?.address?.city
                                                                ?.name
                                                        }
                                                        ,{" "}
                                                        {
                                                            order?.customer
                                                                ?.address?.city
                                                                ?.state.name
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {order.status ===
                                                    "PROCESSING"
                                                        ? "Pending"
                                                        : "Dispatched"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const confirmed =
                                                                confirm(
                                                                    "Are you sure you want to dispatch this order?",
                                                                );
                                                            if (confirmed) {
                                                                updateDispatchedOrderDispatch.mutate(
                                                                    {
                                                                        id: order?.id,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        disabled={
                                                            order?.status ===
                                                                "DISPATCHED" ||
                                                            updateDispatchedOrderDispatch.isPending
                                                        }
                                                    >
                                                        <Truck className="w-4 h-4 mr-2" />
                                                        Dispatch
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
