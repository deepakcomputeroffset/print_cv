import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { staffFormSchema } from "@/lib/schema/staff-schema";
import { generateHash } from "@/lib/hash";
import { stringToNumber } from "@/lib/utils";
import { per_page_data } from "@/lib/constants";

export async function POST(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();

        const { success, data: safeData } = staffFormSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid staff data",
                },
                {
                    status: 400,
                },
            );
        }

        const isExit = await prisma.staff.findUnique({
            where: {
                phone: safeData.phone,
            },
        });

        if (isExit) {
            return NextResponse.json(
                {
                    success: false,
                    message: "staff already added with this phone number.",
                },
                { status: 401 },
            );
        }

        const createdStaff = await prisma.staff.create({
            data: {
                ...safeData,
                password: await generateHash(safeData.password),
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "staff added.",
                data: createdStaff,
            },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status: 500 },
        );
    }
}

export async function GET(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const { isNum: isId, num: id } = stringToNumber(
            searchParams.get("id") || "",
        );
        const { isNum, num } = stringToNumber(searchParams?.get("page") || "1");
        const page = isNum ? num : 1;
        if (!type) {
            const data = await prisma?.staff.findMany({
                where: isId ? { id } : {},
                select: {
                    name: true,
                    _count: true,
                    email: true,
                    phone: true,
                    id: true,
                    role: true,
                    createdAt: true,
                    password: true,
                },
                orderBy: {
                    id: "asc",
                },
                take: page === -1 ? undefined : per_page_data,
                skip: page === -1 ? 0 : per_page_data * (page - 1),
            });

            const total = await prisma?.staff?.count({
                where: isId ? { id } : {},
            });
            return NextResponse.json(
                {
                    status: true,
                    data,
                    total,
                },
                {
                    status: 200,
                },
            );
        }
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();

        const { success, data: safeData } = staffFormSchema.safeParse(data);
        console.log(data);
        if (!success || !data?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid staff data",
                },
                {
                    status: 400,
                },
            );
        }

        const isExit = await prisma.staff.findUnique({
            where: { id: data?.id },
        });

        if (!isExit) {
            return NextResponse.json(
                {
                    success: false,
                    message: "staff don't exist",
                },
                { status: 401 },
            );
        }
        const isPasswordChanged = isExit.password !== safeData?.password;
        const updatedStaff = await prisma.staff.update({
            where: {
                id: data?.id,
            },
            data: !isPasswordChanged
                ? safeData
                : {
                      ...safeData,
                      password: await generateHash(safeData?.password),
                  },
        });

        return NextResponse.json(
            {
                success: true,
                message: "staff upadated.",
                data: updatedStaff,
            },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status: 500 },
        );
    }
}

export async function DELETE(req: Request) {
    try {
        // TODO: AUTHENTICATION
        const data = await req.json();

        if (!data?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid staff data",
                },
                {
                    status: 400,
                },
            );
        }

        const isExit = await prisma.staff.findUnique({
            where: { id: data?.id },
        });

        if (!isExit) {
            return NextResponse.json(
                {
                    success: false,
                    message: "staff don't exist",
                },
                { status: 401 },
            );
        }
        const deletedStaff = await prisma.staff.delete({
            where: {
                id: data?.id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "staff deleted.",
                data: deletedStaff,
            },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                error,
            },
            { status: 500 },
        );
    }
}
