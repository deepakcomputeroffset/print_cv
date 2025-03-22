import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";
import { auth } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();
        if (!session) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }
        const { id } = await params;
        const customer = await Prisma.customer.findUnique({
            where: { id: parseInt(id) },
        });

        if (!customer) {
            return serverResponse({
                status: 404,
                success: false,
                message: "Customer not found.",
            });
        }

        const updatedCustomer = await Prisma.customer.update({
            where: { id: parseInt(id) },
            data: { isBanned: !customer.isBanned },
        });

        return serverResponse({
            status: 200,
            success: true,
            message: "customer ban status updated successfully.",
            data: updatedCustomer,
        });
    } catch (error) {
        console.error("Error toggling customer ban status:", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Failed to update customer.",
            error: error instanceof Error ? error.message : error,
        });
    }
}
