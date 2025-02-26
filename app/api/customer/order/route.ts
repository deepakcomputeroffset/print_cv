import { auth } from "@/lib/auth";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import serverResponse from "@/lib/serverResponse";
import { uploadFile } from "@/lib/storage";
import { allowedFileMimeType, maxFileSize } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType !== "customer" ||
            session.user?.customer?.isBanned
        ) {
            return serverResponse({
                message: "Unauthorized",
                status: 401,
                success: false,
            });
        }

        const orders = prisma.order.findMany({
            where: {
                customerId: session?.user?.customer?.id,
            },
            include: {
                productItem: true,
            },
        });

        return serverResponse({
            data: orders,
            success: true,
            message: "Order fatched successfully",
            status: 200,
        });
    } catch (error) {
        return serverResponse({
            success: false,
            error: error instanceof Error ? error.message : error,
            message: "Internal Error",
            status: 500,
        });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (
            session?.user?.userType != "customer" ||
            session?.user?.customer?.isBanned ||
            !session?.user?.customer
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const orderDetail = await request.formData();

        const productItemId = parseInt(
            orderDetail.get("productItemId")?.toString() || "",
        );
        const qty = parseInt(orderDetail.get("qty")?.toString() || "");
        const file = orderDetail.get("file") as File;

        if (!allowedFileMimeType.includes(file.type)) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Only PDFs and image files are allowed",
            });
        }

        if (file.size > maxFileSize) {
            return serverResponse({
                error: "File size exceeds 50MB limit",
                status: 400,
                success: false,
            });
        }

        if (!productItemId || !qty || !file) {
            return serverResponse({
                status: 400,
                success: false,
                error: "All fields are required.",
            });
        }

        const productItem = await prisma?.productItem.findUnique({
            where: {
                id: productItemId,
            },
        });

        if (!productItem) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Product not found!",
            });
        }

        const fileUrl = await uploadFile(
            "files",
            file,
            session.user.customer.phone,
        );

        const createdOrder = await prisma?.order.create({
            data: {
                customerId: session?.user?.customer?.id,
                productItemId: productItem?.id,
                qty: Math.max(qty, productItem?.minQty),
                fileUrl,
                amount:
                    getPriceAccordingToCategoryOfCustomer(
                        session.user.customer.customerCategory,
                        {
                            avgPrice: productItem.avgPrice,
                            maxPrice: productItem.maxPrice,
                            minPrice: productItem.minPrice,
                        },
                    ) * Math.max(qty, productItem?.minQty),
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            message: "Order placed",
            data: createdOrder,
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
            message: "Internal Error",
        });
    }
}
