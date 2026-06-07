import { formatDistanceToNow } from "date-fns";
import { STATUS } from "@prisma/client";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    PROCESSED: "bg-indigo-50 text-indigo-700",
    DISPATCHED: "bg-purple-50 text-purple-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
    IMPROPER: "bg-orange-50 text-orange-700",
};

export function RecentOrders({
    orders,
}: {
    orders: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: STATUS;
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
        <div className="divide-y" style={{ borderColor: "hsl(var(--gmail-border))" }}>
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gmail-hover transition-colors cursor-default"
                >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gmail-surface text-gmail-text-secondary text-xs font-semibold">
                        #{order.id}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gmail-text truncate">
                            {order?.customer?.name}
                        </p>
                        <p className="text-xs text-gmail-text-secondary truncate">
                            {order?.productItem?.product?.name}
                        </p>
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[order?.status] || "bg-gray-50 text-gray-700"}`}>
                        {order?.status}
                    </span>
                    <span className="text-xs text-gmail-text-secondary whitespace-nowrap">
                        {formatDistanceToNow(new Date(order.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                </div>
            ))}
        </div>
    );
}
