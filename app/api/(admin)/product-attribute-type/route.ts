import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringToNumber } from "@/lib/utils";
import { ProductAttributeTypeSchema } from "@/schemas/product.attribute.type.form.schema";

export async function GET(request: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(request.url);

        const { isNum, num: id } = stringToNumber(
            searchParams?.get("productCategoryId") || "",
        );

        if (!isNum) {
            return NextResponse.json(
                {
                    message: "invalid product category id",
                    success: false,
                },
                { status: 400 },
            );
        }
        const productAttributeTypes =
            await prisma.productAttributeType.findMany({
                where: {
                    productCategoryId: id,
                },
            });

        return NextResponse.json(
            {
                data: productAttributeTypes,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching product attribute type:", error);
        return NextResponse.json(
            { error: "Failed to fetch product attribute type" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();

        const { success, data: safeData } =
            ProductAttributeTypeSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product attribute type data",
                },
                {
                    status: 400,
                },
            );
        }

        const createdProduct_attribute =
            await prisma.productAttributeType.create({
                data: safeData,
            });
        return NextResponse.json(
            {
                success: true,
                message: "product attribute type created successfully",
                data: createdProduct_attribute,
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
