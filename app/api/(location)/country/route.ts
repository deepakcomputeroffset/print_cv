import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure the correct path for Prisma import

export async function GET() {
    try {
        const countries = await prisma.country.findMany({
            include: { states: true },
        });
        return NextResponse.json(countries, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    (error as { message: string })?.message ||
                    "An unexpected error occurred",
            },
            { status: 500 },
        );
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 },
            );
        }

        const newCountry = await prisma.country.create({
            data: { name },
        });

        return NextResponse.json(newCountry, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    (error as { message: string })?.message ||
                    "An unexpected error occurred",
            },
            { status: 500 },
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { id, name } = await req.json();

        if (!id || !name) {
            return NextResponse.json(
                { error: "Both id and name are required" },
                { status: 400 },
            );
        }

        const updatedCountry = await prisma.country.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedCountry, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    (error as { message: string })?.message ||
                    "An unexpected error occurred",
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
                { error: "ID is required to delete" },
                { status: 400 },
            );
        }

        const deletedCountry = await prisma.country.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Country deleted successfully", deletedCountry },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    (error as { message: string })?.message ||
                    "An unexpected error occurred",
            },
            { status: 500 },
        );
    }
}
