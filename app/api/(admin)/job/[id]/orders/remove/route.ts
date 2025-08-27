import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE, STATUS } from "@prisma/client";

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

        const param = await params;

        const job = await Prisma.job.findUnique({
            where: { id: parseInt(param.id) },
        });

        if (!job || job.isVerified) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Invalid request.",
            });
        }

        const { orderId } = await request.json();

        if (!orderId) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Order ID is required.",
            });
        }

        const order = await Prisma.order.update({
            where: { id: orderId },
            data: {
                jobId: {
                    set: null,
                },
                status: STATUS.FILE_UPLOADED,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "order removed from job successfully.",
            data: order,
        });
    } catch (error) {
        console.error("Error order removed from job:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to remove order from job.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
