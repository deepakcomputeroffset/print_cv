import { Prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/hash";
import { staffFormSchema } from "@/schemas/staff.form.schema";
import { Prisma as PrismaType } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import { defaultStaffPerPage } from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            session.user.staff?.role !== "ADMIN"
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: PrismaType.staffWhereInput = {
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
            id: {
                not: session.user.staff.id,
            },
        };

        const [total, staff] = await Prisma.$transaction([
            Prisma.staff.count({ where }),
            Prisma.staff.findMany({
                where,
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

        const staffIds = staff.map((c) => c.id);
        const address = await Prisma.address.findMany({
            where: {
                ownerId: { in: staffIds },
                ownerType: "STAFF",
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
                ? (query.page - 1) * (query.perpage || defaultStaffPerPage)
                : 0,
            take: query.perpage || defaultStaffPerPage,
        });
        // Map addresses to staff
        const staffWithAddresses = staff.map((s) => ({
            ...s,
            address: address.filter(
                (a) => a.ownerId === s.id && a.ownerType === "STAFF",
            )[0],
        }));

        return serverResponse({
            status: 200,
            success: true,
            data: {
                staff: staffWithAddresses,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultStaffPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultStaffPerPage),
                ),
            },
            message: "Staffs fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching staff.",
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
            session.user.staff?.role !== "ADMIN"
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const data = await req.json();

        const {
            success,
            data: safeData,
            error,
        } = staffFormSchema.safeParse(data);

        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid staff data",
                error: error.issues,
            });
        }

        const isExit = await Prisma.staff.findUnique({
            where: {
                phone: safeData.phone,
            },
        });

        if (isExit) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Staff already added with this phone number",
            });
        }

        const createdStaff = await Prisma.staff.create({
            data: {
                name: safeData.name,
                phone: safeData.phone,
                role: safeData.role,
                email: safeData.email,
                password: await generateHash(safeData.password),
            },
        });

        const address = await Prisma.address.create({
            data: {
                ownerId: createdStaff.id,
                ownerType: "STAFF",
                line: safeData?.line,
                pinCode: safeData?.pinCode,
                cityId: Number(safeData?.city),
            },
        });

        const staff = { ...createdStaff, address };

        return serverResponse({
            status: 201,
            success: true,
            data: staff,
            message: "staff created successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while creating staff.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
