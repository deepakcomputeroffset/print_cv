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
import {
    customerCategory,
    Prisma as PrismaType,
    UPLOADVIA,
} from "@prisma/client";
import { placeOrder } from "@/lib/placeOrder";
import { FileLike } from "@/types/types";

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
            include: {
                pricing: true,
                product: {
                    select: {
                        isTieredPricing: true,
                    },
                },
            },
        });

        if (!productItem || !productItem.isAvailable) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Product not found!",
            });
        }

        // Validate quantity based on product pricing structure
        const minQty = productItem.pricing?.[0]?.qty || 1;

        if (productItem?.product?.isTieredPricing) {
            // For tiered pricing, qty must exactly match one of the available tiers
            const validTiers = productItem.pricing?.map((p) => p.qty) || [];
            if (!validTiers.includes(qty)) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: `Invalid quantity. Available quantities: ${validTiers.join(", ")}`,
                });
            }
        } else {
            // For regular pricing, qty must be >= minQty and a multiple of minQty
            if (qty < minQty) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: `Minimum quantity is ${minQty}`,
                });
            }

            if (qty % minQty !== 0) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: `Quantity must be a multiple of ${minQty}`,
                });
            }
        }

        const address = await Prisma.address.findFirst({
            where: {
                ownerId: session.user.customer.id,
                ownerType: "CUSTOMER",
            },
        });
        const cityDiscount = await Prisma.cityDiscount.findFirst({
            where: {
                cityId: address?.cityId,
                customerCategoryId: session.user.customer
                    .customerCategoryId as number,
            },
        });
        const findPrice = () => {
            if (productItem?.product?.isTieredPricing)
                return productItem?.pricing?.find((v) => v.qty === qty);
            return productItem?.pricing?.[0];
        };

        const basePrice = productItem?.product?.isTieredPricing
            ? getPriceAccordingToCategoryOfCustomer(
                  session.user.customer.customerCategory as customerCategory,
                  cityDiscount,
                  findPrice()?.price as number,
              ) || 0
            : findPrice()?.qty &&
              qty &&
              getPriceAccordingToCategoryOfCustomer(
                  session.user.customer.customerCategory as customerCategory,
                  cityDiscount,
                  findPrice()?.price as number,
              ) *
                  (qty / (findPrice()?.qty ?? 0));

        let fileUrls: string[] | undefined = undefined;
        if (uploadType === "UPLOAD") {
            const files = orderDetail.getAll("file") as FileLike[];
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
            if (!basePrice)
                return serverResponse({
                    status: 500,
                    success: false,
                    message: "Order not completed due to some error.",
                });

            const { order } = await placeOrder(
                session?.user?.customer?.id,
                productItem?.id,
                productItem.sku,
                qty,
                basePrice,
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
