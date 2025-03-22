import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";
import { allowedRoleForOrderManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; taskId: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForOrderManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { taskId, id } = await params;
        if (!taskId || !id || isNaN(parseInt(taskId)) || isNaN(parseInt(id))) {
            return serverResponse({
                status: 400,
                success: false,
                message: "TaskId and id(jobId) is required.",
            });
        }

        // Mark current task as complete
        const completedTask = await Prisma.task.update({
            where: { id: parseInt(taskId) },
            data: { completedAt: new Date() },
            include: { assignee: true },
        });

        // Start next task if available
        if (completedTask.assignedStaffId) {
            const nextTask = await Prisma.task.findFirst({
                where: {
                    assignedStaffId: completedTask.assignedStaffId,
                    startedAt: null,
                    completedAt: null,
                },
                orderBy: { createdAt: "asc" },
            });

            if (nextTask) {
                await Prisma.task.update({
                    where: { id: nextTask.id },
                    data: { startedAt: new Date() },
                });
            }
        }

        return serverResponse({
            success: true,
            data: completedTask,
            message: "Task marked as complete",
            status: 200,
        });
    } catch (error) {
        console.error("[TASK_COMPLETE]", error);
        return serverResponse({
            success: false,
            error: "Internal server error",
            status: 500,
        });
    }
}
