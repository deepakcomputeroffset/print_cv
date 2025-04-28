"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Task {
    id: number;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    job: {
        name: string;
    };
    taskType: {
        name: string;
    };
}

interface RecentTasksProps {
    tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
    const getStatusBadge = (status: Task["status"]) => {
        switch (status) {
            case "COMPLETED":
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                    </Badge>
                );
            case "IN_PROGRESS":
                return (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <Clock className="w-3 h-3 mr-1" />
                        In Progress
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
        }
    };

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job</TableHead>
                        <TableHead>Task Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">
                                {task.job.name}
                            </TableCell>
                            <TableCell>{task.taskType.name}</TableCell>
                            <TableCell>{getStatusBadge(task.status)}</TableCell>
                            <TableCell>
                                {task.startedAt
                                    ? formatDistanceToNow(task.startedAt, {
                                          addSuffix: true,
                                      })
                                    : "-"}
                            </TableCell>
                            <TableCell>
                                {formatDistanceToNow(task.createdAt, {
                                    addSuffix: true,
                                })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
