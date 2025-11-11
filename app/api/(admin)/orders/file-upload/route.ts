import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { uploadFile, deleteFile } from "@/lib/storage";
import {
    allowedFileMimeType,
    allowedRoleForOrderManagement,
    maxFileSize,
} from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { ROLE, STATUS, UPLOAD_TYPE } from "@prisma/client";
import { isValidUploadType } from "@/lib/utils/validUploadType";

export async function POST(request: NextRequest) {
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
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        // Parse form data for file upload
        const formData = await request.formData();
        const orderId = formData.get("orderId")?.toString();
        const uploadType = formData.get("uploadType")?.toString();
        const file = formData.get("file") as File;

        // Validate required fields
        if (!orderId || !uploadType || !file) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Missing required fields: orderId, uploadType, or file",
            });
        }

        // Validate upload type
        if (!isValidUploadType(uploadType)) {
            return serverResponse({
                status: 400,
                success: false,
                error: `Invalid upload type. Allowed types: ${Object.values(UPLOAD_TYPE).join(", ")}`,
            });
        }
        // Validate order exists and belongs to the customer
        const order = await Prisma.order.findFirst({
            where: {
                id: parseInt(orderId),
            },
            include: {
                productItem: {
                    include: {
                        uploadGroup: true,
                    },
                },
                attachment: {
                    select: {
                        type: true,
                    },
                },
            },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found or you don't have permission to access it",
            });
        }

        // Check if upload group exists
        if (!order.productItem.uploadGroup) {
            return serverResponse({
                status: 400,
                success: false,
                error: "This product does not require file uploads",
            });
        }

        const uploadGroup = order.productItem.uploadGroup;
        const allowedUploadTypes = uploadGroup.uploadTypes;

        // Check if the requested upload type is allowed for this product
        if (!allowedUploadTypes.includes(uploadType as UPLOAD_TYPE)) {
            return serverResponse({
                status: 400,
                success: false,
                error: `Upload type ${uploadType} is not allowed for this product. Allowed types: ${allowedUploadTypes.join(", ")}`,
            });
        }

        // Check if this upload type already has a file attached
        const existingAttachment = order.attachment.find(
            (att) => att.type === uploadType,
        );
        if (existingAttachment) {
            return serverResponse({
                status: 400,
                success: false,
                error: `A file for upload type ${uploadType} has already been uploaded.`,
            });
        }

        // Validate file
        if (file.size === 0) {
            return serverResponse({
                status: 400,
                success: false,
                error: "File is empty",
            });
        }

        // Check file size
        if (file.size > maxFileSize) {
            return serverResponse({
                status: 400,
                success: false,
                error: `File exceeds maximum size limit of ${maxFileSize / 1024 / 1024}MB`,
            });
        }

        // Check file type
        if (
            allowedFileMimeType.length > 0 &&
            !allowedFileMimeType.includes(file.type)
        ) {
            return serverResponse({
                status: 400,
                success: false,
                error: `File has invalid type. Allowed types: ${allowedFileMimeType.join(", ")}`,
            });
        }

        // Upload file to storage
        const fileUrl = await uploadFile(
            "files",
            file,
            `${file.name}`,
        );

        // Create attachment record
        const attachment = await Prisma.attachment.create({
            data: {
                orderId: order.id,
                type: uploadType as UPLOAD_TYPE,
                url: fileUrl,
                // uploadedById is optional for customer uploads
            },
        });

        // Check if all required upload types are now fulfilled
        // const currentAttachments = await Prisma.attachment.findMany({
        //     where: { orderId: order.id },
        //     select: { type: true },
        // });

        // const uploadedTypes = currentAttachments.map((att) => att.type);
        // const allRequiredTypesUploaded = allowedUploadTypes.every((type) =>
        //     uploadedTypes.includes(type),
        // );

        // Update order status if all required files are uploaded
        // let orderStatus = order.status;
        // if (allRequiredTypesUploaded && order.status === STATUS.PLACED) {
        //     orderStatus = STATUS.FILE_UPLOADED;

        //     await Prisma.order.update({
        //         where: { id: order.id },
        //         data: {
        //             status: STATUS.FILE_UPLOADED,
        //             updatedAt: new Date(),
        //         },
        //     });
        // }

        return serverResponse({
            status: 200,
            success: true,
            message: "File uploaded successfully",
            data: {
                attachment,
                // orderStatus,
                // allFilesUploaded: allRequiredTypesUploaded,
                // uploadedTypes,
                requiredTypes: allowedUploadTypes,
            },
        });
    } catch (error) {
        console.error("File upload error:", error);

        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes("storage")) {
                return serverResponse({
                    status: 500,
                    success: false,
                    error: "Failed to upload file to storage. Please try again.",
                });
            }
        }

        return serverResponse({
            status: 500,
            success: false,
            error: "Internal server error during file upload",
            message: "Please try again later",
        });
    }
}

// GET endpoint to check upload status
export async function GET(request: NextRequest) {
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
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Missing orderId parameter",
            });
        }

        // Get order with upload status
        const order = await Prisma.order.findFirst({
            where: {
                id: parseInt(orderId),
            },
            include: {
                attachment: {
                    select: {
                        id: true,
                        type: true,
                        url: true,
                        createdAt: true,
                    },
                },
                productItem: {
                    select: {
                        sku: true,
                        product: {
                            select: {
                                name: true,
                            },
                        },
                        uploadGroup: {
                            select: {
                                uploadTypes: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found or you don't have permission to access it",
            });
        }

        const requiredTypes = order.productItem.uploadGroup?.uploadTypes || [];
        const uploadedTypes = order.attachment.map((att) => att.type);
        const missingTypes = requiredTypes.filter(
            (type) => !uploadedTypes.includes(type),
        );
        const allUploaded = missingTypes.length === 0;

        return serverResponse({
            status: 200,
            success: true,
            data: {
                orderId: order.id,
                status: order.status,
                attachments: order.attachment,
                requiredTypes,
                uploadedTypes,
                missingTypes,
                allUploaded,
            },
        });
    } catch (error) {
        console.error("Get upload status error:", error);
        return serverResponse({
            status: 500,
            success: false,
            error: "Internal server error",
        });
    }
}

// DELETE endpoint to remove an uploaded file
export async function DELETE(request: NextRequest) {
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
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { orderId, attachmentId } = await request.json();

        if (!orderId || !attachmentId) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Missing orderId or attachmentId parameter",
            });
        }

        // Check if order belongs to customer and attachment exists
        const attachment = await Prisma.attachment.findFirst({
            where: {
                id: parseInt(attachmentId),
                order: {
                    id: parseInt(orderId),
                },
            },
            include: {
                order: {
                    select: {
                        status: true,
                    },
                },
            },
        });

        if (!attachment) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Attachment not found or you don't have permission to access it",
            });
        }

        // Check if order can have files removed
        if (attachment.order.status !== STATUS.PLACED) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Cannot remove files from an order that is already being processed",
            });
        }

        // Delete file from storage
        try {
            await deleteFile(attachment.url);
        } catch (error) {
            console.error("Failed to delete file from storage:", error);
            // Continue with database deletion even if storage deletion fails
        }

        // Delete attachment record
        await Prisma.attachment.delete({
            where: { id: attachment.id },
        });

        // // Update order status back to PLACED if it was FILES_UPLOADED
        // if (attachment.order.status === STATUS.FILE_UPLOADED) {
        //     await Prisma.order.update({
        //         where: { id: orderId },
        //         data: { status: STATUS.PLACED },
        //     });
        // }

        return serverResponse({
            status: 200,
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.error("Delete file error:", error);
        return serverResponse({
            status: 500,
            success: false,
            error: "Internal server error",
        });
    }
}
