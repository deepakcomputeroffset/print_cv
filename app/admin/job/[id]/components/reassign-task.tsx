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
import { reassignTask } from "@/lib/api/tasks";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
export default function ReassignTask({
    taskId,
    currentStaffId,
    staffMembers,
    session,
}: {
    taskId: number;
    currentStaffId?: number | null;
    staffMembers: staff[];
    session: Session | null;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleReassign = async (staffId: number) => {
        try {
            setIsLoading(true);
            const { data } = await reassignTask(taskId, staffId);
            if (data.success) {
                toast.success(data.message);
                router.refresh();
            } else {
                toast.error(data.error);
            }
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
                        {session?.user?.staff?.id == staff.id
                            ? `Me (${staff.name})`
                            : staff.name}
                        {staff.id === currentStaffId && " (current)"}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
