import { NextResponse } from "next/server";
import { productFormSchema } from "@/schemas/product.form.schema";
import { prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query.param.schema";
import { Prisma } from "@prisma/client";
import { defaultProductPerPage } from "@/lib/constants";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: Prisma.productWhereInput = {
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
                query?.minPrice && query?.minPrice != 0
                    ? {
                          minPrice: {
                              gte: Number(query?.minPrice),
                          },
                      }
                    : {},
                query?.maxPrice && query?.maxPrice != 0
                    ? {
                          maxPrice: {
                              gte: Number(query?.maxPrice),
                          },
                      }
                    : {},
            ],
        };

        const [total, products] = await prisma.$transaction([
            prisma.product.count({ where }),
            prisma.product.findMany({
                where,
                include: {
                    productItems: true,
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

        return NextResponse.json(
            {
                data: products,
                total,
                page: query.page || 1,
                perpage: query.perpage || defaultProductPerPage,
                totalPages: Math.ceil(
                    total / (query.perpage || defaultProductPerPage),
                ),
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching products", error },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // TODO: Authentication
        const data = await req.json();

        const {
            success,
            data: safeData,
            error,
        } = productFormSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(error, { status: 400 });
        }

        const newProduct = await prisma?.product.create({
            data: {
                name: safeData.name,
                description: safeData.description,
                imageUrl: safeData.imageUrl,
                categoryId: parseInt(safeData.categoryId, 10), // Convert to integer
                isAvailable: safeData.isAvailable,
                sku: safeData.sku,
                minQty: safeData.minQty,
                ogPrice: safeData.ogPrice,
                minPrice: safeData.minPrice,
                avgPrice: safeData.avgPrice,
                maxPrice: safeData.maxPrice,
                productItems: {
                    create: safeData.productItems.map((item) => ({
                        sku: item.sku,
                        minQty: item.minQty,
                        ogPrice: item.ogPrice,
                        minPrice: item.minPrice,
                        avgPrice: item.avgPrice,
                        maxPrice: item.maxPrice,
                        imageUrl: item.imageUrl,
                        isAvailable: item.isAvailable,
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
        return NextResponse.json(
            { data: newProduct, success: true },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error creating product", error },
            { status: 500 },
        );
    }
}
