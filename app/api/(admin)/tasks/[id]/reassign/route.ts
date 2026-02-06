import { Prisma } from "@/lib/prisma";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { notifyTaskAssigned } from "@/lib/sse/events";

export async function PATCH(
    request: Request,
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
        const { staffId } = await request.json();

        if (isNaN(taskId)) {
            return serverResponse({
                success: false,
                error: "Invalid task ID",
                status: 400,
            });
        }

        if (!staffId) {
            return serverResponse({
                success: false,
                error: "Staff ID is required",
                status: 400,
            });
        }

        const staff = await Prisma.staff.findUnique({
            where: { id: staffId },
        });

        if (!staff) {
            return serverResponse({
                success: false,
                error: "Staff member not found",
                status: 404,
            });
        }

        const task = await Prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return serverResponse({
                success: false,
                error: "Task not found",
                status: 404,
            });
        }

        const updatedTask = await Prisma.task.update({
            where: { id: taskId },
            data: {
                assignedStaffId: staffId,
                startedAt: task.startedAt ? new Date() : null,
                completedAt: null,
                status: task.startedAt ? "IN_PROGRESS" : "PENDING",
            },
            include: {
                assignee: true,
                taskType: true,
                job: true,
            },
        });

        // Notify newly assigned staff in real time
        notifyTaskAssigned({
            userId: staffId,
            taskId: updatedTask.id,
            title: `Task reassigned: ${updatedTask.taskType.name} (Job #${updatedTask.jobId})`,
        });

        return serverResponse({
            success: true,
            data: updatedTask,
            message: "Task reassigned successfully",
            status: 200,
        });
    } catch (error) {
        console.error("[TASK_REASSIGN]", error);
        return serverResponse({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
            status: 500,
        });
    }
}
