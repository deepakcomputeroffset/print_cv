import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { Prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { ROLE, STATUS } from "@prisma/client";
import { allowedRoleForOrderManagement } from "@/lib/constants";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        // Validate session and permissions
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

        const { orderId, comment } = await request.json();

        if (!orderId) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Missing required field: orderId",
            });
        }

        // Validate order exists
        const order = await Prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found or you don't have permission to access it",
            });
        }

        // Check if order is in PLACED status
        if (order.status !== STATUS.PLACED) {
            return serverResponse({
                status: 400,
                success: false,
                error: `Order is not in PLACED status. Current status: ${order.status}`,
            });
        }

        // Update order status to FILE_UPLOADED
        const updatedOrder = await Prisma.order.update({
            where: { id: orderId },
            data: {
                status: STATUS.FILE_UPLOADED,
                updatedAt: new Date(),
            },
        });

        // Add comment if provided
        if (comment && comment.trim()) {
            await Prisma.orderComment.create({
                data: {
                    orderId,
                    comment: comment.trim(),
                    commentType: "STAFF_NOTE",
                    staffId: session.user.staff?.id,
                },
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Order status updated to FILE_UPLOADED",
            data: {
                order: updatedOrder,
            },
        });
    } catch (error) {
        console.error("Status update error:", error);

        return serverResponse({
            status: 500,
            success: false,
            error: "Internal server error during status update",
            message: "Please try again later",
        });
    }
}
