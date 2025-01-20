import { NextResponse } from "next/server";
import { stringToNumber } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parent_categoryId = searchParams.get("parent_categoryId");

        if (parent_categoryId) {
            const { isNum, num: pid } = stringToNumber(parent_categoryId);
            if (!isNum) {
                return NextResponse.json(
                    { message: "Invalid parent_categoryId" },
                    { status: 400 },
                );
            }

            const categories = await prisma?.product_category.findMany({
                where: {
                    parent_categoryId: pid,
                },
            });

            return NextResponse.json(categories);
        }

        const categories = await prisma?.product_category.findMany({
            where: {
                parent_categoryId: null,
            },
            orderBy: {
                id: "asc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "Error fetching categories",
                error: (error as { message: string })?.message,
            },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        // const session = await auth();

        // if (session?.user?.role !== "ADMIN") {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }

        const { name, description, imageUrl, parent_categoryId } =
            await req.json();

        if (!name || !description || !imageUrl) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 },
            );
        }

        const newCategory = await prisma?.product_category.create({
            data: {
                name,
                description,
                imageUrl,
                parent_categoryId: parent_categoryId || null,
            },
        });
        console.log(newCategory);
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "Error creating category",
                error: (error as { message: string })?.message,
            },
            { status: 500 },
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "Missing category ID" },
                { status: 400 },
            );
        }

        const category = await prisma?.product_category.delete({
            where: {
                id,
            },
        });
        return NextResponse.json({ message: "Category deleted", category });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error deleting category",
                error: (error as { meta: string })?.meta || error,
            },
            { status: 500 },
        );
    }
}
