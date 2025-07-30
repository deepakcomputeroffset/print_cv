import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { deleteFile } from "@/lib/storage";
import { designItemSchema } from "@/schemas/design.item.form.schema";

export async function GET(
    req: Request,
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
        if (isNaN(parseInt(id))) {
            return NextResponse.json(
                { message: "Invalid productId" },
                { status: 400 },
            );
        }
        const Design = await Prisma.design.findUnique({
            where: { id: parseInt(id) },
            include: { designCategory: true },
        });

        if (!Design) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Design not found",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            data: Design,
            message: "Design fetched successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error While fetching Design",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function PATCH(
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
        if (isNaN(parseInt(id))) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invaid productId",
            });
        }

        const body = await request.json();

        // Validate request body against schema
        const validatedData = designItemSchema?.partial().parse(body);

        // Find existing Design
        const existingProduct = await Prisma?.design?.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingProduct) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Design not found",
            });
        }

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};

        if (validatedData?.name) updateData.name = validatedData.name;

        const updatedData = await Prisma?.design?.update({
            where: { id: parseInt(id) },
            data: { ...updateData },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: updatedData,
            message: "Design updated successfully",
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update Design",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function DELETE(
    req: Request,
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
        if (isNaN(parseInt(id))) {
            return serverResponse({
                status: 200,
                success: false,
                message: "Invalid Design",
            });
        }
        const design = await Prisma.design.delete({
            where: { id: parseInt(id) },
        });
        await deleteFile(design.img);
        await deleteFile(design.downloadUrl);

        return serverResponse({
            status: 200,
            success: true,
            message: "Design deleted successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while deleting products.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
