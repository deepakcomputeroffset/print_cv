import { prisma } from "@/lib/prisma";
import { TRANSACTION_TYPE, STATUS } from "@prisma/client";

export async function placeOrder(
    customerId: number,
    productItemId: number,
    sku: string,
    qty: number,
    amount: number,
    fileUrl: string,
) {
    return await prisma.$transaction(async (tx) => {
        // Get customer wallet
        const wallet = await tx.wallet.findUnique({
            where: { customerId },
            include: { transactions: true },
        });

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        if (wallet.balance < amount) {
            throw new Error("Insufficient wallet balance");
        }

        // Deduct balance
        const updatedWallet = await tx.wallet.update({
            where: { id: wallet.id },
            data: {
                balance: { decrement: amount },
            },
        });

        // Create transaction record
        const transaction = await tx.transaction.create({
            data: {
                walletId: wallet.id,
                transationId: `TXN_${Date.now()}`,
                amount,
                type: TRANSACTION_TYPE.DEBIT,
                description: `Order Payment for Product Item ${sku}`,
            },
        });

        // Create order record
        const order = await tx.order.create({
            data: {
                customerId,
                productItemId,
                qty,
                amount,
                fileUrl,
                status: STATUS.PENDING, // Default status
            },
        });

        return { updatedWallet, transaction, order };
    });
}
