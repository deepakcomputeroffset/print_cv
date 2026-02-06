import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { partialProductFormSchema } from "@/schemas/product.form.schema";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { deleteFiles } from "@/lib/storage";

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
        const product = await Prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                productItems: { include: { pricing: true } },
            },
        });

        if (!product) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product not found",
            });
        }

        return serverResponse({
            status: 200,
            success: true,
            data: product,
            message: "Product fetched successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error While fetching product",
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
        console.log(body);

        // Validate request body against schema
        const validatedData = partialProductFormSchema?.partial().parse(body);

        // Find existing product
        const existingProduct = await Prisma?.product?.findUnique({
            where: { id: parseInt(id) },
            include: {
                productItems: true,
            },
        });

        if (!existingProduct) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Product not found",
            });
        }

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};

        if (validatedData?.name) updateData.name = validatedData.name;
        if (validatedData?.description)
            updateData.description = validatedData.description;
        if (validatedData?.isAvailable)
            updateData.isAvailable = validatedData.isAvailable;
        if (validatedData?.sku) updateData.sku = validatedData.sku;
        if (validatedData.isTieredPricing)
            updateData.isTieredPricing = validatedData.isTieredPricing;
        if (validatedData.categoryId)
            updateData.categoryId = parseInt(validatedData.categoryId);
        if (validatedData.imageUrl)
            updateData.imageUrl = validatedData.imageUrl;
        if (validatedData.productItems) {
            const incomingItems = validatedData.productItems;
            const existingItemIds = new Set(
                existingProduct.productItems.map((item) => item.id),
            );
            // const incomingItemIds = new Set(
            //     incomingItems.map((item) => item?.id).filter(Boolean),
            // );

            const itemsToCreate = incomingItems.filter((item) => !item.id);
            const itemsToUpdate = incomingItems.filter(
                (item) => item.id && existingItemIds.has(item.id),
            );
            // const idsToDelete = [...existingItemIds].filter(
            //     (existingId) => !incomingItemIds.has(existingId),
            // );
            updateData.productItems = {
                // 👉 Create new items
                create: itemsToCreate.map((item) => ({
                    sku: item.sku,
                    isAvailable: item.isAvailable,
                    isDefault: item.isDefault ?? false,
                    uploadGroupId: item.uploadGroupId,
                    pricing: {
                        create: item.pricing?.map((p) => ({
                            qty: p.qty,
                            price: p.price,
                        })),
                    },
                    productAttributeOptions: {
                        connect: item.productAttributeOptions?.map((opt) => ({
                            id: opt.id,
                        })),
                    },
                })),
                // 👉 Update existing items
                update: itemsToUpdate.map((item) => ({
                    where: { id: item.id },
                    data: {
                        sku: item.sku,
                        isAvailable: item.isAvailable,
                        isDefault: item.isDefault ?? false,
                        uploadGroupId: item.uploadGroupId,
                        pricing: {
                            deleteMany: {}, // Clear old pricing
                            create: item.pricing?.map((p) => ({
                                qty: p.qty,
                                price: p.price,
                            })), // Create new pricing
                        },
                        productAttributeOptions: {
                            // `set` syncs relations: disconnects old, connects new
                            set: item.productAttributeOptions?.map((opt) => ({
                                id: opt.id,
                            })),
                        },
                    },
                })),
                // 👉 Delete items that were removed
                // delete: idsToDelete.map((id) => ({ id })),
            };
        }

        const updatedData = await Prisma?.product?.update({
            where: { id: parseInt(id) },
            data: { ...updateData },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: updatedData,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update product",
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
                message: "Invalid ProductIc",
            });
        }
        const product = await Prisma.product.delete({
            where: { id: parseInt(id) },
        });
        await deleteFiles(product.imageUrl);

        return serverResponse({
            status: 200,
            success: true,
            message: "Product deleted successfully",
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
