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
        if (validatedData?.productItems)
            updateData.productItems = {
                create: validatedData.productItems.map((item) => ({
                    sku: item.sku,
                    isAvailable: item.isAvailable,
                    pricing: {
                        create: item.pricing.map((qtyPrice) => ({
                            qty: qtyPrice.qty,
                            price: qtyPrice.price,
                        })),
                    },
                    productAttributeOptions: {
                        connect: item.productAttributeOptions.map((option) => ({
                            id: option.id, // Connect using the existing ID
                        })),
                    },
                })),
            };

        // deleting all existing varients of product if variants changed
        if (!!validatedData?.productItems) {
            await Prisma?.productItem.deleteMany({
                where: {
                    productId: existingProduct?.id,
                },
            });
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
