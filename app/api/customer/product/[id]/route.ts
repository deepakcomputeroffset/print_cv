import { prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);
        if (isNaN(productId)) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid productId",
            });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
                productItems: {
                    include: {
                        productAttributeOptions: {
                            include: {
                                productAttributeType: true,
                            },
                        },
                    },
                },
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
        console.error("Error fetching product:", error);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
            message: "Internal Error",
        });
    }
}
