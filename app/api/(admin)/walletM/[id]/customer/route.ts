import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { allowedRoleForAccountManagement } from "@/lib/constants";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForAccountManagement.includes(
                session.user.staff?.role as ROLE,
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

        if (!id || isNaN(parseInt(id))) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid wallet id",
            });
        }

        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
            omit: {
                password: true,
            },
            include: {
                wallet: {
                    select: {
                        balance: true,
                        id: true,
                    },
                },
            },
        });

        if (!customer) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer not found.",
            });
        }

        return serverResponse({
            data: customer,
            status: 200,
            success: true,
            message: "customer fetched successfully",
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching customer.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
