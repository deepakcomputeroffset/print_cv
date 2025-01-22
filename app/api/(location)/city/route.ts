import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const districts = await prisma.district.findMany({
            include: { state: true },
        });
        return NextResponse.json(districts, { status: 200 });
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

        const newDistrict = await prisma.district.create({
            data: { name, stateId },
        });

        return NextResponse.json(newDistrict, { status: 201 });
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

        const updatedDistrict = await prisma.district.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedDistrict, { status: 200 });
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

        const deletedDistrict = await prisma.district.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "District deleted successfully", deletedDistrict },
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
