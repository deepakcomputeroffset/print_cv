import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringToNumber } from "@/lib/utils";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const { isNum, num } = stringToNumber(searchParams.get("c_id") || "");
        const c_id = isNum ? num : 1;

        const states = await prisma.state.findMany({
            where: {
                country_id: c_id || 1,
            },
            select: {
                id: true,
                cities: true,
                country_id: true,
                name: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: states,
            },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
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
            data: { name, country_id: Number(countryId) },
        });

        return NextResponse.json(
            { success: true, data: newState },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
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
                {
                    success: false,
                    error: "id, name, and countryId are required",
                },
                { status: 400 },
            );
        }

        const updatedState = await prisma.state.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(
            { success: true, data: updatedState },
            { status: 200 },
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
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
