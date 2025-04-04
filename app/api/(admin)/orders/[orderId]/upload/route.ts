import { auth } from "@/lib/auth";
import { allowedRoleForOrderManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import serverResponse from "@/lib/serverResponse";
import { Prisma } from "@/lib/prisma";
import { uploadMultipleFiles } from "@/lib/storage";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> },
) {
    try {
        const session = await auth();
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
        const { orderId } = await params;

        if (isNaN(parseInt(orderId))) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Invalid order ID",
            });
        }

        const order = await Prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { attachment: true },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found",
            });
        }

        if (order.attachment?.uploadVia !== "EMAIL") {
            return serverResponse({
                status: 400,
                success: false,
                error: "Can only upload files for orders with email upload type",
            });
        }

        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return serverResponse({
                status: 400,
                success: false,
                error: "No files provided",
            });
        }

        // Upload files using the existing uploadMultipleFiles function
        const urls = await uploadMultipleFiles(
            "files",
            files,
            `order_${orderId}_${Date.now()}`,
        );

        // Update the order's attachment with the new file URLs
        if (!session.user.staff) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Staff information not found",
            });
        }

        await Prisma.attachment.update({
            where: { orderId: parseInt(orderId) },
            data: {
                urls: {
                    push: urls,
                },
                uploadedById: session.user.staff.id,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Files uploaded successfully",
            data: { urls },
        });
    } catch (error) {
        console.error(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while uploading files",
            error: error instanceof Error ? error.message : error,
        });
    }
}
