import { Prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import { allowedRoleForCategoryAndProductManagement } from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session?.user?.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session?.user?.staff?.role as ROLE,
            ) ||
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

        const where: PrismaType.uploadGroupWhereInput = {
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

                              !isNaN(parseInt(query?.search))
                                  ? {
                                        id: {
                                            gte: parseInt(query.search),
                                        },
                                    }
                                  : {},
                          ],
                      }
                    : {},
            ],
        };

        const [uploadGroups] = await Prisma.$transaction([
            Prisma.uploadGroup.findMany({
                where,
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder ?? "asc",
                },
            }),
        ]);

        return serverResponse({
            status: 200,
            success: false,
            data: {
                data: uploadGroups,
            },
            message: "Upload groups fetched successfully.",
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while fetching products.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
