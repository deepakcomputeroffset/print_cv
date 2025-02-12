import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);
        if (isNaN(productId)) {
            return NextResponse.json(
                { error: "Invalid product ID" },
                { status: 400 },
            );
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
                product_items: {
                    include: {
                        product_attribute_options: {
                            include: {
                                product_attribute_type: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 },
        );
    }
}
