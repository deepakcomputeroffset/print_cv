import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            return NextResponse.json(
                { success: false, error: "product not found" },
                { status: 404 },
            );
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { is_avialable: !product.is_avialable },
        });

        return NextResponse.json(
            {
                success: true,
                message: "product ban status updated successfully.",
                data: updatedProduct,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error toggling product availability status:", error);
        return NextResponse.json(
            { error: "Failed to update product availability status" },
            { status: 500 },
        );
    }
}
