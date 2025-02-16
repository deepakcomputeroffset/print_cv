import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { QuerySchema } from "@/schemas/query.param.schema";
import { defaultProductCategoryPerPage, maxImageSize } from "@/lib/constants";
import { productCategorySchema } from "@/schemas/product.category.form.schema";
import { calculateBase64Size, UPLOAD_TO_CLOUDINARY } from "@/lib/cloudinary";

export async function GET(request: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(request.url);
        const query = QuerySchema.parse(Object.fromEntries(searchParams));

        const where: Prisma.productCategoryWhereInput = {
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

        const [total, product_categories] = await prisma.$transaction([
            prisma.productCategory.count({ where }),
            prisma.productCategory.findMany({
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

        return NextResponse.json({
            data: product_categories,
            total,
            page: query.page || 1,
            perpage: query.perpage || defaultProductCategoryPerPage,
            totalPages: Math.ceil(
                total / (query.perpage || defaultProductCategoryPerPage),
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
        const existingProductCategory = await prisma.productCategory.findFirst({
            where: { name: safeData?.name },
        });

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

        if (calculateBase64Size(safeData.imageUrl) > maxImageSize) {
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
            safeData.imageUrl,
            "category",
        );

        // Create productCategory
        const productCategory = await prisma.productCategory.create({
            data: { ...safeData, imageUrl: results?.secure_url },
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
