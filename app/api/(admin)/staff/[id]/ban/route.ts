import { prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            session.user.staff?.role !== "ADMIN"
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;
        const staff = await prisma.staff.findUnique({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Staff not found",
            });
        }

        const updatedStaff = await prisma.staff.update({
            where: { id: parseInt(id) },
            data: { isBanned: !staff.isBanned },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Staff ban status updated successfully.",
            data: updatedStaff,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error toggling staff ban status.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
