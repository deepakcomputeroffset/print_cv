import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/prisma";
import serverResponse from "@/lib/serverResponse";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }

        const wallet = await Prisma?.wallet.findUnique({
            where: {
                id: session?.user?.customer?.wallet?.id,
            },
            select: {
                balance: true,
                id: true,
            },
        });

        return serverResponse({
            status: 200,
            success: true,
            data: { id: wallet?.id, balance: wallet?.balance },
            message: "wallet fetched successfully.",
        });
    } catch (error) {
        return serverResponse({
            error: error,
            status: 500,
            success: false,
        });
    }
}
