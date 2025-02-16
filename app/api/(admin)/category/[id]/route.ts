import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productCategorySchema } from "@/schemas/product.category.form.schema";
import { maxImageSize } from "@/lib/constants";
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
        const productCategory = await prisma.productCategory.findUnique({
            where: { id: parseInt(id) },
            include: {
                subCategories: true,
            },
        });

        if (!productCategory) {
            return NextResponse.json(
                { success: false, error: "category not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: productCategory },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching productCategory:", error);
        return NextResponse.json(
            { error: "Failed to fetch productCategory" },
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

        const productCategory = await prisma.productCategory.findUnique({
            where: { id: parseInt(id) },
        });

        if (!productCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "productCategory not found",
                },
                { status: 404 },
            );
        }

        const data = await request.json();
        const validatedData = productCategorySchema.partial().parse(data);

        if (validatedData?.imageUrl) {
            // const img = await req.formData();
            if (calculateBase64Size(validatedData.imageUrl) > maxImageSize) {
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
                validatedData.imageUrl,
                "category",
            );
            if (uploadResult?.secure_url) {
                validatedData.imageUrl = uploadResult.secure_url;
                if (productCategory.imageUrl) {
                    await DELETE_FILE(productCategory.imageUrl);
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

            await DELETE_FILE(productCategory?.imageUrl);
        }
        const updatedCustomer = await prisma.productCategory.update({
            where: { id: parseInt(id) },
            data: validatedData,
            include: {
                subCategories: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "productCategory updated successfully",
                data: updatedCustomer,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating productCategory:", error);
        return NextResponse.json(
            { error: "Failed to update productCategory" },
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

        const productCategory = await prisma.productCategory.delete({
            where: { id: parseInt(id) },
        });

        if (!productCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "productCategory not found",
                },
                { status: 404 },
            );
        }
        DELETE_FILE(productCategory?.imageUrl);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting productCategory:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete productCategory" },
            { status: 500 },
        );
    }
}
