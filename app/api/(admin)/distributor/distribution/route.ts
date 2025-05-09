import { auth } from "@/lib/auth";
import {
    allowedRoleForDistributionManagement,
    defaultOrderPerPage,
} from "@/lib/constants";
import { Prisma as PrismaType } from "@prisma/client";
import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { QuerySchema } from "@/schemas/query.param.schema";
import { ROLE } from "@prisma/client";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType !== "staff" ||
            !allowedRoleForDistributionManagement.includes(
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
        const { searchParams } = new URL(req.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: PrismaType.distributionWhereInput = {
            AND: [
                {
                    distributorId: session?.user?.staff?.id,
                    completed: Boolean(query.completed) || false,
                },
                query.search
                    ? {
                          order: {
                              OR: [
                                  !isNaN(parseInt(query?.search))
                                      ? {
                                            id: {
                                                gte: parseInt(query?.search),
                                            },
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
                                                  businessName: {
                                                      contains: query?.search,
                                                      mode: "insensitive",
                                                  },
                                              },
                                              {
                                                  email: {
                                                      contains: query?.search,
                                                      mode: "insensitive",
                                                  },
                                              },
                                              {
                                                  phone: {
                                                      contains: query?.search,
                                                  },
                                              },
                                              !isNaN(parseInt(query?.search))
                                                  ? {
                                                        id: {
                                                            gte: parseInt(
                                                                query?.search,
                                                            ),
                                                        },
                                                    }
                                                  : {},
                                          ],
                                      },
                                  },
                              ],
                          },
                      }
                    : {},
            ],
        };

        const distribution = await Prisma.distribution.findMany({
            where,
            include: {
                order: {
                    include: {
                        customer: {
                            omit: {
                                password: true,
                            },
                        },
                        productItem: {
                            include: {
                                product: true,
                            },
                        },
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
        });

        const c_ids = distribution.map((dis) => dis?.order?.customerId);
        const address = await Prisma.address.findMany({
            where: {
                ownerId: { in: c_ids },
                ownerType: "CUSTOMER",
            },
            include: {
                city: {
                    include: {
                        state: true,
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
        });

        const distributionWithTheirAddress = distribution.map((dis) => ({
            ...dis,
            order: {
                ...dis.order,
                customer: {
                    ...dis.order.customer,
                    address: address.filter(
                        (a) =>
                            a.ownerId === dis.order.customerId &&
                            a.ownerType === "CUSTOMER",
                    )[0],
                },
            },
        }));

        return serverResponse({
            status: 200,
            success: true,
            data: distributionWithTheirAddress,
            message: "orders fetched successfully to distribute.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching orders to distribute.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType !== "staff" ||
            !allowedRoleForDistributionManagement.includes(
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
        const { orderId } = await req.json();

        if (!orderId) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Order Id is required.",
            });
        }

        const distribution = await Prisma.distribution.findFirst({
            where: {
                orderId,
                distributorId: session?.user?.staff?.id,
            },
        });

        if (!distribution) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Distribution or order not found.",
            });
        }

        const updatedDistribution = await Prisma.distribution.update({
            where: {
                distributorId: distribution.id,
                orderId: distribution.orderId,
            },
            data: {
                completed: true,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: updatedDistribution,
            message: "Distribution updated successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while updationg distribution.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
