import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForJobManagement?.includes(
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
        if (isNaN(parseInt(id)) || !id) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Job ID is required.",
            });
        }

        const job = await Prisma.job.findUnique({
            where: { id: parseInt(id), isCompleted: false },
        });

        if (!job) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Job not found or already completed.",
            });
        }

        await Promise.all([
            Prisma.job.update({
                where: { id: job.id },
                data: { isCompleted: true },
            }),
            Prisma.order.updateMany({
                where: {
                    jobId: job.id,
                },
                data: {
                    status: "PROCESSED",
                },
            }),
        ]);

        return serverResponse({
            status: 200,
            success: true,
            message: "job completion status updated successfully.",
        });
    } catch (error) {
        console.error("Error toggling job completion status:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update job completion status.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
