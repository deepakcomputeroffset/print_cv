import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stringToNumber } from "@/lib/utils";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { isNum, num: pid } = stringToNumber(params.id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_categoryId" },
                { status: 400 },
            );
        }
        const product = await prisma.product.findUnique({
            where: { id: pid },
            include: {
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching product", error },
            { status: 500 },
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await auth();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { name, description, imageUrl, categoryId } = await req.json();
        const { isNum, num: pid } = stringToNumber(params.id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_categoryId" },
                { status: 400 },
            );
        }
        const product = await prisma.product.update({
            where: { id: pid },
            data: {
                name,
                description,
                // price: parseFloat(price),
                imageUrl,
                categoryId,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error updating product" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const session = await auth();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }
        const { isNum, num: pid } = stringToNumber(params.id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_categoryId" },
                { status: 400 },
            );
        }
        await prisma.product.delete({
            where: { id: pid },
        });

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting product", error },
            { status: 500 },
        );
    }
}
