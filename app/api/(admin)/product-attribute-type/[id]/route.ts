import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import { auth } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const { id } = await params;

        const productAttributeType =
            await Prisma.productAttributeType.findUnique({
                where: { id: parseInt(id) },
            });

        if (!productAttributeType) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product AttributeType not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            data: productAttributeType,
            message: "Product Attribute fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching productAttributeType:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while  fetching productAttributeType.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const { id } = await params;

        const productAttributeType = await Prisma.productAttributeType.delete({
            where: { id: parseInt(id) },
        });

        if (!productAttributeType) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product AttributeType not found.",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Product Attribute Deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting productAttributeType:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while  deleting productAttributeType.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
