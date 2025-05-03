import { Prisma } from "@/lib/prisma";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import {
    allowedRoleForCategoryAndProductManagement,
    defaultProductCategoryPerPage,
    maxImageSize,
} from "@/lib/constants";
import { getProductCategorySchema } from "@/schemas/product.category.form.schema";
import { auth } from "@/lib/auth";
import serverResponse from "@/lib/serverResponse";
import { parseFormData } from "@/lib/formData";
import { uploadFile } from "@/lib/storage";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: PrismaType.productCategoryWhereInput = {
            parentCategoryId: Number(query?.categoryId) ?? null,
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
                                            gte: parseInt(query?.search),
                                        },
                                    }
                                  : {},
                          ],
                      }
                    : {},
            ],
        };

        const [total, product_categories] = await Prisma.$transaction([
            Prisma.productCategory.count({ where }),
            Prisma.productCategory.findMany({
                where,
                include: {
                    subCategories: {
                        include: {
                            subCategories: true,
                        },
                    },
                },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || defaultProductCategoryPerPage)
                    : 0,
                take: query.perpage || defaultProductCategoryPerPage,
            }),
        ]);

        return serverResponse({
            status: 200,
            success: true,
            message: "Product Category fetched successfully",
            data: {
                data: product_categories,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultProductCategoryPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultProductCategoryPerPage),
                ),
            },
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error?.message : error,
            message: "Internal Error",
        });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType != "staff" ||
            !allowedRoleForCategoryAndProductManagement.includes(
                session.user.staff?.role as ROLE,
            ) ||
            (session.user.staff?.role !== "ADMIN" &&
                session.user.staff?.isBanned)
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const data = await req.formData();
        const safeData = parseFormData(data, getProductCategorySchema());

        if (!safeData.success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid Data",
                error: safeData.error.issues,
            });
        }
        // Check if productCategory already exists
        const existingProductCategory = await Prisma.productCategory.findFirst({
            where: { name: safeData?.data?.name },
        });

        if (existingProductCategory) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Product category already exist with this name",
            });
        }

        const image = data.get("image");

        if (!image || typeof image !== "object" || !("size" in image)) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid image file.",
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
        const imageUrl = await uploadFile("images", image, imageName);

        const parentCategoryId = safeData.data.parentCategoryId
            ? Number(safeData.data.parentCategoryId)
            : null;

        // Create productCategory
        const productCategory = await Prisma.productCategory.create({
            data: {
                name: safeData.data.name,
                description: safeData.data.description,
                imageUrl,
                parentCategoryId: parentCategoryId,
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            message: "Product category created successfully.",
            data: productCategory,
        });
    } catch (error) {
        console.error("Registration error:", `${error}`);

        return serverResponse({
            status: 500,
            success: false,
            error: error instanceof Error ? error.message : error,
            message: "Internal Error",
        });
    }
}
