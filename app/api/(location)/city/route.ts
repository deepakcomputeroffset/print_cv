import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const Cities = await prisma.city.findMany({
            include: { state: true },
        });
        return NextResponse.json(Cities, { status: 200 });
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
        const { name, stateId } = await req.json();

        if (!name || !stateId) {
            return NextResponse.json(
                { error: "Name and stateId are required" },
                { status: 400 },
            );
        }

        const newCity = await prisma.city.create({
            data: { name, stateId: stateId },
        });

        return NextResponse.json(newCity, { status: 201 });
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
                { error: "id, name, and stateId are required" },
                { status: 400 },
            );
        }

        const updatedCity = await prisma.city.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedCity, { status: 200 });
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

        const deletedCity = await prisma.city.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "City deleted successfully", deletedCity },
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
