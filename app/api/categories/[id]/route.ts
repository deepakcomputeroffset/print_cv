import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stringToNumber } from "@/lib/utils";

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { isNum, num: pcid } = stringToNumber(params.id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_categoryId" },
                { status: 400 },
            );
        }
        const category = await prisma.product_category.findUnique({
            where: { id: pcid },
            include: {
                products: true,
            },
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching category", error },
            { status: 500 },
        );
    }
}

export async function PUT(
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

        const { name, description, image_url } = await req.json();

        const { isNum, num: pcid } = stringToNumber(params.id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_categoryId" },
                { status: 400 },
            );
        }
        const category = await prisma.product_category.update({
            where: { id: pcid },
            data: {
                name,
                description,
                image_url,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error updating category" },
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
        const { isNum, num: pcid } = stringToNumber(params.id);
        if (!isNum) {
            return NextResponse.json(
                { message: "Invalid product_categoryId" },
                { status: 400 },
            );
        }
        await prisma.product_category.delete({
            where: { id: pcid },
        });

        return NextResponse.json(
            { message: "Category deleted successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error deleting category" },
            { status: 500 },
        );
    }
}
