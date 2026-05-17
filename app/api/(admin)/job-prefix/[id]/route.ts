import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { allowedRoleForJobManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";

function isAuthorized(session: Awaited<ReturnType<typeof auth>>) {
    return (
        session &&
        session?.user?.userType === "staff" &&
        allowedRoleForJobManagement.includes(
            session?.user?.staff?.role as ROLE,
        ) &&
        !(session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    );
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!isAuthorized(session)) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { id } = await params;
        const prefixId = parseInt(id);

        if (isNaN(prefixId)) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid prefix id.",
            });
        }

        const existing = await Prisma.jobPrefix.findUnique({
            where: { id: prefixId },
        });

        if (!existing) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Prefix not found.",
            });
        }

        await Prisma.jobPrefix.delete({ where: { id: prefixId } });

        return serverResponse({
            status: 200,
            success: true,
            data: null,
            message: "Prefix deleted successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while deleting prefix.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
