import { NextResponse } from "next/server";
import { mockProducts } from "../../../lib/mock/products";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");

        if (categoryId) {
            return NextResponse.json(
                mockProducts[categoryId as keyof typeof mockProducts] || [],
            );
        }

        // If no categoryId is provided, return all products
        const allProducts = Object.values(mockProducts).flat();
        return NextResponse.json(allProducts);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching products", error },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { name, description, price, imageUrl, categoryId } =
            await req.json();

        if (!name || !description || !price || !imageUrl || !categoryId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 },
            );
        }

        // Mock response
        const newProduct = {
            id: `p${Date.now()}`,
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            categoryId,
            category: {
                name: "Mock Category", // In a real app, this would be the actual category name
            },
        };

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating product", error },
            { status: 500 },
        );
    }
}
