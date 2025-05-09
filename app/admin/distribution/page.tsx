"use client";
import { LoadingRow } from "@/components/loading-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDistribution } from "@/hooks/use-distribution";
import { sourceSerif4 } from "@/lib/font";
import { cn } from "@/lib/utils";
import { QueryParams } from "@/types/types";
import { Check, Loader2, MapPin, Package, User } from "lucide-react";
import React from "react";
import { CustomerFilterforDistributor } from "./components/filter";

export default function Distribution({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = React.use(searchParams);
    const { distributionOrders, isLoading, updateDistributionOrder } =
        useDistribution(filters);
    const {
        distributionOrders: distributedOrders,
        isLoading: isLoadingDistributedOrders,
    } = useDistribution({ ...filters, completed: "true" });

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
                        Distribution Management
                    </h1>
                </div>
                <CustomerFilterforDistributor filters={filters} />
            </div>

            <Card className="border-primary/5">
                <CardHeader>
                    <CardTitle>Orders to Distribute</CardTitle>
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
                                        Customer
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Phone
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Product
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
                                ) : distributionOrders?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Package className="w-12 h-12 mb-4 text-gray-400" />
                                                <p className="text-sm">
                                                    No orders to distribute
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    distributionOrders?.map((dist) => (
                                        <TableRow key={dist?.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-primary" />
                                                    #{dist?.id}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">
                                                            {
                                                                dist?.order
                                                                    ?.customer
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>
                                                            {
                                                                dist?.order
                                                                    ?.customer
                                                                    ?.address
                                                                    ?.line
                                                            }
                                                            ,{" "}
                                                            {
                                                                dist?.order
                                                                    ?.customer
                                                                    ?.address
                                                                    ?.pinCode
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {
                                                            dist?.order
                                                                ?.customer
                                                                ?.address?.city
                                                                ?.name
                                                        }
                                                        ,{" "}
                                                        {
                                                            dist?.order
                                                                ?.customer
                                                                ?.address?.city
                                                                ?.state.name
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {dist?.order?.customer?.phone}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {
                                                            dist?.order
                                                                ?.productItem
                                                                ?.product?.name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        SKU:{" "}
                                                        {
                                                            dist?.order
                                                                ?.productItem
                                                                ?.sku
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {dist?.completed === false
                                                        ? "Pending"
                                                        : "Completed"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    variant={"secondary"}
                                                    disabled={
                                                        isLoading ||
                                                        updateDistributionOrder.isPending
                                                    }
                                                    onClick={() => {
                                                        const confirmed =
                                                            confirm(
                                                                "Are you sure you want to update distribution status of this order?",
                                                            );
                                                        if (confirmed)
                                                            updateDistributionOrder.mutate(
                                                                {
                                                                    orderId:
                                                                        dist?.orderId,
                                                                },
                                                            );
                                                    }}
                                                >
                                                    {updateDistributionOrder.isPending ? (
                                                        <Loader2 />
                                                    ) : (
                                                        <Check className="w-5 h-5" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-primary/5">
                <CardHeader>
                    <CardTitle>Distributed Orders</CardTitle>
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
                                        Customer
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Phone
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Product
                                    </TableHead>
                                    <TableHead className="font-medium">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoadingDistributedOrders ? (
                                    <LoadingRow
                                        colSpan={5}
                                        text="Loading orders..."
                                    />
                                ) : distributedOrders?.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Package className="w-12 h-12 mb-4 text-gray-400" />
                                                <p className="text-sm">
                                                    No distributed orders found.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    distributedOrders?.map((dist) => (
                                        <TableRow key={dist?.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-4 h-4 text-primary" />
                                                    #{dist?.id}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="font-medium">
                                                            {
                                                                dist?.order
                                                                    ?.customer
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>
                                                            {
                                                                dist?.order
                                                                    ?.customer
                                                                    ?.address
                                                                    ?.line
                                                            }
                                                            ,{" "}
                                                            {
                                                                dist?.order
                                                                    ?.customer
                                                                    ?.address
                                                                    ?.pinCode
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {
                                                            dist?.order
                                                                ?.customer
                                                                ?.address?.city
                                                                ?.name
                                                        }
                                                        ,{" "}
                                                        {
                                                            dist?.order
                                                                ?.customer
                                                                ?.address?.city
                                                                ?.state.name
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {dist?.order?.customer?.phone}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {
                                                            dist?.order
                                                                ?.productItem
                                                                ?.product?.name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        SKU:{" "}
                                                        {
                                                            dist?.order
                                                                ?.productItem
                                                                ?.sku
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {dist?.completed === false
                                                        ? "Pending"
                                                        : "Completed"}
                                                </Badge>
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
