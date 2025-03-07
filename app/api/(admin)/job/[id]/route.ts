import { prisma } from "@/lib/prisma";
import { jobFormSchema } from "@/schemas/job.form.schema";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { allowedRoleForOrderManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
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
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });

        if (!job) {
            return serverResponse({
                status: 404,
                success: false,
                message: "job not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            data: job,
            message: "Job fetech successfully.",
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal error.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!session) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;

        const job = await prisma.job.findUnique({
            where: { id: parseInt(id) },
        });

        if (!job) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Job not found.",
            });
        }

        const body = await request.json();
        const validatedData = jobFormSchema.partial().parse(body);

        const updatedDepartment = await prisma.job.update({
            where: { id: parseInt(id) },
            data: validatedData,
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Job updated successfully.",
            data: updatedDepartment,
        });
    } catch (error) {
        console.error("Error updating job:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update job.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
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
        const { id } = await params;

        const job = await prisma.job.delete({
            where: { id: parseInt(id) },
        });

        if (!job) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Job not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Job deleted successfully.",
            data: null,
        });
    } catch (error) {
        console.error("Error deleting job:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to delete job.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
