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
            where: { id: parseInt(id), isVerified: true },
        });

        if (!job) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Job not found or already unverified.",
            });
        }

        if (job.isCompleted) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Cannot unverify a completed job.",
            });
        }

        const updatedJob = await Prisma.job.update({
            where: { id: parseInt(id), isVerified: true },
            data: {
                isVerified: false,
                verifiedAt: null,
                verifiedBy: null,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Job unverified successfully.",
            data: updatedJob,
        });
    } catch (error) {
        console.error("Error unverifying job:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to unverify job.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
