import { productFormSchema } from "@/schemas/product.form.schema";
import { Prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma as PrismaType, ROLE } from "@prisma/client";
import {
    allowedRoleForCategoryAndProductManagement,
    defaultProductPerPage,
} from "@/lib/constants";
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

        const where: PrismaType.productWhereInput = {
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
                                  sku: {
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
                query?.categoryId && query?.categoryId !== "all"
                    ? {
                          categoryId: parseInt(query?.categoryId),
                      }
                    : {},
                query?.isAvailable && query?.isAvailable !== "all"
                    ? {
                          isAvailable: query?.status === "true",
                      }
                    : {},
                // query?.minPrice && Number(query?.minPrice) != 0
                //     ? {
                //           price: {
                //               gte: Number(query?.minPrice),
                //           },
                //       }
                //     : {},
                // query?.maxPrice && Number(query?.maxPrice) != 0
                //     ? {
                //           price: {
                //               lte: Number(query?.maxPrice),
                //           },
                //       }
                //     : {},
            ],
        };

        const [total, products] = await Prisma.$transaction([
            Prisma.product.count({ where }),
            Prisma.product.findMany({
                where,
                include: {
                    productItems: { include: { pricing: true } },
                    category: true,
                },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder ?? "asc",
                },
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || defaultProductPerPage)
                    : 0,
                take: query.perpage || defaultProductPerPage,
            }),
        ]);

        return serverResponse({
            status: 200,
            success: false,
            data: {
                data: products,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultProductPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultProductPerPage),
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

        const data = await req.json();

        const {
            success,
            data: safeData,
            error,
        } = productFormSchema.safeParse(data);

        if (!success) {
            return serverResponse({
                status: 400,
                success: false,
                message: "Invalid data",
                error: error.issues,
            });
        }

        const isSkuExit = await Prisma.product.findUnique({
            where: {
                sku: safeData.sku,
            },
        });

        if (isSkuExit) {
            return serverResponse({
                status: 400,
                success: false,
                message: "SKU already exists",
            });
        }

        const newProduct = await Prisma?.product.create({
            data: {
                name: safeData.name,
                description: safeData.description,
                imageUrl: safeData.imageUrl,
                categoryId: parseInt(safeData.categoryId, 10), // Convert to integer
                isAvailable: safeData.isAvailable,
                isTieredPricing: safeData.isTieredPricing,
                sku: safeData.sku,
                productItems: {
                    create: safeData.productItems.map((item) => ({
                        sku: item.sku,
                        isAvailable: item.isAvailable,
                        uploadGroupId: item.uploadGroupId,
                        pricing: {
                            create: item.pricing.map((qp) => ({
                                qty: qp.qty,
                                price: qp.price,
                            })),
                        },
                        productAttributeOptions: {
                            connect: item.productAttributeOptions.map(
                                (option) => ({
                                    id: option.id, // Connect using the existing ID
                                }),
                            ),
                        },
                    })),
                },
            },
        });

        return serverResponse({
            status: 201,
            success: true,
            message: "Product created successfully",
            data: newProduct,
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
