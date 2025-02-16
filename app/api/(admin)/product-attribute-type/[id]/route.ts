import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const productAttributeType =
            await prisma.productAttributeType.findUnique({
                where: { id: parseInt(id) },
            });

        if (!productAttributeType) {
            return NextResponse.json(
                { success: false, error: "product attribute not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: productAttributeType },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching productAttributeType:", error);
        return NextResponse.json(
            { error: "Failed to fetch productAttributeType" },
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

        const productAttributeType = await prisma.productAttributeType.delete({
            where: { id: parseInt(id) },
        });

        if (!productAttributeType) {
            return NextResponse.json(
                {
                    success: false,
                    message: "productAttributeType not found",
                },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting productAttributeType:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete productAttributeType" },
            { status: 500 },
        );
    }
}
