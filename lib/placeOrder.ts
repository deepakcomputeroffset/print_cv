import { Prisma } from "@/lib/prisma";
import { TRANSACTION_TYPE, STATUS, UPLOADVIA } from "@prisma/client";
import { FILE_UPLOAD_EMAIL_CHARGE, IGST_TAX_IN_PERCENTAGE } from "./constants";
import { Prisma as PP } from "@prisma/client";

export async function placeOrder(
    customerId: number,
    productItemId: number,
    sku: string,
    qty: number,
    basePrice: number,
    uploadVia: UPLOADVIA,
) {
    // Validate inputs early
    if (
        !basePrice ||
        basePrice <= 0 ||
        !customerId ||
        !productItemId ||
        !sku ||
        !uploadVia
    ) {
        throw new Error(
            "Bad order request: Missing or invalid required parameters",
        );
    }

    if (qty <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    // Calculate charges
    const uploadCharge = uploadVia === "EMAIL" ? FILE_UPLOAD_EMAIL_CHARGE : 0;
    const igstAmount = (basePrice + uploadCharge) * IGST_TAX_IN_PERCENTAGE;
    const totalPrice = basePrice + igstAmount + uploadCharge;

    return await Prisma.$transaction(
        async (tx) => {
            // Get customer wallet with locking using raw SQL
            const wallets = await tx.$queryRaw<
                { id: number; balance: number }[]
            >`
                SELECT id, balance 
                FROM wallet 
                WHERE "customerId" = ${customerId}
                FOR UPDATE SKIP LOCKED
                LIMIT 1
            `;

            const wallet = wallets[0] || null;

            if (!wallet) {
                // Check if wallet exists but is locked
                const existingWallet = await tx.wallet.findFirst({
                    where: { customerId },
                    select: { id: true },
                });

                if (existingWallet) {
                    throw new Error(
                        "Wallet is currently locked by another transaction",
                    );
                } else {
                    throw new Error("Wallet not found");
                }
            }

            if (wallet.balance < totalPrice) {
                throw new Error(
                    `Insufficient wallet balance. Required: ${totalPrice.toFixed(2)}, Available: ${wallet.balance.toFixed(2)}`,
                );
            }

            // Update wallet balance
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: totalPrice },
                },
                select: { id: true, balance: true },
            });

            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: totalPrice,
                    type: TRANSACTION_TYPE.DEBIT,
                    description: `Order Payment for Product: ${sku}, Qty: ${qty}`,
                    createBy: customerId,
                },
                select: { id: true },
            });

            // Create order record
            const order = await tx.order.create({
                data: {
                    customerId,
                    productItemId,
                    qty,
                    igst: IGST_TAX_IN_PERCENTAGE,
                    price: basePrice,
                    uploadCharge,
                    total: totalPrice,
                    status: STATUS.PLACED,
                    uploadFilesVia: uploadVia,
                },
                include: {
                    productItem: {
                        select: {
                            sku: true,
                            product: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            return { updatedWallet, transaction, order };
        },
        {
            maxWait: 10000, // Maximum time to wait for transaction
            timeout: 30000, // Transaction timeout
            isolationLevel: PP.TransactionIsolationLevel.Serializable, // Recommended for financial transactions
        },
    );
}
