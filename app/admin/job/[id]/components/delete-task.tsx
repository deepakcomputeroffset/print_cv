"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function DeleteTask({ taskId }: { taskId: number }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            setIsLoading(true);
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete task");

            toast.success("Task deleted successfully");
            window.location.reload();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete task",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
        >
            <span className="sr-only">Delete</span>
            <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
    );
}
