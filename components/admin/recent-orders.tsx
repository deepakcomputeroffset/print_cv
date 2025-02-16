import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { customer, order } from "@prisma/client";

export function RecentOrders({
    orders,
}: {
    orders: (order & { customer: Partial<customer> })[];
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
                        <TableCell>{order.customerId}</TableCell>
                        <TableCell>{order.status}</TableCell>
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
