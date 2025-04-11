import { auth } from "@/lib/auth";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import serverResponse from "@/lib/serverResponse";
import { deleteFile, uploadMultipleFiles } from "@/lib/storage";
import {
    allowedFileMimeType,
    defaultOrderPerPage,
    maxFileSize,
} from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { NextRequest } from "next/server";
import { Prisma as PrismaType, UPLOADVIA } from "@prisma/client";
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

        const where: PrismaType.orderWhereInput = {
            customerId: session?.user?.customer?.id,
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
                !!query.orderStatus && query.orderStatus !== "ALL"
                    ? {
                          status: query.orderStatus,
                      }
                    : {},
            ],
        };

        const [total, orders] = await Prisma.$transaction([
            Prisma.order.count({ where }),
            Prisma.order.findMany({
                where,
                include: {
                    productItem: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: {
                    [query?.sortby ?? "createdAt"]: query?.sortorder || "desc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultOrderPerPage)
                    : 0,
                take: query.perpage || defaultOrderPerPage,
            }),
        ]);

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
        const uploadType = orderDetail.get("uploadType") as UPLOADVIA;

        if (!productItemId || !qty || !uploadType) {
            return serverResponse({
                status: 400,
                success: false,
                error: "All fields are required.",
            });
        }

        const productItem = await Prisma?.productItem.findUnique({
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

        const price = getPriceAccordingToCategoryOfCustomer(
            session.user.customer.customerCategory,
            {
                avgPrice: productItem.avgPrice,
                maxPrice: productItem.maxPrice,
                minPrice: productItem.minPrice,
            },
        );

        let fileUrls: string[] | undefined = undefined;
        if (uploadType === "UPLOAD") {
            const files = orderDetail.getAll("file") as File[];
            if (!files.length) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: "File not found.",
                });
            }
            if (
                files.filter(
                    (f) =>
                        allowedFileMimeType.includes(f.type) &&
                        f.size < maxFileSize,
                ).length < files.length
            ) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: "Only PDFs and image files are allowed",
                });
            }

            fileUrls = await uploadMultipleFiles(
                "files",
                files,
                Date.now().toString(),
            );
        }

        try {
            const { order } = await placeOrder(
                session?.user?.customer?.id,
                productItem?.id,
                productItem.sku,
                Math.max(qty, productItem?.minQty),
                productItem?.minQty,
                price,
                uploadType === "UPLOAD" ? "UPLOAD" : "EMAIL",
                fileUrls,
            );

            return serverResponse({
                status: 201,
                success: true,
                message: "Order placed successfully",
                data: order,
            });
        } catch (error) {
            console.log(error);
            if (uploadType === "UPLOAD")
                fileUrls?.forEach(async (u) => await deleteFile(u));
            return serverResponse({
                status: 400,
                success: false,
                message: "Order not placed.",
                error: error instanceof Error ? error.message : error,
            });
        }
    } catch (error) {
        console.log(`${error}`);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
            message: "Internal Error",
        });
    }
}
