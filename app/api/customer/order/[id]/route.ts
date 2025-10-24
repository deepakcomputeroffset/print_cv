import serverResponse from "@/lib/serverResponse";
import { Prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFiles } from "@/lib/storage";
import { TRANSACTION_TYPE } from "@prisma/client";
import { Prisma as PrismaType } from "@prisma/client";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await auth();

        if (
            session?.user?.userType != "customer" ||
            session?.user?.customer?.isBanned ||
            !session?.user?.customer
        ) {
            return serverResponse({
                status: 401,
                success: false,
                error: "Unauthorized",
            });
        }

        const { id } = await params;
        const orderId = parseInt(id);

        if (!id || isNaN(orderId)) {
            return serverResponse({
                status: 400,
                success: false,
                error: "Order ID is required.",
            });
        }

        const customerId = session.user.customer.id;

        // Single query with all needed data
        const order = await Prisma.order.findFirst({
            where: {
                id: orderId,
                customerId,
                status: "PLACED", // Check status here
            },
            select: {
                id: true,
                total: true,
                status: true,
                attachment: {
                    select: { url: true },
                },
            },
        });

        if (!order) {
            return serverResponse({
                status: 404,
                success: false,
                error: "Order not found or cannot be cancelled!",
            });
        }

        const attachmentUrls = order.attachment?.map((at) => at.url) || [];

        // Perform transaction with all database operations
        await Prisma.$transaction(
            async (tx) => {
                // Lock wallet and get balance in one query
                const wallets = await tx.$queryRaw<
                    { id: number; balance: number }[]
                >`
                    SELECT id, balance
                    FROM wallet
                    WHERE "customerId" = ${customerId}
                    FOR UPDATE
                    LIMIT 1
                `;

                if (!wallets.length) {
                    throw new Error("Wallet not found");
                }

                const wallet = wallets[0];

                // Update order status (inside transaction)
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: "CANCELLED" },
                });

                // Update wallet and create transaction in parallel
                await Promise.all([
                    tx.wallet.update({
                        where: { id: wallet.id },
                        data: {
                            balance: { increment: order.total },
                        },
                    }),
                    tx.transaction.create({
                        data: {
                            walletId: wallet.id,
                            amount: order.total,
                            type: TRANSACTION_TYPE.CREDIT,
                            description: `Refund for order id: ${orderId}`,
                            createBy: customerId,
                        },
                    }),
                ]);
            },
            {
                maxWait: 5000,
                timeout: 10000,
                isolationLevel:
                    PrismaType.TransactionIsolationLevel.ReadCommitted,
            },
        );

        // Delete files asynchronously (don't block response)
        if (attachmentUrls.length > 0) {
            deleteFiles(attachmentUrls).catch((error) =>
                console.error("File deletion failed:", error),
            );
        }

        return serverResponse({
            status: 200,
            success: true,
            message: "Order cancelled successfully.",
        });
    } catch (error) {
        console.error(error);
        return serverResponse({
            status: 500,
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
}
