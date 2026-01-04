import { Prisma } from "@/lib/prisma";
import { jobFormSchema } from "@/schemas/job.form.schema";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import {
    allowedRoleForJobManagement,
    defaultJobsPerPage,
} from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForJobManagement.includes(
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

        const where: PrismaType.jobWhereInput = {
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
                {
                    ...(query.isVerified === "true"
                        ? { isVerified: true }
                        : query.isVerified === "false"
                          ? { isVerified: false }
                          : {}),
                },
            ],
        };

        const [total, jobs] = await Prisma.$transaction([
            Prisma.job.count({ where }),
            Prisma.job.findMany({
                where,
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultJobsPerPage)
                    : 0,
                take: query.perpage || defaultJobsPerPage,
            }),
        ]);
        return serverResponse({
            status: 200,
            success: true,
            data: {
                jobs,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultJobsPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultJobsPerPage),
                ),
            },
            message: "jobs fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching job.",
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
            !allowedRoleForJobManagement.includes(
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
        } = jobFormSchema.safeParse(data);
        console.log(safeData, success);
        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid job data",
                error: error.issues,
            });
        }

        const isExit = await Prisma.job.findUnique({
            where: {
                name: safeData.name,
            },
        });

        if (isExit) {
            return serverResponse({
                status: 404,
                success: false,
                message: "job already exist with this name.",
            });
        }

        const createdjob = await Prisma.job.create({
            data: {
                name: safeData.name,
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            data: createdjob,
            message: "job created successfully",
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while creating job.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
