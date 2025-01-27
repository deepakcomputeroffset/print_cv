import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { stringToNumber } from "@/lib/utils";
import { QuerySchema } from "@/schemas/query-schema";
import {
    default_product_category_per_page,
    max_image_size,
} from "@/lib/constants";
import { productCategorySchema } from "@/schemas/product-category-schema";
import { calculateBase64Size, UPLOAD_TO_CLOUDINARY } from "@/lib/cloudinary";

export async function GET(request: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));
        const { isNum, num } = stringToNumber(query?.search || "");

        const where: Prisma.product_categoryWhereInput = {
            parent_category_id: null,
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
            ],
        };

        const [total, product_categories] = await prisma.$transaction([
            prisma.product_category.count({ where }),
            prisma.product_category.findMany({
                where,
                include: {
                    sub_categories: {
                        include: {
                            sub_categories: true,
                        },
                    },
                },
                orderBy: query?.sortby
                    ? {
                          [query?.sortby || "id"]: query?.sortorder || "asc",
                      }
                    : undefined,
                skip: query.page
                    ? (query.page - 1) *
                      (query.perpage || default_product_category_per_page)
                    : 0,
                take: query.perpage || default_product_category_per_page,
            }),
        ]);

        return NextResponse.json({
            data: product_categories,
            total,
            page: query.page || 1,
            perpage: query.perpage || default_product_category_per_page,
            totalPages: Math.ceil(
                total / (query.perpage || default_product_category_per_page),
            ),
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();
        const safeData = productCategorySchema?.parse(data);

        // Check if productCategory already exists
        const existingProductCategory = await prisma.product_category.findFirst(
            {
                where: { name: safeData?.name },
            },
        );

        if (existingProductCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "productCategory already exist with this phone number",
                },
                { status: 400 },
            );
        }

        if (calculateBase64Size(safeData.image_url) > max_image_size) {
            return Response.json(
                {
                    message: "Image is too large.",
                    success: false,
                },
                {
                    status: 400,
                },
            );
        }
        const results = await UPLOAD_TO_CLOUDINARY(
            safeData.image_url,
            "category",
        );

        // Create productCategory
        const productCategory = await prisma.product_category.create({
            data: { ...safeData, image_url: results?.secure_url },
        });

        return NextResponse.json(
            {
                success: true,
                message: "product category created successfully",
                data: productCategory,
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
