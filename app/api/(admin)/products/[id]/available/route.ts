import { prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product not found.",
            });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { isAvailable: !product.isAvailable },
        });

        return serverResponse({
            success: true,
            status: 200,
            message: "Product ban status updated successfully.",
            data: updatedProduct,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update product availability status.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
