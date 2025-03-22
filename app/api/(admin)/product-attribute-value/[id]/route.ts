import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const productAttributeValue =
            await Prisma.productAttributeValue.findUnique({
                where: { id: parseInt(id) },
            });

        if (!productAttributeValue) {
            return NextResponse.json(
                { success: false, error: "product attribute value not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: productAttributeValue },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching product attribute value:", error);
        return NextResponse.json(
            { error: "Failed to fetch product attribute value" },
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

        const productAttributeValue = await Prisma.productAttributeValue.delete(
            {
                where: { id: parseInt(id) },
            },
        );

        if (!productAttributeValue) {
            return NextResponse.json(
                {
                    success: false,
                    message: "product attribute value not found",
                },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Error deleting product attribute value:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete product attribute value" },
            { status: 500 },
        );
    }
}
