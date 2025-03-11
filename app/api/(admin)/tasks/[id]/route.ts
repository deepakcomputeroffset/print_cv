import { auth } from "@/lib/auth";
import { allowedRoleForJobManagement } from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export async function DELETE(
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
        if (isNaN(taskId)) {
            return serverResponse({
                success: false,
                error: "Invalid task ID",
                status: 400,
            });
        }

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            return serverResponse({
                success: false,
                error: "Task not found",
                status: 404,
            });
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return serverResponse({
            success: true,
            data: null,
            message: "Task deleted successfully",
            status: 200,
        });
    } catch (error) {
        console.error("[TASK_DELETE]", error);
        return serverResponse({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
            status: 500,
        });
    }
}
