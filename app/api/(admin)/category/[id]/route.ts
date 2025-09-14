import { Prisma } from "@/lib/prisma";
import { getProductCategorySchema } from "@/schemas/product.category.form.schema";
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
        const productCategory = await Prisma.productCategory.findUnique({
            where: { id: parseInt(id) },
            include: {
                subCategories: true,
            },
        });

        if (!productCategory) {
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
            data: productCategory,
        });
    } catch (error) {
        console.error("Error fetching productCategory:", error);
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
        const productCategory = await Prisma.productCategory.findUnique({
            where: { id: parseInt(id) },
        });

        if (!productCategory) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product category not found",
            });
        }

        const data = await request.formData();
        const validatedData = parsePartialFormData(
            data,
            getProductCategorySchema(),
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
        if (validatedData?.data.image) {
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

            if (productCategory.imageUrl) {
                await deleteFile(productCategory.imageUrl);
            }
        }
        //eslint-disable-next-line
        const { image, parentCategoryId, ...dataWithoutImage } =
            validatedData.data;
        const updatedCategory = await Prisma.productCategory.update({
            where: { id: parseInt(id) },
            data: {
                ...dataWithoutImage,
                imageUrl: imageUrl || productCategory.imageUrl,
            },
            include: {
                subCategories: true,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: updatedCategory,
            message: "Product Category updated successfully",
        });
    } catch (error) {
        console.error("Error updating productCategory:", `${error}`);
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
        const productCategory = await Prisma.productCategory.delete({
            where: { id: parseInt(id) },
        });

        if (!productCategory) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product Category not found.",
            });
        }
        await deleteFile(productCategory.imageUrl);
        return serverResponse({
            status: 200,
            success: true,
            data: null,
            message: "Product Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting productCategory:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to delete product category",
        });
    }
}
