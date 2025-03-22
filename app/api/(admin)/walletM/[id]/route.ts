import { auth } from "@/lib/auth";
import {
    allowedRoleForAccountManagement,
    defaultTransactionPerPage,
} from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import { Prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
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
        const { id } = await params;

        if (!id || isNaN(parseInt(id))) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid wallet id",
            });
        }
        const { searchParams } = new URL(req.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: PrismaType.transactionWhereInput = {
            AND: [
                { walletId: parseInt(id) },
                query.search
                    ? {
                          OR: [
                              {
                                  id: {
                                      gte: parseInt(query?.search),
                                  },
                              },
                              {
                                  amount: {
                                      gte: parseInt(query?.search),
                                  },
                              },
                              {
                                  staff: {
                                      id: parseInt(query?.search),
                                  },
                              },
                              { description: { contains: query?.search } },
                          ],
                      }
                    : {},
            ],
        };

        const [wallet, total, transactions] = await Prisma.$transaction([
            Prisma.wallet.findUnique({
                where: { id: parseInt(id) },
                include: {
                    customer: {
                        omit: {
                            password: true,
                        },
                    },
                },
            }),
            Prisma.transaction.count({ where }),
            Prisma.transaction.findMany({
                where,
                include: {
                    staff: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    [query?.sortby ?? "createdAt"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || defaultTransactionPerPage)
                    : 0,
                take: query.perpage || defaultTransactionPerPage,
            }),
        ]);

        return serverResponse({
            data: {
                wallet,
                total,
                transactions,
                page: query.page || 1,
                perpage: query.perpage || defaultTransactionPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultTransactionPerPage),
                ),
            },
            status: 200,
            success: true,
            message: "wallet data fetched successfully",
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error fetching wallets and transaction .",
            error: error instanceof Error ? error.message : error,
        });
    }
}
