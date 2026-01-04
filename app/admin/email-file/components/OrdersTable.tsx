"use client";

import { useState } from "react";
import { IndianRupee } from "lucide-react";
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
import { OrderDetailsModal } from "./OrderDetailsModal";
import { NUMBER_PRECISION } from "@/lib/constants";

interface Order {
    id: number;
    qty: number;
    total: number;
    createdAt: Date;
    customer: {
        name: string;
        phone: string;
        businessName: string;
    } | null;
    productItem: {
        sku: string;
        product: {
            name: string;
            category: {
                name: string;
            };
        };
    } | null;
}

interface OrdersTableProps {
    orders: Order[];
    totalPages: number;
}

export function OrdersTable({ orders, totalPages }: OrdersTableProps) {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewOrder = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    return (
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
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders?.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{order.customer?.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {order.customer?.phone}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {order.customer?.businessName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>
                                                {order.productItem?.product?.name}{" "}
                                                ({order.productItem?.sku})
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {
                                                    order.productItem?.product
                                                        ?.category.name
                                                }
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.qty}</TableCell>
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
                                                    "hh:mm a",
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size={"sm"}
                                            variant={"default"}
                                            onClick={() =>
                                                handleViewOrder(order.id)
                                            }
                                        >
                                            Review
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
                        isLoading={false}
                        className="mt-0"
                    />
                </div>
            </div>

            <OrderDetailsModal
                orderId={selectedOrderId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
