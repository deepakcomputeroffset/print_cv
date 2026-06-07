"use client";

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

const statusConfig = {
    COMPLETED: {
        icon: CheckCircle2,
        className: "bg-green-50 text-green-700",
        label: "Done",
    },
    IN_PROGRESS: {
        icon: Clock,
        className: "bg-blue-50 text-blue-700",
        label: "Active",
    },
    PENDING: {
        icon: AlertCircle,
        className: "bg-yellow-50 text-yellow-700",
        label: "Pending",
    },
};

export function RecentTasks({ tasks }: RecentTasksProps) {
    return (
        <div
            className="divide-y"
            style={{ borderColor: "hsl(var(--gmail-border))" }}
        >
            {tasks.map((task) => {
                const config = statusConfig[task.status];
                const StatusIcon = config.icon;
                return (
                    <div
                        key={task.id}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gmail-hover transition-colors cursor-default"
                    >
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${config.className}`}
                        >
                            <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gmail-text truncate">
                                {task.job.name}
                            </p>
                            <p className="text-xs text-gmail-text-secondary truncate">
                                {task.taskType.name}
                            </p>
                        </div>
                        <span
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${config.className}`}
                        >
                            {config.label}
                        </span>
                        <span className="text-xs text-gmail-text-secondary whitespace-nowrap">
                            {formatDistanceToNow(task.createdAt, {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
