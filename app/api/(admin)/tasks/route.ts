import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { Prisma } from "@/lib/prisma";

export async function GET() {
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

        const tasks = await Prisma.task.findMany({
            where: {
                assignedStaffId: session.user.staff?.id,
            },
            include: { job: true, taskType: true },
            orderBy: {
                createdAt: "asc",
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "all tasks fetched successfully.",
            data: tasks,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal error",
            error: error instanceof Error ? error?.message : error,
        });
    }
}
