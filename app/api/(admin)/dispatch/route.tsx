import { auth } from "@/lib/auth";
import { allowedRoleForDispatchManagement } from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";
import { Prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (
            !session ||
            session.user.userType !== "staff" ||
            !allowedRoleForDispatchManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned === true)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const orders = await Prisma.order.findMany({
            where: {
                job: { isVerified: true, isCompleted: true },
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching orders",
            error: error instanceof Error ? error.message : error,
        });
    }
}
