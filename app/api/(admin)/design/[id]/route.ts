import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import {
    allowedRoleForCategoryAndProductManagement,
    maxImageSize,
} from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { deleteFile, uploadFile } from "@/lib/storage";
import { designItemSchema } from "@/schemas/design.item.form.schema";
import { parsePartialFormData } from "@/lib/formData";
import { FileLike } from "@/types/types";

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

        const data = await request.formData();
        const validatedData = parsePartialFormData(data, designItemSchema);

        if (!validatedData.success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid Data",
                error: validatedData.error.issues,
            });
        }

        // Find existing Design
        const existingDesign = await Prisma?.design?.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingDesign) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Design not found",
            });
        }

        let imageUrl = undefined;
        if (validatedData?.data.img) {
            const image = data.get("img") as FileLike;

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
            imageUrl = await uploadFile(
                "design_category_items",
                image,
                imageName,
            );

            if (existingDesign?.img) {
                await deleteFile(existingDesign.img);
            }
        }

        let downloadUrl = undefined;
        if (validatedData?.data.downloadUrl) {
            const downloadFile = data.get("downloadUrl");
            if (
                !downloadFile ||
                typeof downloadFile !== "object" ||
                !("size" in downloadFile)
            ) {
                return serverResponse({
                    status: 400,
                    success: false,
                    message: "Invalid file.",
                });
            }
            const imageName = `${session.user.staff?.id}_${Date.now()}`;
            downloadUrl = await uploadFile(
                "design_category_items_file",
                downloadFile,
                imageName,
            );

            if (existingDesign?.downloadUrl) {
                await deleteFile(existingDesign.downloadUrl);
            }
        }

        const updatedData = await Prisma?.design?.update({
            where: { id: parseInt(id) },
            data: {
                ...(validatedData?.data?.name
                    ? { name: validatedData?.data?.name }
                    : {}),
                ...(imageUrl ? { img: imageUrl } : {}),
                ...(downloadUrl ? { downloadUrl: downloadUrl } : {}),
            },
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
        const im = await deleteFile(design.img);
        const fil = await deleteFile(design.downloadUrl);
        console.log(im, fil);

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
