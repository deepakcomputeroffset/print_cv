"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { staff } from "@prisma/client";
import { Pencil } from "lucide-react";

export default function ReassignTask({
    taskId,
    currentStaffId,
    staffMembers,
}: {
    taskId: number;
    currentStaffId?: number | null;
    staffMembers: staff[];
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReassign = async (staffId: number) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/tasks/${taskId}/reassign`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ staffId }),
            });

            if (!response.ok) throw new Error("Failed to reassign task");

            toast.success("Task reassigned successfully");
            window.location.reload();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to reassign task",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                    <span className="sr-only">Reassign</span>
                    <Pencil className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {staffMembers.map((staff) => (
                    <DropdownMenuItem
                        key={staff.id}
                        onSelect={() => handleReassign(staff.id)}
                        disabled={staff.id === currentStaffId}
                    >
                        {staff.name}
                        {staff.id === currentStaffId && " (current)"}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
