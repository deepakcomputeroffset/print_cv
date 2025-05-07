import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function RecentOrders({
    orders,
}: {
    orders: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status:
            | "PENDING"
            | "PROCESSING"
            | "PROCESSED"
            | "DISPATCHED"
            | "CANCELLED"
            | "IMPROPER_ORDER";
        jobId: number | null;
        customerId: number;
        productItemId: number;
        qty: number;
        igst: number;
        uploadCharge: number;
        price: number;
        total: number;
        customer: {
            name: string;
            phone: string;
        };
        productItem: {
            product: {
                name: string;
            };
        };
    }[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">
                            #{order.id}
                        </TableCell>
                        <TableCell>{order?.customer?.name}</TableCell>
                        <TableCell>{order?.status}</TableCell>
                        <TableCell>
                            {formatDistanceToNow(new Date(order.createdAt), {
                                addSuffix: true,
                            })}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
