import { Prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/hash";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import { Prisma as PrismaType } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import { defaultCustomerPerPage } from "@/lib/constants";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            (session.user.staff?.role !== "ADMIN" &&
                session?.user?.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { searchParams } = new URL(request.url);
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
                          customerCategory: query?.category,
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
                    address: {
                        include: {
                            city: {
                                include: {
                                    state: true,
                                },
                            },
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
        console.error("Error fetching customers:", `${error}`);
        return serverResponse({
            error: error instanceof Error ? error.message : error,
            status: 500,
            success: false,
            message: "Internal Error",
        });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {
            success,
            data: safeData,
            error,
        } = customerFormSchema?.safeParse(data);
        console.log(safeData);
        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                error: error.issues,
                message: "Required all fields",
            });
        }

        // Check if customer already exists
        const isExist = await Prisma.customer.findUnique({
            where: { phone: safeData?.phone },
        });

        if (isExist) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Customer already exist with this phone number",
            });
        }

        // Create customer
        const customer = await Prisma.customer.create({
            data: {
                name: safeData?.name,
                businessName: safeData?.businessName,
                phone: safeData?.phone,
                email: safeData?.email,
                password: await generateHash(safeData?.password),
                address: {
                    create: {
                        line: safeData?.line,
                        pinCode: safeData?.pinCode,
                        cityId: Number(safeData?.city),
                    },
                },
                wallet: {
                    create: {},
                },
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    } catch (error) {
        console.error("Registration error:", `${error}`);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
            message: "Internal error",
        });
    }
}
