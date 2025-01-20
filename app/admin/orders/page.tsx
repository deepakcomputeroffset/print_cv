"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface OrderItem {
    id: string;
    product: {
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    user: {
        name: string;
        email: string;
    };
    items: OrderItem[];
    status: string;
    totalAmount: number;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    // const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch orders");
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update order status");

            toast.success("Order status updated successfully");
            fetchOrders();
        } catch (error) {
            console.error(error);
            toast.error("Error updating order status");
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            (order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === "ALL" || order.status === statusFilter),
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Orders</h1>
                <div className="flex gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">
                                Processing
                            </SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">
                                            {order.user.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {order.user.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {order.items.map((item) => (
                                        <div key={item.id} className="text-sm">
                                            {item.quantity}x {item.product.name}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    ${order.totalAmount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order?.status}
                                        onValueChange={(value) =>
                                            updateOrderStatus(order.id, value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="PROCESSING">
                                                Processing
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="CANCELLED">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        order.createdAt,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            // Implement view order details
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
