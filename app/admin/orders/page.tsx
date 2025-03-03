"use client";

import { useState } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Pencil, Trash2, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Order {
    id: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        businessName: string;
    };
    product: {
        id: string;
        name: string;
        category: string;
    };
    quantity: number;
    amount: number;
    status: "PENDING" | "PROCESSING" | "DISPATCHED" | "CANCELLED";
    paymentStatus: "PAID" | "PARTIAL" | "UNPAID";
    createdAt: string;
    notes?: string;
}

export default function OrdersPage() {
    const [orders] = useState<Order[]>([
        {
            id: "ORD001",
            customer: {
                id: "CUST001",
                name: "John Doe",
                email: "john@example.com",
                phone: "+1234567890",
                businessName: "Acme Corp",
            },
            product: {
                id: "PROD001",
                name: "Business Cards",
                category: "Standard Cards",
            },
            quantity: 500,
            amount: 149.99,
            status: "PENDING",
            paymentStatus: "PAID",
            createdAt: "2024-01-15T10:30:00Z",
        },
        {
            id: "ORD002",
            customer: {
                id: "CUST002",
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "+1987654321",
                businessName: "Tech Solutions",
            },
            product: {
                id: "PROD002",
                name: "Brochures",
                category: "Marketing Materials",
            },
            quantity: 1000,
            amount: 299.99,
            status: "PROCESSING",
            paymentStatus: "PARTIAL",
            createdAt: "2024-01-14T15:45:00Z",
        },
        {
            id: "ORD003",
            customer: {
                id: "CUST003",
                name: "Bob Wilson",
                email: "bob@example.com",
                phone: "+1122334455",
                businessName: "Event Masters",
            },
            product: {
                id: "PROD003",
                name: "Banners",
                category: "Large Format",
            },
            quantity: 5,
            amount: 599.99,
            status: "DISPATCHED",
            paymentStatus: "PAID",
            createdAt: "2024-01-13T09:15:00Z",
        },
        {
            id: "ORD004",
            customer: {
                id: "CUST004",
                name: "Alice Brown",
                email: "alice@example.com",
                phone: "+1567890123",
                businessName: "Creative Design",
            },
            product: {
                id: "PROD004",
                name: "Flyers",
                category: "Marketing Materials",
            },
            quantity: 2500,
            amount: 199.99,
            status: "CANCELLED",
            paymentStatus: "UNPAID",
            createdAt: "2024-01-12T14:20:00Z",
        },
    ]);

    // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        paymentStatus: "all",
        dateRange: {
            start: "",
            end: "",
        },
        minAmount: "",
        maxAmount: "",
        sortBy: "date",
        sortOrder: "desc" as "asc" | "desc",
    });

    const getStatusColor = (status: Order["status"]) => {
        const colors = {
            PENDING: "bg-yellow-100 text-yellow-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            DISPATCHED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return colors[status];
    };

    const filteredOrders = orders.filter((order) => {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
            order.id.toLowerCase().includes(searchLower) ||
            order.customer.name.toLowerCase().includes(searchLower) ||
            order.customer.businessName.toLowerCase().includes(searchLower) ||
            order.product.name.toLowerCase().includes(searchLower);

        const matchesStatus =
            filters.status === "all" || order.status === filters.status;
        const matchesPaymentStatus =
            filters.paymentStatus === "all" ||
            order.paymentStatus === filters.paymentStatus;

        const orderDate = new Date(order.createdAt);
        const matchesDateRange =
            (!filters.dateRange.start ||
                orderDate >= new Date(filters.dateRange.start)) &&
            (!filters.dateRange.end ||
                orderDate <= new Date(filters.dateRange.end));

        const matchesAmount =
            (!filters.minAmount ||
                order.amount >= parseFloat(filters.minAmount)) &&
            (!filters.maxAmount ||
                order.amount <= parseFloat(filters.maxAmount));

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPaymentStatus &&
            matchesDateRange &&
            matchesAmount
        );
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const { sortBy, sortOrder } = filters;
        let comparison = 0;

        switch (sortBy) {
            case "date":
                comparison =
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime();
                break;
            case "amount":
                comparison = a.amount - b.amount;
                break;
            case "quantity":
                comparison = a.quantity - b.quantity;
                break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

            <Card className="p-4 mb-6">
                <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        search: e.target.value,
                                    }))
                                }
                                className="flex-1"
                            />
                        </div>

                        <Select
                            value={filters.status}
                            onValueChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PROCESSING">
                                    Processing
                                </SelectItem>
                                <SelectItem value="DISPATCHED">
                                    Dispatched
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.paymentStatus}
                            onValueChange={(value) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    paymentStatus: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Payment status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Payment Status
                                </SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="PARTIAL">Partial</SelectItem>
                                <SelectItem value="UNPAID">Unpaid</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                                setShowAdvancedFilters(!showAdvancedFilters)
                            }
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Advanced Filters
                        </Button>
                    </div>

                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            dateRange: {
                                                ...prev.dateRange,
                                                start: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full"
                                />
                                <span>-</span>
                                <Input
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            dateRange: {
                                                ...prev.dateRange,
                                                end: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    placeholder="Min amount"
                                    value={filters.minAmount}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            minAmount: e.target.value,
                                        }))
                                    }
                                    className="w-full"
                                />
                                <span>-</span>
                                <Input
                                    type="number"
                                    placeholder="Max amount"
                                    value={filters.maxAmount}
                                    onChange={(e) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            maxAmount: e.target.value,
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sortBy: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">
                                            Date
                                        </SelectItem>
                                        <SelectItem value="amount">
                                            Amount
                                        </SelectItem>
                                        <SelectItem value="quantity">
                                            Quantity
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            sortOrder:
                                                prev.sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc",
                                        }))
                                    }
                                >
                                    {filters.sortOrder === "asc" ? "↑" : "↓"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <Card className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    {order.id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.customer.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {order.customer.businessName}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{order.product.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {order.product.category}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>
                                    ${order.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={getStatusColor(order.status)}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    {format(order.createdAt, "hh-M dd/mm/yyyy")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Edit Order {order.id}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label>
                                                            Order Status
                                                        </Label>
                                                        <Select
                                                            defaultValue={
                                                                order.status
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="PENDING">
                                                                    Pending
                                                                </SelectItem>
                                                                <SelectItem value="PROCESSING">
                                                                    Processing
                                                                </SelectItem>
                                                                <SelectItem value="DISPATCHED">
                                                                    Dispatched
                                                                </SelectItem>
                                                                <SelectItem value="CANCELLED">
                                                                    Cancelled
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>
                                                            Payment Status
                                                        </Label>
                                                        <Select
                                                            defaultValue={
                                                                order.paymentStatus
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select payment status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="PAID">
                                                                    Paid
                                                                </SelectItem>
                                                                <SelectItem value="PARTIAL">
                                                                    Partial
                                                                </SelectItem>
                                                                <SelectItem value="UNPAID">
                                                                    Unpaid
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Notes</Label>
                                                        <Textarea
                                                            placeholder="Add notes about this order"
                                                            defaultValue={
                                                                order.notes
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <Button type="submit">
                                                        Save changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog
                                            open={deleteDialogOpen}
                                            onOpenChange={setDeleteDialogOpen}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently
                                                        delete the order. This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-600">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
