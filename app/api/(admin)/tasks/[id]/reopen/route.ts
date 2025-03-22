import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE, TASK_STATUS } from "@prisma/client";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForJobManagement.includes(
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

        const { id } = await params;
        const taskId = parseInt(id);
        const staffId = session.user.staff?.id;

        const task = await Prisma.task.findUnique({
            where: { id: taskId },
            include: { job: { select: { tasks: true } } },
        });

        if (!task)
            return serverResponse({
                success: false,
                error: "Task not found",
                status: 404,
            });
        if (task.assignedStaffId !== staffId)
            return serverResponse({
                success: false,
                error: "Unauthorized access",
                status: 403,
            });
        if (task.status !== TASK_STATUS.COMPLETED)
            return serverResponse({
                success: false,
                error: "Task is not completed",
                status: 400,
            });

        // Check if there are any newer completed tasks
        const newerCompleted = await Prisma.task.findFirst({
            where: {
                jobId: task.jobId,
                completedAt: { gt: task.completedAt || new Date(0) },
            },
        });

        if (newerCompleted) {
            return serverResponse({
                success: false,
                error: "Cannot reopen task as newer tasks have been completed",
                status: 400,
            });
        }

        const updatedTask = await Prisma.task.update({
            where: { id: taskId },
            data: {
                status: TASK_STATUS.IN_PROGRESS,
                completedAt: null,
            },
        });

        return serverResponse({
            success: true,
            data: updatedTask,
            message: "Task reopened successfully",
            status: 200,
        });
    } catch (error) {
        console.error("[TASK_REOPEN]", error);
        return serverResponse({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
            status: 500,
        });
    }
}
