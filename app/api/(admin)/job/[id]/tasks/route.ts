import { taskSchema } from "@/schemas/task.form.schema";
import { NextRequest } from "next/server";
import { Prisma } from "@/lib/prisma";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { notifyTaskAssigned } from "@/lib/sse/events";

export async function POST(request: NextRequest) {
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
        const body = await request.json();

        const validation = taskSchema.safeParse(body);
        if (!validation.success) {
            return serverResponse({
                success: false,
                error: validation.error.issues,
                status: 400,
                message: "Invalid task data",
            });
        }

        const { jobId, taskTypeId, assignedStaffId } = validation.data;

        const existingTask = await Prisma.task.findFirst({
            where: {
                jobId,
                taskTypeId,
            },
        });

        if (existingTask) {
            return serverResponse({
                success: false,
                error: "Task type already exists in this job",
                status: 409,
            });
        }

        const task = await Prisma.task.create({
            data: {
                jobId,
                taskTypeId,
                assignedStaffId,
            },
            include: {
                taskType: true,
                assignee: true,
            },
        });

        // Notify assigned staff in real time
        if (assignedStaffId) {
            notifyTaskAssigned({
                userId: assignedStaffId,
                taskId: task.id,
                title: `New task: ${task.taskType.name} (Job #${jobId})`,
            });
        }

        return serverResponse({
            success: true,
            data: task,
            message: "Task created successfully",
            status: 201,
        });
    } catch (error) {
        console.error("[TASKS_POST]", error);
        return serverResponse({
            success: false,
            message: "Internal server error",
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
            status: 500,
        });
    }
}
