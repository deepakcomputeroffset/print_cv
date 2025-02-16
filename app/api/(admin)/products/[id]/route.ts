import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { partialProductFormSchema } from "@/schemas/product.form.schema";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (isNaN(parseInt(id))) {
            return NextResponse.json(
                { message: "Invalid productId" },
                { status: 400 },
            );
        }
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching product", error },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        if (isNaN(parseInt(id))) {
            return NextResponse.json(
                { message: "Invalid productId" },
                { status: 400 },
            );
        }

        const body = await request.json();

        // Validate request body against schema
        const validatedData = partialProductFormSchema?.partial().parse(body);

        // Find existing product
        const existingProduct = await prisma?.product?.findUnique({
            where: { id: parseInt(id) },
            include: {
                productItems: true,
            },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 },
            );
        }

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};

        if (validatedData?.name) updateData.name = validatedData.name;
        if (validatedData?.description)
            updateData.description = validatedData.description;
        if (validatedData?.imageUrl)
            updateData.imageUrl = validatedData.imageUrl;
        if (validatedData?.isAvailable)
            updateData.isAvailable = validatedData.isAvailable;
        if (validatedData?.sku) updateData.sku = validatedData.sku;
        if (validatedData.minQty) updateData.minQty = validatedData.minQty;
        if (validatedData.avgPrice)
            updateData.avgPrice = validatedData.avgPrice;
        if (validatedData.maxPrice)
            updateData.maxPrice = validatedData.maxPrice;
        if (validatedData.ogPrice) updateData.ogPrice = validatedData.ogPrice;
        if (validatedData.categoryId)
            updateData.categoryId = parseInt(validatedData.categoryId);
        if (validatedData?.productItems)
            updateData.productItems = {
                create: validatedData.productItems.map((item) => ({
                    sku: item.sku,
                    minQty: item.minQty,
                    ogPrice: item.ogPrice,
                    minPrice: item.minPrice,
                    avgPrice: item.avgPrice,
                    maxPrice: item.maxPrice,
                    imageUrl: item.imageUrl,
                    isAvailable: item.isAvailable,
                    productAttributeOptions: {
                        connect: item.productAttributeOptions.map((option) => ({
                            id: option.id, // Connect using the existing ID
                        })),
                    },
                })),
            };

        // deleting all existing varients of product if variants changed
        if (!!validatedData?.productItems) {
            await prisma?.productItem.deleteMany({
                where: {
                    productId: existingProduct?.id,
                },
            });
        }

        const updatedData = await prisma?.product?.update({
            where: { id: parseInt(id) },
            data: { ...updateData },
        });

        return NextResponse.json(
            {
                message: "Product updated successfully",
                success: true,
                data: updatedData,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating product:", error);

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: error.errors,
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();

        if (session?.user?.staff?.role !== "PRODUCT_MANAGER") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }
        const { id } = await params;
        if (isNaN(parseInt(id))) {
            return NextResponse.json(
                { message: "Invalid productId" },
                { status: 400 },
            );
        }
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error deleting product", error },
            { status: 500 },
        );
    }
}
