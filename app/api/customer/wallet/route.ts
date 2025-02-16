import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const wallet = await prisma?.wallet.findUnique({
            where: {
                id: session?.user?.customer?.wallet?.id,
            },
            select: {
                balance: true,
                id: true,
            },
        });

        return Response.json(wallet, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: "Unauthorized", error },
            { status: 500 },
        );
    }
}
