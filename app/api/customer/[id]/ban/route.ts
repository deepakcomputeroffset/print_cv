import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: parseInt(params.id) },
        });

        if (!customer) {
            return NextResponse.json(
                { success: false, error: "Customer not found" },
                { status: 404 },
            );
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: parseInt(params.id) },
            data: { is_Banned: !customer.is_Banned },
        });

        return NextResponse.json(updatedCustomer);
    } catch (error) {
        console.error("Error toggling customer ban status:", error);
        return NextResponse.json(
            { error: "Failed to update customer ban status" },
            { status: 500 },
        );
    }
}
