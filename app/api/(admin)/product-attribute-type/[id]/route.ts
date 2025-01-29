import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const product_attribute_type =
            await prisma.product_attribute_type.findUnique({
                where: { id: parseInt(id) },
            });

        if (!product_attribute_type) {
            return NextResponse.json(
                { success: false, error: "product attribute not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: product_attribute_type },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching product_attribute_type:", error);
        return NextResponse.json(
            { error: "Failed to fetch product_attribute_type" },
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

        const product_attribute_type =
            await prisma.product_attribute_type.delete({
                where: { id: parseInt(id) },
            });

        if (!product_attribute_type) {
            return NextResponse.json(
                {
                    success: false,
                    message: "product_attribute_type not found",
                },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting product_attribute_type:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete product_attribute_type" },
            { status: 500 },
        );
    }
}
