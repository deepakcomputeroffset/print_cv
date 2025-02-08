import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringToNumber } from "@/lib/utils";
import { partialProductFormSchema } from "@/schemas/product-schema";
import { ZodError } from "zod";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const { isNum, num: pid } = stringToNumber(id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_Id" },
                { status: 400 },
            );
        }
        const product = await prisma.product.findUnique({
            where: { id: pid },
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
        const { isNum, num: pid } = stringToNumber(id);
        if (!isNum || !pid) {
            return NextResponse.json(
                { message: "Invalid product_Id" },
                { status: 400 },
            );
        }

        const body = await request.json();

        // Validate request body against schema
        const validatedData = partialProductFormSchema?.partial().parse(body);

        // Find existing product
        const existingProduct = await prisma?.product?.findUnique({
            where: { id: pid },
            include: {
                product_items: true,
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
        if (validatedData?.image_url)
            updateData.image_url = validatedData.image_url;
        if (validatedData?.is_avialable)
            updateData.is_avialable = validatedData.is_avialable;
        if (validatedData?.sku) updateData.sku = validatedData.sku;
        if (validatedData.min_qty) updateData.min_qty = validatedData.min_qty;
        if (validatedData.avg_price)
            updateData.avg_pric3 = validatedData.avg_price;
        if (validatedData.max_price)
            updateData.max_price = validatedData.max_price;
        if (validatedData.og_price)
            updateData.og_price = validatedData.og_price;
        if (validatedData.category_id)
            updateData.category_id = parseInt(validatedData.category_id);
        if (validatedData?.product_items)
            updateData.product_items = {
                create: validatedData.product_items.map((item) => ({
                    sku: item.sku,
                    min_qty: item.min_qty,
                    og_price: item.og_price,
                    min_price: item.min_price,
                    avg_price: item.avg_price,
                    max_price: item.max_price,
                    image_url: item.image_url,
                    is_avialable: item.is_avialable,
                    product_attribute_options: {
                        connect: item.product_attribute_options.map(
                            (option) => ({
                                id: option.id, // Connect using the existing ID
                            }),
                        ),
                    },
                })),
            };

        // deleting all existing varients of product if variants changed
        if (!!validatedData?.product_items) {
            await prisma?.product_item.deleteMany({
                where: {
                    product_id: existingProduct?.id,
                },
            });
        }

        console.log(pid, updateData);

        const updatedData = await prisma?.product?.update({
            where: { id: pid },
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
        // const session = await auth();

        // if (session?.user?.role !== "ADMIN") {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }
        const { id } = await params;
        const { isNum, num: pid } = stringToNumber(id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_Id" },
                { status: 400 },
            );
        }
        await prisma.product.delete({
            where: { id: pid },
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
