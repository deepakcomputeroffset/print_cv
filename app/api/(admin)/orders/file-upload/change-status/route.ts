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

        const { orderId } = await request.json();

        if (!orderId) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Missing required field: orderId",
            });
        }

        // Validate order exists and belongs to the customer
        const order = await Prisma.order.findFirst({
            where: {
                id: orderId,
            },
            include: {
                productItem: {
                    include: {
                        uploadGroup: true,
                    },
                },
                attachment: {
                    select: {
                        type: true,
                    },
                },
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

        // Check if upload group exists
        if (!order.productItem.uploadGroup) {
            return serverResponse({
                status: 400,
                success: false,
                error: "This product does not require file uploads",
            });
        }

        const allowedUploadTypes = order.productItem.uploadGroup.uploadTypes;

        // Check if all required upload types are fulfilled
        const uploadedTypes = order.attachment.map((att) => att.type);
        const allRequiredTypesUploaded = allowedUploadTypes.every((type) =>
            uploadedTypes.includes(type),
        );

        if (!allRequiredTypesUploaded) {
            const missingTypes = allowedUploadTypes.filter(
                (type) => !uploadedTypes.includes(type),
            );

            return serverResponse({
                status: 400,
                success: false,
                error: "Not all required files have been uploaded",
                data: {
                    uploadedTypes,
                    requiredTypes: allowedUploadTypes,
                    missingTypes,
                    allUploaded: false,
                },
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

        return serverResponse({
            status: 200,
            success: true,
            message: "Order status updated to FILE_UPLOADED",
            data: {
                order: updatedOrder,
                uploadedTypes,
                requiredTypes: allowedUploadTypes,
                allUploaded: true,
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
