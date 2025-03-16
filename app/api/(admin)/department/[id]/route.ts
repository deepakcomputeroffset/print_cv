import { prisma } from "@/lib/prisma";
import { taskTypeFormSchema } from "@/schemas/taskType.form.schema";
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
        const department = await prisma.taskType.findUnique({
            where: { id: parseInt(id) },
        });

        if (!department) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Department not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            data: department,
            message: "Department fetech successfully.",
        });
    } catch (error) {
        console.error("Error fetching department:", error);
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

        const department = await prisma.taskType.findUnique({
            where: { id: parseInt(id) },
        });

        if (!department) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Department not found.",
            });
        }

        const body = await request.json();
        const validatedData = taskTypeFormSchema.partial().parse(body);

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};

        if (validatedData?.name) updateData.name = validatedData.name;
        if (validatedData?.description)
            updateData.description = validatedData.description;

        const updatedDepartment = await prisma.taskType.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Department updated successfully.",
            data: updatedDepartment,
        });
    } catch (error) {
        console.error("Error updating department:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update department.",
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

        const department = await prisma.taskType.delete({
            where: { id: parseInt(id) },
        });

        if (!department) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Department not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Department deleted successfully.",
            data: null,
        });
    } catch (error) {
        console.log(error);
        console.error("Error deleting department:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to delete department.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
