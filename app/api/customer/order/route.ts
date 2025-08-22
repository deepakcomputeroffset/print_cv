import { auth } from "@/lib/auth";
import { getPriceAccordingToCategoryOfCustomer } from "@/lib/getPriceOfProductItem";
import serverResponse from "@/lib/serverResponse";
import { defaultOrderPerPage } from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { NextRequest } from "next/server";
import {
    cityDiscount,
    customerCategory,
    Prisma as PrismaType,
} from "@prisma/client";
import { placeOrder } from "@/lib/placeOrder";

function calculateProductPrice(
    productItem: {
        pricing: { id: number; qty: number; price: number }[];
        product: {
            isTieredPricing: boolean;
        };
    },
    qty: number | null,
    customerCategory: customerCategory | null | undefined,
    cityDiscount: Pick<cityDiscount, "id" | "discount"> | null,
): number {
    if (!productItem?.pricing?.length) return 0;

    // Find the appropriate pricing tier
    const pricing = productItem.product?.isTieredPricing
        ? productItem.pricing.find((v) => v.qty === qty)
        : productItem.pricing[0];

    if (!pricing || !pricing.price) return 0;

    // Calculate discounted price
    const discountedPrice = getPriceAccordingToCategoryOfCustomer(
        customerCategory,
        cityDiscount,
        pricing.price,
    );

    /*
     Calculate final price based on pricing model
     discountedPrice * ((qty || 0) / (pricing.qty || 1))
     2000(give by customer)/1000(set by admin) = 2 * price
     */
    return productItem.product?.isTieredPricing
        ? discountedPrice
        : discountedPrice * ((qty || 0) / (pricing.qty || 1));
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        // Validate session and permissions
        if (
            !session?.user?.customer ||
            session.user.userType !== "customer" ||
            session.user.customer.isBanned
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized: Invalid or banned customer account",
            });
        }

        // Parse JSON data instead of form data

        const orderDetail = await request.json();
        const { productItemId, qty, fileOption } = orderDetail;

        // Validate required fields
        if (!productItemId || !qty || !fileOption) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Missing required fields: productItemId, qty, or fileOption",
            });
        }

        // Validate data types
        if (typeof productItemId !== "number" || typeof qty !== "number") {
            return serverResponse({
                status: 400,
                success: false,
                error: "Invalid data types: productItemId and qty must be numbers",
            });
        }

        // Validate quantity
        if (qty <= 0) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Quantity must be greater than zero",
            });
        }

        // Validate fileOption
        if (!["UPLOAD", "EMAIL"].includes(fileOption)) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Invalid fileOption. Must be either 'UPLOAD' or 'EMAIL'",
            });
        }

        // Fetch product item with only necessary fields
        const productItem = await Prisma?.productItem.findUnique({
            where: {
                id: productItemId,
                isAvailable: true, // Combine conditions
            },
            select: {
                id: true,
                sku: true,
                isAvailable: true,
                pricing: {
                    select: {
                        id: true,
                        qty: true,
                        price: true,
                    },
                    orderBy: {
                        qty: "asc", // Ensure consistent ordering
                    },
                },
                product: {
                    select: {
                        isTieredPricing: true,
                    },
                },
                uploadGroup: {
                    select: {
                        uploadTypes: true,
                    },
                },
            },
        });

        if (!productItem) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Product not found or unavailable",
            });
        }

        // Validate quantity based on product pricing structure
        const minQty = productItem.pricing?.[0]?.qty;
        let isValidQuantity = false;

        if (productItem.product.isTieredPricing) {
            // For tiered pricing, qty must exactly match one of the available tiers
            isValidQuantity = productItem.pricing.some((p) => p.qty === qty);
            if (!isValidQuantity) {
                const validTiers = productItem.pricing.map((p) => p.qty);
                return serverResponse({
                    status: 400,
                    success: false,
                    error: `Invalid quantity for tiered pricing. Available quantities: ${validTiers.join(", ")}`,
                });
            }
        } else {
            // For regular pricing, qty must be >= minQty and a multiple of minQty
            isValidQuantity = qty >= minQty && qty % minQty === 0;
            if (!isValidQuantity) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: `Quantity must be at least ${minQty} and a multiple of ${minQty}`,
                });
            }
        }

        // Get city discount (if any)
        const cityDiscount = await Prisma.cityDiscount.findFirst({
            where: {
                cityId: session.user.customer.address?.cityId,
                customerCategoryId: session.user.customer
                    .customerCategoryId as number,
            },
            select: {
                id: true,
                discount: true,
            },
        });

        // Calculate base price
        const basePrice = calculateProductPrice(
            productItem,
            qty,
            session.user.customer.customerCategory,
            cityDiscount,
        );

        if (basePrice <= 0) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Could not calculate valid price for this product",
            });
        }

        // Place the order
        const { order } = await placeOrder(
            session.user.customer.id,
            productItem.id,
            productItem.sku,
            qty,
            basePrice,
            fileOption,
        );

        return serverResponse({
            status: 201,
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    } catch (error) {
        console.error("Order placement error:", error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Invalid JSON format in request body",
            });
        }

        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes("Insufficient wallet balance")) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: error.message,
                });
            }

            if (error.message.includes("Bad order request")) {
                return serverResponse({
                    status: 400,
                    success: false,
                    error: "Invalid order parameters",
                });
            }
        }

        return serverResponse({
            status: 500,
            success: false,
            error: "Internal server error during order processing",
            message: "Please try again later",
        });
    }
}

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
