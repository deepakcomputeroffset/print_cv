import serverResponse from "@/lib/serverResponse";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> },
) {
    try {
        const session = await auth();

        // Only staff members can mark orders as improper
        if (
            !session?.user?.userType ||
            session.user.userType !== "staff" ||
            !session.user.staff
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        // Get the order ID from params
        const { orderId } = await params;
        if (!orderId || isNaN(parseInt(orderId))) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Order ID is required.",
            });
        }

        // Get the reason from the request body
        const body = await req.json().catch(() => ({}));
        const { reason } = body;

        if (!reason || reason.trim().length < 10) {
            return serverResponse({
                status: 400,
                success: false,
                error: "A detailed reason is required (minimum 10 characters).",
            });
        }

        // Get the order
        const order = await Prisma.order.findUnique({
            where: { id: parseInt(orderId) },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found!",
            });
        }

        // Check if order is in PENDING state
        if (order.status !== "PENDING") {
            return serverResponse({
                status: 400,
                success: false,
                error: "Only pending orders can be marked as improper.",
            });
        }

        // Create a transaction to update the order status and create a comment
        await Prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
                where: { id: parseInt(orderId) },
                data: { status: "IMPROPER_ORDER" },
            });

            // Create a comment with the reason
            await tx.orderComment.create({
                data: {
                    orderId: parseInt(orderId),
                    comment: reason,
                    commentType: "IMPROPER_ORDER",
                    staffId: session.user.staff?.id,
                },
            });
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Order marked as improper successfully.",
        });
    } catch (error) {
        console.error(error);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
        });
    }
}
