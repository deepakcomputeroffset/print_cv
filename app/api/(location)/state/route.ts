import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const states = await prisma.state.findMany({
            include: { country: true, districts: true },
        });
        return NextResponse.json(states, { status: 200 });
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
        const { name, countryId } = await req.json();

        if (!name || !countryId) {
            return NextResponse.json(
                { error: "Name and countryId are required" },
                { status: 400 },
            );
        }

        const newState = await prisma.state.create({
            data: { name, countryId },
        });

        return NextResponse.json(newState, { status: 201 });
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
                { error: "id, name, and countryId are required" },
                { status: 400 },
            );
        }

        const updatedState = await prisma.state.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedState, { status: 200 });
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

        const deletedState = await prisma.state.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "State deleted successfully", deletedState },
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
