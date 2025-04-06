"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TASK_STATUS, job, task, taskType } from "@prisma/client";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function TaskActions({
    task,
}: {
    task: task & { job: job; taskType: taskType };
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (url: string, actionName: string) => {
        setIsLoading(true);

        try {
            const response = await axios.post(url);
            toast.success(
                response.data.message || `${actionName} completed successfully`,
            );
            router.refresh();
        } catch (err) {
            console.error(`${actionName} failed:`, err);

            let errorMessage = "An error occurred";
            if (axios.isAxiosError(err)) {
                errorMessage =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    `Failed to ${actionName.toLowerCase()}`;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            {task.status === TASK_STATUS.PENDING && (
                <Button
                    onClick={() =>
                        handleAction(
                            `/api/tasks/${task.id}/start`,
                            "Start Working",
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
            {task.status === TASK_STATUS.IN_PROGRESS && (
                <Button
                    onClick={() =>
                        handleAction(
                            `/api/tasks/${task.id}/complete`,
                            "Mark Complete",
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
            {task.status === TASK_STATUS.COMPLETED && (
                <Button
                    variant="secondary"
                    onClick={() =>
                        handleAction(`/api/tasks/${task.id}/reopen`, "Re-open")
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
            <Button
                variant="outline"
                onClick={() => router.push("/admin/tasks")}
            >
                Back to Tasks
            </Button>
        </div>
    );
}
