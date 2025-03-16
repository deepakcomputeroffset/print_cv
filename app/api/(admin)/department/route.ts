import { prisma } from "@/lib/prisma";
import { taskTypeFormSchema } from "@/schemas/taskType.form.schema";
import { Prisma, ROLE } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import {
    allowedRoleForOrderManagement,
    defaultDepartmentsPerPage,
} from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

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

        const where: Prisma.taskTypeWhereInput = {
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
                          ],
                      }
                    : {},
            ],
        };

        const [total, departments] = await prisma.$transaction([
            prisma.taskType.count({ where }),
            prisma.taskType.findMany({
                where,
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || defaultDepartmentsPerPage)
                    : 0,
                take: query.perpage || defaultDepartmentsPerPage,
            }),
        ]);

        return serverResponse({
            status: 200,
            success: true,
            data: {
                departments,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultDepartmentsPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultDepartmentsPerPage),
                ),
            },
            message: "departments fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching department.",
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

        const data = await req.json();

        const {
            success,
            data: safeData,
            error,
        } = taskTypeFormSchema.safeParse(data);

        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid staff data",
                error: error.issues,
            });
        }

        const isExit = await prisma.taskType.findUnique({
            where: {
                name: safeData.name,
            },
        });

        if (isExit) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Department already added with this phone number",
            });
        }

        const createdDepartment = await prisma.taskType.create({
            data: {
                ...safeData,
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            data: createdDepartment,
            message: "Department created successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while creating department.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
