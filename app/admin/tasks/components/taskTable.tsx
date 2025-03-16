"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { task, TASK_STATUS, taskType, job } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ClientTaskTable({
    pendingTasks,
    inProgressTasks,
    completedTasks,
}: {
    pendingTasks: (task & { job: job; taskType: taskType })[];
    inProgressTasks: (task & { job: job; taskType: taskType })[];
    completedTasks: (task & { job: job; taskType: taskType })[];
}) {
    const router = useRouter();
    const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set());

    const handleAction = async (taskId: string, url: string) => {
        setLoadingTasks((prev) => new Set(prev.add(taskId)));

        try {
            const response = await axios.post(url);
            toast.success(
                response.data.message || "Action completed successfully",
            );
            router.refresh();
        } catch (err) {
            console.error("Action failed:", err);

            let errorMessage = "An error occurred";
            if (axios.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Failed to complete action";
            }

            toast.error(errorMessage);
        } finally {
            setLoadingTasks((prev) => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
            });
        }
    };

    const renderTable = (
        tasks: (task & { job: job; taskType: taskType })[],
        status: TASK_STATUS,
        title: string,
    ) =>
        tasks.length > 0 && (
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task Name</TableHead>
                            <TableHead>Job ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Started At</TableHead>
                            <TableHead>Completed At</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => {
                            const isLoading = loadingTasks.has(
                                task?.id.toString(),
                            );
                            return (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">
                                        {task.taskType.name}
                                    </TableCell>
                                    <TableCell>{`${task?.jobId} (${task?.job?.name})`}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                status === TASK_STATUS.PENDING
                                                    ? "secondary"
                                                    : status ===
                                                        TASK_STATUS.IN_PROGRESS
                                                      ? "default"
                                                      : "outline"
                                            }
                                        >
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(task.createdAt),
                                            "dd/MM/yyyy HH:mm",
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {task.startedAt
                                            ? format(
                                                  new Date(task.startedAt),
                                                  "dd/MM/yyyy HH:mm",
                                              )
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {task.completedAt
                                            ? format(
                                                  new Date(task.completedAt),
                                                  "dd/MM/yyyy HH:mm",
                                              )
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {status === TASK_STATUS.PENDING && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAction(
                                                        task.id.toString(),
                                                        `/api/tasks/${task.id}/start`,
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Starting...
                                                    </span>
                                                ) : (
                                                    "Start Working"
                                                )}
                                            </Button>
                                        )}
                                        {status === TASK_STATUS.IN_PROGRESS && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleAction(
                                                        task.id.toString(),
                                                        `/api/tasks/${task.id}/complete`,
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Completing...
                                                    </span>
                                                ) : (
                                                    "Mark Complete"
                                                )}
                                            </Button>
                                        )}
                                        {status === TASK_STATUS.COMPLETED && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    handleAction(
                                                        task.id.toString(),
                                                        `/api/tasks/${task.id}/reopen`,
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Reopening...
                                                    </span>
                                                ) : (
                                                    "Re-open"
                                                )}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );

    return (
        <>
            {renderTable(
                inProgressTasks,
                TASK_STATUS.IN_PROGRESS,
                "In Progress Tasks",
            )}
            {renderTable(pendingTasks, TASK_STATUS.PENDING, "Pending Tasks")}
            {renderTable(
                completedTasks,
                TASK_STATUS.COMPLETED,
                "Completed Tasks",
            )}

            {!pendingTasks.length &&
                !inProgressTasks.length &&
                !completedTasks.length && (
                    <div className="text-center text-muted-foreground py-8">
                        No tasks assigned
                    </div>
                )}
        </>
    );
}
