import { NextResponse } from "next/server";
import { productFormSchema } from "@/schemas/product-schema";
import { prisma } from "@/lib/prisma";
import { QuerySchema } from "@/schemas/query-schema";
import { stringToNumber } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { default_product_per_page } from "@/lib/constants";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));
        const { isNum, num } = stringToNumber(query?.search || "");

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
                              isNum
                                  ? {
                                        id: {
                                            gte: num,
                                        },
                                    }
                                  : {},
                          ],
                      }
                    : {},
                query?.category_id && query?.category_id !== "all"
                    ? {
                          category_id: parseInt(query?.category_id),
                      }
                    : {},
                query?.is_avialable && query?.is_avialable !== "all"
                    ? {
                          is_avialable: query?.status === "true",
                      }
                    : {},
                query?.min_price && query?.min_price != 0
                    ? {
                          min_price: {
                              gte: Number(query?.min_price),
                          },
                      }
                    : {},
                query?.max_price && query?.max_price != 0
                    ? {
                          max_price: {
                              gte: Number(query?.max_price),
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
                    product_items: true,
                    category: true,
                },
                orderBy: {
                    [query?.sortby ?? "id"]: query?.sortorder || "asc",
                },
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || default_product_per_page)
                    : 0,
                take: query.perpage || default_product_per_page,
            }),
        ]);

        return NextResponse.json({ data: products, total }, { status: 200 });
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
            data: safeDate,
            error,
        } = productFormSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(error, { status: 400 });
        }

        const newProduct = await prisma?.product.create({
            data: {
                name: safeDate.name,
                description: safeDate.description,
                image_url: safeDate.image_url,
                category_id: parseInt(safeDate.product_category_id, 10), // Convert to integer
                is_avialable: safeDate.is_avialable,
                sku: safeDate.sku,
                min_qty: safeDate.min_qty,
                og_price: safeDate.og_price,
                min_price: safeDate.min_price,
                avg_price: safeDate.avg_price,
                max_price: safeDate.max_price,
                product_items: {
                    create: safeDate.product_items.map((item) => ({
                        sku: item.sku,
                        min_qty: item.min_qty,
                        og_price: item.og_price,
                        min_price: item.min_price,
                        avg_price: item.avg_price,
                        max_price: item.max_price,
                        image_url: item.image_url,
                        is_avialable: item.is_avialable,
                        product_attribute_options: {
                            connect: item.product_attribute_options.map(
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
