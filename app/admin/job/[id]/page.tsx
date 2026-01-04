import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Prisma } from "@/lib/prisma";
import { IndianRupee } from "lucide-react";
import JobVerification from "./components/jobVerification";
import RemoveOrderFromJob from "./components/removeOrderFromJob";
import { format } from "date-fns";
import { TaskForm } from "./components/addTaskForm";
import { Badge } from "@/components/ui/badge";
import JobUnverification from "./components/jobUnverification";
import ReassignTask from "./components/reassign-task";
import DeleteTask from "./components/delete-task";
import CompleteJobButton from "./components/completeJobButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ViewFilesModal } from "@/components/view-files-modal";
import { ViewFilesButton } from "@/components/ViewFilesButton";

export default async function JobPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (
        !session ||
        !allowedRoleForJobManagement.includes(
            session.user?.staff?.role as ROLE,
        ) ||
        (session.user?.staff?.role !== "ADMIN" &&
            session.user.staff?.isBanned === true)
    ) {
        redirect("/login");
    }
    const { id } = await params;
    const job = await Prisma.job.findUnique({
        where: { id: parseInt(id) },
        include: {
            staff: true,
            tasks: {
                include: {
                    taskType: true,
                    assignee: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
            orders: {
                include: {
                    customer: true,
                    productItem: true,
                    attachment: true,
                },
            },
        },
    });

    if (!job) {
        return (
            <div className="p-6 text-center text-red-500">Job not found</div>
        );
    }

    const taskTypes = await Prisma.taskType.findMany();
    const staffMembers = await Prisma.staff.findMany();

    const hasTasks = job.tasks.length > 0;
    const allTasksCompleted = job.tasks.every((task) => task.completedAt);
    const canComplete =
        hasTasks && allTasksCompleted && job.isCompleted === false;
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">
                            Job: {job.name} ({job.id})
                        </h1>
                    </div>
                    <div className="mt-2 space-y-1 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            Status:
                            <Badge
                                variant={
                                    job.isCompleted
                                        ? "default"
                                        : job.isVerified
                                          ? "secondary"
                                          : "outline"
                                }
                            >
                                {job.isCompleted
                                    ? "Completed"
                                    : job.isVerified
                                      ? "Verified"
                                      : "Pending"}
                            </Badge>
                        </div>
                        {job?.isVerified && (
                            <p>
                                Verified by:{" "}
                                <span className="font-medium">
                                    {job?.staff?.id == session.user.staff?.id
                                        ? "me"
                                        : job?.staff?.name}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    {!job.isVerified && <JobVerification jobId={Number(id)} />}
                    {job.isVerified && !job.isCompleted && <JobUnverification jobId={Number(id)} />}
                    {canComplete && <CompleteJobButton jobId={job.id} />}
                </div>
            </div>

            {/* Tasks Section */}
            <TaskForm
                jobId={job.id}
                taskTypes={taskTypes}
                staffMembers={staffMembers}
                existingTasks={job.tasks}
                session={session}
            />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Tasks ({job.tasks.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {job.tasks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task Type</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Started At</TableHead>
                                    <TableHead>Completed At</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {job.tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">
                                            {task.taskType.name}
                                        </TableCell>
                                        <TableCell>
                                            {task.assignee ? (
                                                <Badge variant="outline">
                                                    {task.assignee.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Unassigned
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    task.completedAt
                                                        ? "default"
                                                        : task.startedAt
                                                          ? "secondary"
                                                          : "outline"
                                                }
                                            >
                                                {task.completedAt
                                                    ? "Completed"
                                                    : task.startedAt
                                                      ? "In Progress"
                                                      : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {task.startedAt
                                                ? format(
                                                      task.startedAt,
                                                      "dd MM yyyy HH:mm",
                                                  )
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {task.completedAt
                                                ? format(
                                                      task.completedAt,
                                                      "dd MM yyyy HH:mm",
                                                  )
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <ReassignTask
                                                taskId={task.id}
                                                currentStaffId={
                                                    task.assignedStaffId
                                                }
                                                staffMembers={staffMembers}
                                                session={session}
                                            />
                                            <DeleteTask taskId={task.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-6">
                            No tasks created yet
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Orders Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Orders ({job.orders.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {job.orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">
                                        Order ID
                                    </TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        Created At
                                    </TableHead>
                                    {!job.isVerified && (
                                        <TableHead>Actions</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {job.orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="whitespace-nowrap">
                                            #{order.id}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.customer.name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.productItem?.sku}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {order.qty}
                                        </TableCell>
                                        <TableCell className="flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4" />
                                            {order?.total}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {format(
                                                job.createdAt,
                                                "dd MMM yyyy",
                                            )}
                                        </TableCell>
                                        {!job.isVerified && (
                                            <TableCell className="flex space-x-1">
                                                {!!order?.attachment && (
                                                    <ViewFilesButton
                                                        order={{
                                                            id: order.id,
                                                            attachment:
                                                                order.attachment,
                                                        }}
                                                    />
                                                )}
                                                <RemoveOrderFromJob
                                                    jobId={job.id}
                                                    orderId={order.id}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-6">
                            No orders associated with this job
                        </div>
                    )}
                </CardContent>
            </Card>

            <ViewFilesModal />
        </div>
    );
}
