import { auth } from "@/lib/auth";
import {
    allowedRoleForDispatchManagement,
    defaultOrderPerPage,
} from "@/lib/constants";
import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma as PrismaType, ROLE } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const session = await auth();

        if (
            !session ||
            session.user.userType !== "staff" ||
            !allowedRoleForDispatchManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned === true)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));
        const where: PrismaType.orderWhereInput = {
            AND: [
                {
                    job: {
                        isVerified: true,
                        isCompleted: true,
                    },
                },
                query.search && query.search !== ""
                    ? {
                          OR: [
                              !isNaN(parseInt(query.search))
                                  ? {
                                        id: {
                                            gte: parseInt(query.search),
                                        },
                                    }
                                  : {},
                              !isNaN(parseInt(query.search))
                                  ? {
                                        customerId: parseInt(query.search),
                                    }
                                  : {},
                              {
                                  customer: {
                                      OR: [
                                          {
                                              name: {
                                                  contains: query?.search,
                                                  mode: "insensitive",
                                              },
                                          },
                                          {
                                              phone: {
                                                  contains: query?.search,
                                                  mode: "insensitive",
                                              },
                                          },
                                      ],
                                  },
                              },
                          ],
                      }
                    : {},
                query.minPrice && !isNaN(parseInt(query.minPrice))
                    ? {
                          total: {
                              gte: parseInt(query.minPrice),
                          },
                      }
                    : {},
                query.maxPrice && !isNaN(parseInt(query.maxPrice))
                    ? {
                          total: {
                              lte: parseInt(query.maxPrice),
                          },
                      }
                    : {},
                query?.from
                    ? {
                          createdAt: {
                              gte: new Date(query.from as string),
                          },
                      }
                    : {},
                query.to
                    ? {
                          createdAt: {
                              lte: new Date(query.to as string),
                          },
                      }
                    : {},
                !query?.dispatched || query?.dispatched == "false"
                    ? { status: "PROCESSED" }
                    : { status: "DISPATCHED" },
            ],
        };

        const [total, orders] = await Prisma.$transaction([
            Prisma.order.count({ where }),
            Prisma.order.findMany({
                where,
                orderBy: {
                    [query?.sortby ?? "createdAt"]: query?.sortorder || "desc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultOrderPerPage)
                    : 0,
                take: query.perpage || defaultOrderPerPage,
                include: {
                    productItem: {
                        include: {
                            pricing: true,
                            product: true,
                        },
                    },
                    customer: {
                        omit: {
                            password: true,
                            isBanned: true,
                        },
                    },
                    attachment: true,
                },
            }),
        ]);

        const customerIds = orders.map((c) => c.customerId);
        const address = await Prisma.address.findMany({
            where: {
                ownerId: { in: customerIds },
                ownerType: "CUSTOMER",
            },
            include: {
                city: {
                    include: {
                        state: true,
                    },
                },
            },
            skip: query.page
                ? (query.page - 1) * (query.perpage || defaultOrderPerPage)
                : 0,
            take: query.perpage || defaultOrderPerPage,
        });

        const orderWithCustomerWithAddress = orders.map((order) => ({
            ...order,
            customer: {
                ...order.customer,
                address: address.filter(
                    (a) =>
                        a.ownerId === order.customerId &&
                        a.ownerType === "CUSTOMER",
                )[0],
            },
        }));
        return serverResponse({
            status: 200,
            success: true,
            message: "Orders fetched successfully",
            data: {
                orders: orderWithCustomerWithAddress,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultOrderPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultOrderPerPage),
                ),
            },
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching orders",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (
            !session ||
            session.user.userType !== "staff" ||
            !allowedRoleForDispatchManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned === true)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = await request.json();

        const order = await Prisma.order.update({
            where: { id },
            data: { status: "DISPATCHED", deliveryVia: "DIRECT" },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "Order dispatched successfully",
            data: order,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error dispatching order",
            error: error instanceof Error ? error.message : error,
        });
    }
}
