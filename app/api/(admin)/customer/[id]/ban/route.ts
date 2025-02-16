import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // TODO: AUTHENTICATION
        const { id } = await params;
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, error: "Customer not found" },
                { status: 404 },
            );
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: parseInt(id) },
            data: { isBanned: !customer.isBanned },
        });

        return NextResponse.json(
            {
                success: true,
                message: "customer ban status updated successfully.",
                data: updatedCustomer,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error toggling customer ban status:", error);
        return NextResponse.json(
            { error: "Failed to update customer ban status" },
            { status: 500 },
        );
    }
}
