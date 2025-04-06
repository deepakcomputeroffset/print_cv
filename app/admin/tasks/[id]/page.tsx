import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TASK_STATUS } from "@prisma/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ViewFilesModal } from "@/components/admin/view-files-modal";
import { Button } from "@/components/ui/button";

const TaskActions = dynamic(() => import("../components/TaskActions"));

export default async function TaskDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (
        !session ||
        session?.user?.userType != "staff" ||
        (session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    ) {
        return redirect("/");
    }

    const { id } = await params;
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
        return redirect("/admin/tasks");
    }

    // Fetch task with related job, orders and attachments
    const task = await Prisma.task.findUnique({
        where: { id: taskId },
        include: {
            taskType: true,
            job: {
                include: {
                    orders: {
                        include: {
                            customer: true,
                            productItem: {
                                include: {
                                    product: true,
                                },
                            },
                            attachment: true,
                        },
                    },
                },
            },
            assignee: true,
        },
    });

    if (!task) {
        return redirect("/admin/tasks");
    }

    return (
        <div className="space-y-6 h-full min-h-full">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-semibold">Task Details</h1>
            </div>

            {/* Task Details */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>
                        Task #{task.id}: {task.taskType.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>
                            <Badge
                                variant={
                                    task.status === TASK_STATUS.PENDING
                                        ? "secondary"
                                        : task.status ===
                                            TASK_STATUS.IN_PROGRESS
                                          ? "default"
                                          : "outline"
                                }
                            >
                                {task.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Job</p>
                            <p className="font-medium">
                                <Link
                                    href={`/admin/job/${task.jobId}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {task.job?.name || `Job #${task.jobId}`}
                                </Link>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Assigned To
                            </p>
                            <p className="font-medium">
                                {task.assignee?.name || "Unassigned"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Created
                            </p>
                            <p className="font-medium">
                                {format(new Date(task.createdAt), "PPP p")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Started
                            </p>
                            <p className="font-medium">
                                {task.startedAt
                                    ? format(new Date(task.startedAt), "PPP p")
                                    : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Completed
                            </p>
                            <p className="font-medium">
                                {task.completedAt
                                    ? format(
                                          new Date(task.completedAt),
                                          "PPP p",
                                      )
                                    : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <TaskActions task={JSON.parse(JSON.stringify(task))} />
                    </div>
                </CardContent>
            </Card>

            {/* Related Orders */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Related Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {task.job?.orders && task.job.orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Files</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {task.job.orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            #{order.id}
                                        </TableCell>
                                        <TableCell>
                                            {order.customer?.name}
                                        </TableCell>
                                        <TableCell>
                                            {order.productItem?.product?.name}
                                        </TableCell>
                                        <TableCell>{order.qty}</TableCell>
                                        <TableCell>
                                            {order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {order?.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {order.attachment &&
                                                order.attachment.urls.length >
                                                    0 && (
                                                    <ViewFilesModal
                                                        orderId={order.id}
                                                        files={
                                                            order.attachment
                                                                .urls
                                                        }
                                                    />
                                                )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                >
                                                    View Order
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            No orders associated with this task
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
