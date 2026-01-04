"use server";

import { auth } from "@/lib/auth";
import { allowedRoleForOrderManagement } from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import { ROLE, STATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
    orderId: number,
    status: "FILE_UPLOADED" | "IMPROPER_ORDER" | "PLACED",
) {
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
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        // Validate order exists
        const order = await Prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });

        if (!order) {
            return {
                success: false,
                error: "Order not found",
            };
        }

        // Check if order is in PLACED, FILE_UPLOADED, or IMPROPER_ORDER status (allow transitions)
        if (
            order.status !== STATUS.PLACED &&
            order.status !== STATUS.FILE_UPLOADED &&
            order.status !== STATUS.IMPROPER_ORDER
        ) {
            return {
                success: false,
                error: `Order cannot be updated. Current status: ${order.status}`,
            };
        }

        // Update order status
        await Prisma.order.update({
            where: { id: orderId },
            data: {
                status: status,
                isAttachmentVerified: true,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/admin/review");

        return {
            success: true,
            message: `Order status updated to ${status}`,
        };
    } catch (error) {
        console.error("Status update error:", error);
        return {
            success: false,
            error: "Internal server error during status update",
        };
    }
}

export async function addComment(orderId: number, comment: string) {
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
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        if (!comment || !comment.trim()) {
            return {
                success: false,
                error: "Comment cannot be empty",
            };
        }

        // Add comment
        await Prisma.orderComment.create({
            data: {
                orderId,
                comment: comment.trim(),
                commentType: "STAFF_NOTE",
                staffId: session.user.staff?.id,
            },
        });

        return {
            success: true,
            message: "Comment added successfully",
        };
    } catch (error) {
        console.error("Add comment error:", error);
        return {
            success: false,
            error: "Failed to add comment",
        };
    }
}

export async function getOrderDetails(orderId: number) {
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
            return {
                success: false,
                error: "Unauthorized",
                data: null,
            };
        }

        const order = await Prisma.order.findUnique({
            where: { id: orderId },
            include: {
                productItem: {
                    include: {
                        productAttributeOptions: {
                            include: {
                                productAttributeType: true,
                            },
                        },
                        product: {
                            select: {
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
                customer: {
                    select: {
                        name: true,
                        businessName: true,
                        email: true,
                        phone: true,
                        gstNumber: true,
                    },
                },
                comments: {
                    include: {
                        staff: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                attachment: {
                    select: {
                        id: true,
                        url: true,
                        type: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!order) {
            return {
                success: false,
                error: "Order not found",
                data: null,
            };
        }
        return {
            success: true,
            data: order,
        };
    } catch (error) {
        console.error("Get order details error:", error);
        return {
            success: false,
            error: "Failed to fetch order details",
            data: null,
        };
    }
}
