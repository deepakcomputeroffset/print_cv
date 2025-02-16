import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/hash";
import { staffFormSchema } from "@/schemas/staff.form.schema";
import { Prisma } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import { defaultStaffPerPage } from "@/lib/constants";

export async function GET(request: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: Prisma.staffWhereInput = {
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

                query?.status && query?.status !== "all"
                    ? {
                          isBanned: query?.status === "true",
                      }
                    : {},
            ],
        };

        const [total, staff] = await prisma.$transaction([
            prisma.staff.count({ where }),
            prisma.staff.findMany({
                where,
                // include: {
                //     address: {
                //         include: {
                //             city: {
                //                 include: {
                //                     state: true,
                //                 },
                //             },
                //         },
                //     },
                // },
                omit: { password: true },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultStaffPerPage)
                    : 0,
                take: query.perpage || defaultStaffPerPage,
            }),
        ]);

        return NextResponse.json({
            staff,
            total,
            page: query.page || 1,
            perpage: query.perpage || defaultStaffPerPage,
            totalPages: Math.ceil(
                total / (query.perpage || defaultStaffPerPage),
            ),
        });
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json(
            { error: "Failed to fetch staff" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();

        const { success, data: safeData } = staffFormSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid staff data",
                },
                {
                    status: 400,
                },
            );
        }

        const isExit = await prisma.staff.findUnique({
            where: {
                phone: safeData.phone,
            },
        });

        if (isExit) {
            return NextResponse.json(
                {
                    success: false,
                    message: "staff already added with this phone number.",
                },
                { status: 401 },
            );
        }

        const createdStaff = await prisma.staff.create({
            data: {
                ...safeData,
                password: await generateHash(safeData.password),
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: "staff created successfully",
                data: createdStaff,
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
