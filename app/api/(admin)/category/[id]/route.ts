import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productCategorySchema } from "@/schemas/product-category-schema";
import { max_image_size } from "@/lib/constants";
import {
    calculateBase64Size,
    DELETE_FILE,
    UPLOAD_TO_CLOUDINARY,
} from "@/lib/cloudinary";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;
        const product_category = await prisma.product_category.findUnique({
            where: { id: parseInt(id) },
            include: {
                sub_categories: true,
            },
        });

        if (!product_category) {
            return NextResponse.json(
                { success: false, error: "category not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: product_category },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching product_category:", error);
        return NextResponse.json(
            { error: "Failed to fetch product_category" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const product_category = await prisma.product_category.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product_category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "product_category not found",
                },
                { status: 404 },
            );
        }

        const data = await request.json();
        console.log(data);
        const validatedData = productCategorySchema.partial().parse(data);

        if (validatedData?.image_url) {
            // const img = await req.formData();
            if (calculateBase64Size(validatedData.image_url) > max_image_size) {
                return Response.json(
                    {
                        message: "Image is too large.",
                        success: false,
                    },
                    {
                        status: 400,
                    },
                );
            }
            const uploadResult = await UPLOAD_TO_CLOUDINARY(
                validatedData.image_url,
                "category",
            );
            if (uploadResult?.secure_url) {
                validatedData.image_url = uploadResult.secure_url;
                if (product_category.image_url) {
                    await DELETE_FILE(product_category.image_url);
                }
            } else {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Failed to upload image.",
                    },
                    { status: 500 },
                );
            }

            await DELETE_FILE(product_category?.image_url);
        }
        const updatedCustomer = await prisma.product_category.update({
            where: { id: parseInt(id) },
            data: validatedData,
            include: {
                sub_categories: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "product_category updated successfully",
                data: updatedCustomer,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating product_category:", error);
        return NextResponse.json(
            { error: "Failed to update product_category" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const product_category = await prisma.product_category.delete({
            where: { id: parseInt(id) },
        });

        if (!product_category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "product_category not found",
                },
                { status: 404 },
            );
        }
        await DELETE_FILE(product_category?.image_url);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting product_category:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete product_category" },
            { status: 500 },
        );
    }
}
