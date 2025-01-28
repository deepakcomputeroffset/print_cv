import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;
        console.log(id)
        const staff = await prisma.staff.findUnique({
            where: { id: parseInt(id) },
        });

        if (!staff) {
            return NextResponse.json(
                { success: false, error: "Customer not found" },
                { status: 404 },
            );
        }

        const updatedStaff = await prisma.staff.update({
            where: { id: parseInt(id) },
            data: { is_Banned: !staff.is_Banned },
        });

        return NextResponse.json(
            {
                success: true,
                message: "staff ban status updated successfully.",
                data: updatedStaff,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error toggling staff ban status:", error);
        return NextResponse.json(
            { error: "Failed to update staff ban status" },
            { status: 500 },
        );
    }
}
