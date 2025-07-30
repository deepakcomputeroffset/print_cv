import { Prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import {
    allowedRoleForCategoryAndProductManagement,
    defaultDesignPerPage,
    maxImageSize,
} from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";
import { designItemSchema } from "@/schemas/design.item.form.schema";
import { uploadFile } from "@/lib/storage";
import { parseFormData } from "@/lib/formData";

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

        const where: PrismaType.designWhereInput = {
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
                query?.designCategoryId && query?.designCategoryId !== "all"
                    ? {
                          designCategoryId: parseInt(query?.designCategoryId),
                      }
                    : {},
            ],
        };

        const [total, designs] = await Prisma.$transaction([
            Prisma.design.count({ where }),
            Prisma.design.findMany({
                where,
                include: {
                    designCategory: true,
                },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder ?? "asc",
                },
                skip: query.page
                    ? (query.page - 1) * (query.perpage || defaultDesignPerPage)
                    : 0,
                take: query.perpage || defaultDesignPerPage,
            }),
        ]);

        return serverResponse({
            status: 200,
            success: false,
            data: {
                data: designs,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultDesignPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultDesignPerPage),
                ),
            },
            message: "Products fetched successfully.",
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

export async function POST(req: Request) {
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

        const data = await req.formData();
        const {
            success,
            data: safeData,
            error,
        } = parseFormData(data, designItemSchema);

        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid data",
                error: error.issues,
            });
        }

        const isDesignExit = await Prisma.design.findUnique({
            where: {
                designCategoryId: safeData?.designCategoryId,
                name: safeData?.name,
            },
        });

        if (isDesignExit) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Name already exists",
            });
        }

        const image = data.get("image");
        const downloadFile = data.get("download");

        if (
            !image ||
            typeof image !== "object" ||
            !("size" in image) ||
            !downloadFile ||
            typeof downloadFile !== "object"
        ) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid image file or download file.",
            });
        }

        if (image.size > maxImageSize) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Image is too large.",
            });
        }
        const imageName = `${session.user.staff?.id}_${Date.now()}`;
        const img = await uploadFile("design_category_items", image, imageName);
        const downloadUrl = await uploadFile(
            "design_category_items_file",
            downloadFile,
            imageName,
        );

        const desingItem = await Prisma?.design.create({
            data: {
                name: safeData.name,
                img: img,
                designCategoryId: safeData?.designCategoryId,
                downloadUrl,
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            message: "Product created successfully",
            data: desingItem,
        });
    } catch (error) {
        return serverResponse({
            status: 500,
            success: false,
            message: "Error while creating products.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
