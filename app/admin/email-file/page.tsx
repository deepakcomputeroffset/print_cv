import { QueryParams } from "@/types/types";
import { defaultOrderPerPage } from "@/lib/constants";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { OrdersFilter } from "./components/filter";
import { Prisma } from "@/lib/prisma";
import { Prisma as PrismaType, UPLOADVIA } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { allowedRoleForOrderManagement } from "@/lib/constants";
import { ROLE } from "@prisma/client";
import { OrdersTable } from "./components/OrdersTable";

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<QueryParams>;
}) {
    const session = await auth();
    if (
        !session ||
        session?.user?.userType != "staff" ||
        !allowedRoleForOrderManagement.includes(
            session?.user?.staff?.role as ROLE,
        ) ||
        (session.user.staff?.role !== "ADMIN" && session.user.staff?.isBanned)
    ) {
        redirect("/login");
    }

    const filters = await searchParams;

    const where: PrismaType.orderWhereInput = {
        AND: [
            filters.search
                ? {
                      OR: [
                          !isNaN(parseInt(filters.search))
                              ? {
                                    id: {
                                        gte: parseInt(filters.search),
                                    },
                                }
                              : {},
                          !isNaN(parseInt(filters.search))
                              ? {
                                    customerId: parseInt(filters.search),
                                }
                              : {},
                          {
                              customer: {
                                  OR: [
                                      {
                                          name: {
                                              contains: filters?.search,
                                              mode: "insensitive",
                                          },
                                      },
                                      {
                                          phone: {
                                              contains: filters?.search,
                                              mode: "insensitive",
                                          },
                                      },
                                  ],
                              },
                          },
                      ],
                  }
                : {},
            filters.minPrice && !isNaN(parseInt(filters.minPrice))
                ? {
                      total: {
                          gte: parseInt(filters.minPrice),
                      },
                  }
                : {},
            filters.maxPrice && !isNaN(parseInt(filters.maxPrice))
                ? {
                      total: {
                          lte: parseInt(filters.maxPrice),
                      },
                  }
                : {},
            filters?.from
                ? {
                      createdAt: {
                          gte: new Date(filters.from as string),
                      },
                  }
                : {},
            filters.to
                ? {
                      createdAt: {
                          lte: new Date(filters.to as string),
                      },
                  }
                : {},
            {
                status: "PLACED",
            },
            {
                uploadFilesVia: UPLOADVIA.EMAIL,
            },
        ],
    };

    const [total, orders] = await Promise.all([
        Prisma.order.count({ where }),
        Prisma.order.findMany({
            where,
            orderBy: {
                [filters?.sortby ?? "createdAt"]: filters?.sortorder || "desc",
            },
            skip: filters.page
                ? (Number(filters.page) - 1) * (Number(filters.perpage) || defaultOrderPerPage)
                : 0,
            take: Number(filters.perpage) || defaultOrderPerPage,
            include: {
                productItem: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                category: true,
                            },
                        },
                    },
                },
                customer: {
                    select: {
                        businessName: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        }),
    ]);

    const totalPages = Math.ceil(
        total / (Number(filters.perpage) || defaultOrderPerPage),
    );

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <SidebarTrigger className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Email Files</h1>
            </div>
            <div className="space-y-4">
                <OrdersFilter filters={filters} />
                <OrdersTable orders={orders} totalPages={totalPages} />
            </div>
        </div>
    );
}
