import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { staffFormSchema } from "@/schemas/staff.form.schema";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;
        const staff = await prisma.staff.findUnique({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return NextResponse.json(
                { success: false, error: "Staff not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: staff },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json(
            { error: "Failed to fetch staff" },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const staff = await prisma.staff.findUnique({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return NextResponse.json(
                {
                    success: false,
                    message: "staff not found",
                },
                { status: 404 },
            );
        }

        const body = await request.json();
        const validatedData = staffFormSchema.partial().parse(body);

        // eslint-disable-next-line
        type NestedObject<T = any> = {
            [key: string]: T | NestedObject<T>;
        };
        const updateData: NestedObject = {};
        if (validatedData?.name) updateData.name = validatedData.name;
        if (validatedData.email) updateData.email = validatedData.email;
        if (validatedData.phone) updateData.phone = validatedData.phone;
        if (validatedData.role) updateData.role = validatedData.role;
        if (validatedData.password)
            updateData.password = validatedData.password;

        // if (
        //     validatedData.line ||
        //     validatedData.pin_code ||
        //     validatedData.city ||
        //     validatedData.state ||
        //     validatedData.country
        // ) {
        //     updateData.address = {
        //         update: {},
        //     };

        //     if (validatedData.line)
        //         updateData.address.update.line = validatedData.line;
        //     if (validatedData.pin_code)
        //         updateData.address.update.pin_code = validatedData.pin_code;

        //     if (validatedData?.city) {
        //         updateData.address.update.city = {
        //             connect: { id: parseInt(validatedData.city) }, // Linking to an existing city
        //         };
        //     }

        //     if (validatedData?.state) {
        //         updateData.address.update.city = {
        //             update: {
        //                 state: {
        //                     connect: { id: parseInt(validatedData.state) }, // Linking to an existing state
        //                 },
        //             },
        //         };
        //     }

        //     if (validatedData?.country) {
        //         updateData.address.update.city = {
        //             update: {
        //                 state: {
        //                     update: {
        //                         country: {
        //                             connect: {
        //                                 id: parseInt(validatedData.country),
        //                             }, // Linking to an existing country
        //                         },
        //                     },
        //                 },
        //             },
        //         };
        //     }
        // }

        const upadatedStaff = await prisma.staff.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        return NextResponse.json(
            {
                success: true,
                message: "staff updated successfully",
                data: upadatedStaff,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating staff:", error);
        return NextResponse.json(
            { error: "Failed to update staff" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;

        const staff = await prisma.staff.delete({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return NextResponse.json(
                {
                    success: false,
                    message: "staff not found",
                },
                { status: 404 },
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting staff:", `${error}`);
        return NextResponse.json(
            { error: "Failed to delete staff" },
            { status: 500 },
        );
    }
}
