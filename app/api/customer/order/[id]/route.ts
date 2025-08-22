import serverResponse from "@/lib/serverResponse";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFiles } from "@/lib/storage";
import { cancellationFormSchema } from "@/schemas/cancellation.form.schema";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();

        if (
            session?.user?.userType != "customer" ||
            session?.user?.customer?.isBanned ||
            !session?.user?.customer
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
                error: "Order ID is required.",
            });
        }

        const order = await Prisma.order.findFirst({
            where: { id: parseInt(id), customerId: session.user.customer.id },
            include: { attachment: true },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found!",
            });
        }

        if (order?.status !== "PLACED") {
            return serverResponse({
                status: 400,
                success: false,
                error: "Order cannot be cancelled!",
            });
        }

        // Get the reason from the request body
        const body = await req.json();
        const { success, data } = cancellationFormSchema.safeParse(body);
        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Invalid request body.",
            });
        }

        // Create a transaction to update the order status and create a comment
        await Prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
                where: { id: parseInt(id) },
                data: { status: "CANCELLED" },
            });

            // Create comment if reason provided
            if (data?.reason && session.user.customer?.id) {
                await tx.orderComment.create({
                    data: {
                        orderId: parseInt(id),
                        comment: data.reason,
                        commentType: "CANCELLATION",
                    },
                });
            }
        });

        if (order?.attachment) {
            const files = order?.attachment?.map((at) => at.url);
            const deleted = await deleteFiles(files);
            console.log(
                deleted.length === files.length
                    ? "File deleted"
                    : "Some file not deleted",
            );
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Order cancelled successfully.",
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
