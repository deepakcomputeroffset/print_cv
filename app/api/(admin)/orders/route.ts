import { auth } from "@/lib/auth";
import {
    allowedRoleForOrderManagement,
    defaultOrderPerPage,
} from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma, ROLE, STATUS } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForOrderManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: Prisma.orderWhereInput = {
            AND: [
                query.search
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
                          amount: {
                              gte: parseInt(query.minPrice),
                          },
                      }
                    : {},
                query.maxPrice && !isNaN(parseInt(query.maxPrice))
                    ? {
                          amount: {
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
                query.orderStatus && query.orderStatus !== "ALL"
                    ? { status: query.orderStatus as STATUS }
                    : {},
            ],
        };

        const [total, orders] = await prisma.$transaction([
            prisma.order.count({ where }),
            prisma.order.findMany({
                where,
                orderBy: {
                    [query?.sortby ?? "createdAt"]: query?.sortorder || "desc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultOrderPerPage)
                    : 0,
                take: query.perpage || defaultOrderPerPage,
                include: {
                    attachment: true,
                    job: {
                        include: { tasks: true },
                    },
                    productItem: {
                        include: {
                            product: {
                                include: {
                                    category: true,
                                },
                            },
                            productAttributeOptions: true,
                        },
                    },
                    customer: {
                        select: {
                            address: {
                                include: {
                                    city: {
                                        include: {
                                            state: {
                                                include: {
                                                    country: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            businessName: true,
                            customerCategory: true,
                            name: true,
                            phone: true,
                            isBanned: true,
                            email: true,
                            gstNumber: true,
                            id: true,
                        },
                    },
                },
            }),
        ]);

        return serverResponse({
            status: 200,
            success: true,
            data: {
                orders,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultOrderPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultOrderPerPage),
                ),
            },
            message: "orders fetched successfully.",
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching orders.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
