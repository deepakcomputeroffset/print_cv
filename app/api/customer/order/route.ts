import { auth } from "@/lib/auth";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import serverResponse from "@/lib/serverResponse";
import { uploadFile } from "@/lib/storage";
import {
    allowedFileMimeType,
    defaultOrderPerPage,
    maxFileSize,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { placeOrder } from "@/lib/placeOrder";

export async function GET(req: NextRequest) {
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

        const { searchParams } = new URL(req.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: Prisma.orderWhereInput = {
            AND: [
                query.search
                    ? {
                          OR: [
                              !isNaN(parseInt(query?.search))
                                  ? {
                                        id: {
                                            gte: parseInt(query?.search),
                                        },
                                    }
                                  : {},
                          ],
                      }
                    : {},
                query.to
                    ? {
                          createdAt: {
                              lte: new Date(query.to),
                          },
                      }
                    : {},
                query.from
                    ? {
                          createdAt: {
                              gte: new Date(query.from),
                          },
                      }
                    : {},
            ],
        };

        const [total, orders] = await prisma.$transaction([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where: {
                    customerId: session?.user?.customer?.id,
                },
                include: {
                    productItem: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultOrderPerPage)
                    : 0,
                take: query.perpage || defaultOrderPerPage,
            }),
        ]);

        console.log(total, orders);

        return serverResponse({
            data: {
                data: orders,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultOrderPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultOrderPerPage),
                ),
            },
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

        const totalAmount =
            getPriceAccordingToCategoryOfCustomer(
                session.user.customer.customerCategory,
                {
                    avgPrice: productItem.avgPrice,
                    maxPrice: productItem.maxPrice,
                    minPrice: productItem.minPrice,
                },
            ) *
            (Math.max(qty, productItem?.minQty) / productItem.minQty);

        const { order } = await placeOrder(
            session?.user?.customer?.id,
            productItem?.id,
            productItem.sku,
            Math.max(qty, productItem?.minQty),
            totalAmount,
            fileUrl,
        );

        return serverResponse({
            status: 201,
            success: true,
            message: "Order placed successfully",
            data: order,
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
