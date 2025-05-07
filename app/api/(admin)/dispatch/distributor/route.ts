import { auth } from "@/lib/auth";
import { allowedRoleForDispatchManagement } from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";

export async function POST(request: Request) {
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

        const { id, distributorId } = await request.json();

        if (!id || !distributorId)
            return serverResponse({
                status: 400,
                success: false,
                message: "All fields are required.",
            });
        const order = await Prisma.order.findFirst({
            where: { id },
        });

        const customerAddress = await Prisma.address.findFirst({
            where: { ownerId: order?.customerId, ownerType: "CUSTOMER" },
        });
        const distributor = await Prisma.staff.findUnique({
            where: { id: distributorId, role: "DISTRIBUTER" },
        });

        if (!distributor)
            return serverResponse({
                status: 404,
                success: false,
                message: "No Distributor found.",
            });

        const distributorAddress = await Prisma.address.findFirst({
            where: {
                ownerId: distributor.id,
                ownerType: "STAFF",
            },
        });

        if (distributorAddress?.cityId !== customerAddress?.cityId)
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer and distributor city are not same.",
            });

        const updatedOrder = await Prisma.order.update({
            where: { id: order?.id },
            data: {
                distribution: {
                    create: {
                        distributorId: distributor.id,
                    },
                },
                status: "DISPATCHED",
                deliveryVia: "DISTRIBUTOR",
            },
        });
        return serverResponse({
            status: 200,
            success: true,
            message: "Order dispatched successfully",
            data: updatedOrder,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error dispatching order",
            error: error instanceof Error ? error.message : error,
        });
    }
}
