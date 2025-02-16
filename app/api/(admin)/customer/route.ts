import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/hash";
import { customerFormSchema } from "@/schemas/customer.form.schema";
import { Prisma } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import { defaultCustomerPerPage } from "@/lib/constants";

export async function GET(request: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: Prisma.customerWhereInput = {
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

        const [total, customers] = await prisma.$transaction([
            prisma.customer.count({ where }),
            prisma.customer.findMany({
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

        return NextResponse.json({
            customers,
            total,
            page: query.page || 1,
            perpage: query.perpage || defaultCustomerPerPage,
            totalPages: Math.ceil(
                total / (query.perpage || defaultCustomerPerPage),
            ),
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();
        const { success, data: safeData } = customerFormSchema?.safeParse(data);

        if (!success) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 },
            );
        }

        // Check if customer already exists
        const exit_customer = await prisma.customer.findUnique({
            where: { phone: safeData?.phone },
        });

        if (exit_customer) {
            return NextResponse.json(
                {
                    success: false,
                    message: "customer already exist with this phone number",
                },
                { status: 400 },
            );
        }

        // Create customer
        const customer = await prisma.customer.create({
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
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "customer created successfully",
                customer,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Registration error:", `${error}`);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 },
        );
    }
}
