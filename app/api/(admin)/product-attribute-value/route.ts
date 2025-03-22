import { NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma";
import { ProductAttributeValueSchema } from "@/schemas/product.attribute.value.form.schema";

export async function GET(request: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(request.url);

        if (isNaN(parseInt(searchParams?.get("productAttributeId") || ""))) {
            return NextResponse.json(
                {
                    message: "invalid product attribute  id",
                    success: false,
                },
                { status: 400 },
            );
        }
        const productAttributeTypeValues =
            await Prisma.productAttributeValue.findMany({
                where: {
                    productAttributeTypeId: parseInt(
                        searchParams?.get("productAttributeId") || "",
                    ),
                },
            });

        return NextResponse.json(
            {
                data: productAttributeTypeValues,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching product attribute type values:", error);
        return NextResponse.json(
            { error: "Failed to fetch product attribute type values" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();
        const { success, data: safeData } =
            ProductAttributeValueSchema.safeParse(data);

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

        const productAttributeValue = await Prisma.productAttributeValue.create(
            {
                data: safeData,
            },
        );
        return NextResponse.json(
            {
                success: true,
                message: "product attribute type value created successfully",
                data: productAttributeValue,
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
