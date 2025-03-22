import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";
import { TASK_STATUS } from "@prisma/client";
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

        // Check if all previous tasks are completed
        const previousIncomplete = await Prisma.task.findFirst({
            where: {
                jobId: task.jobId,
                createdAt: { lt: task.createdAt },
                status: { not: TASK_STATUS.COMPLETED },
            },
            orderBy: { createdAt: "asc" },
        });

        if (previousIncomplete) {
            return serverResponse({
                success: false,
                error: "Cannot start task until all previous tasks are completed",
                status: 400,
            });
        }

        const updatedTask = await Prisma.task.update({
            where: { id: taskId },
            data: {
                status: TASK_STATUS.IN_PROGRESS,
                startedAt: new Date(),
            },
        });

        return serverResponse({
            success: true,
            data: updatedTask,
            message: "Task started successfully",
            status: 200,
        });
    } catch (error) {
        console.error("[TASK_START]", error);
        return serverResponse({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
            status: 500,
        });
    }
}
