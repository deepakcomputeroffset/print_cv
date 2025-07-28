import { Prisma } from "@/lib/prisma";
import { getDesignCategorySchema } from "@/schemas/design.category.form.schema";
import {
    allowedRoleForCategoryAndProductManagement,
    maxImageSize,
} from "@/lib/constants";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { ROLE } from "@prisma/client";
import { parsePartialFormData } from "@/lib/formData";
import { deleteFile, uploadFile } from "@/lib/storage";
import { FileLike } from "@/types/types";

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
        const designCategory = await Prisma.designCategory.findUnique({
            where: { id: parseInt(id) },
        });

        if (!designCategory) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Category not found",
            });
        }
        return serverResponse({
            status: 200,
            success: true,
            message: "Category fetched successfully",
            data: designCategory,
        });
    } catch (error) {
        console.error("Error fetching designCategory:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal Error",
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
        const designCategory = await Prisma.designCategory.findUnique({
            where: { id: parseInt(id) },
        });

        if (!designCategory) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Design category not found",
            });
        }

        const data = await request.formData();
        const validatedData = parsePartialFormData(
            data,
            getDesignCategorySchema(),
        );
        if (!validatedData.success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid Data",
                error: validatedData.error.issues,
            });
        }
        let imageUrl = undefined;
        if (validatedData?.data.img) {
            const image = data.get("image") as FileLike;

            if (!image || typeof image !== "object" || !("size" in image)) {
                return serverResponse({
                    status: 400,
                    success: false,
                    message: "Invalid image file.",
                });
            }

            if (image.size > maxImageSize)
                return serverResponse({
                    status: 400,
                    success: false,
                    message: "Image is too large.",
                });

            const imageName = `${session.user.staff?.id}_${Date.now()}`;
            imageUrl = await uploadFile("images", image, imageName);

            if (designCategory.img) {
                await deleteFile(designCategory.img);
            }
        }

        const updatedCategory = await Prisma.designCategory.update({
            where: { id: parseInt(id) },
            data: {
                ...validatedData.data,
                img: imageUrl || designCategory.img,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: updatedCategory,
            message: "Design Category updated successfully",
        });
    } catch (error) {
        console.error("Error updating designCategory:", `${error}`);
        return serverResponse({
            status: 500,
            message: "Internal Error",
            success: false,
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
        const designCategory = await Prisma.designCategory.delete({
            where: { id: parseInt(id) },
        });

        if (!designCategory) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Design Category not found.",
            });
        }
        await deleteFile(designCategory.img);
        return serverResponse({
            status: 200,
            success: true,
            data: null,
            message: "Design Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting designCategory:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to delete Design category",
        });
    }
}
