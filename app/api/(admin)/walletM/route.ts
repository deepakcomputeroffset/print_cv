import { auth } from "@/lib/auth";
import {
    allowedRoleForAccountManagement,
    defaultCustomerPerPage,
} from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import { Prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { transactionFormSchema } from "@/schemas/transaction.form.schema";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForAccountManagement.includes(
                session.user.staff?.role as ROLE,
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

        const { searchParams } = new URL(req.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: PrismaType.customerWhereInput = {
            AND: [
                query.search
                    ? {
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
                              { phone: { contains: query?.search } },
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
                query?.category && query?.category !== "all"
                    ? {
                          customerCategoryId: parseInt(query?.category),
                      }
                    : {},
                query?.status && query?.status !== "all"
                    ? {
                          isBanned: query?.status === "true",
                      }
                    : {},
            ],
        };

        const [total, customers] = await Prisma.$transaction([
            Prisma.customer.count({ where }),
            Prisma.customer.findMany({
                where,
                include: {
                    wallet: {
                        select: {
                            balance: true,
                            id: true,
                        },
                    },
                },
                omit: { password: true },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || defaultCustomerPerPage)
                    : 0,
                take: query.perpage || defaultCustomerPerPage,
            }),
        ]);

        return serverResponse({
            data: {
                customers,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultCustomerPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultCustomerPerPage),
                ),
            },
            status: 200,
            success: true,
            message: "Customers data fetched successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching wallets.",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForAccountManagement.includes(
                session.user.staff?.role as ROLE,
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

        const data = await req.json();
        const result = transactionFormSchema.safeParse(data);

        if (!result.success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid data",
                error: result.error.issues,
            });
        }

        const customer = await Prisma.customer.findUnique({
            where: {
                id: result.data.customerId,
            },
            include: {
                wallet: true,
            },
        });

        if (!customer)
            return serverResponse({
                status: 400,
                success: false,
                message: "Customer not found",
                error: result.error,
            });

        console.log(result);

        await Prisma.$transaction(async (tx) => {
            const transac = await tx.transaction.create({
                data: {
                    walletId: customer?.wallet?.id as number,
                    type: result.data.type,
                    description: result.data.description,
                    amount: result.data.amount,
                    createBy: session.user.staff?.id as number,
                },
            });

            await tx.wallet.update({
                where: {
                    id: transac.walletId,
                },
                data: {
                    balance:
                        transac.type === "CREDIT"
                            ? {
                                  increment: transac.amount,
                              }
                            : { decrement: transac.amount },
                },
            });
        });

        return serverResponse({
            status: 201,
            success: true,
            message: "Transaction created successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching wallets.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
