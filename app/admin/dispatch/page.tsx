import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
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

export default function DispatchPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const filters = use(searchParams);
    const { orders } = useDispatch(filters);

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="w-8 h-8" />
                    <h1 className="text-2xl font-semibold">Dispatch</h1>
                </div>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>JobId</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders?.map((order) => (
                                <TableRow key={order?.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.jobId}</TableCell>
                                    <TableCell>
                                        {order.productItem.product.name} (
                                        {order.productItem.sku})
                                    </TableCell>
                                    <TableCell>
                                        {order?.customer?.name}
                                        {order?.customer?.address?.line}
                                        <span>
                                            {order?.customer?.address?.pinCode},
                                            {
                                                order?.customer?.address?.city
                                                    ?.name
                                            }
                                            ,
                                            {
                                                order?.customer?.address?.city
                                                    ?.name
                                            }
                                            ,
                                            {
                                                order?.customer?.address?.city
                                                    ?.state.name
                                            }
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
