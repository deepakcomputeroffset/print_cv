import { Prisma } from "@/lib/prisma";
import { TRANSACTION_TYPE, STATUS, UPLOADVIA } from "@prisma/client";
import { FILE_UPLOAD_EMAIL_CHARGE, IGST_TAX_IN_PERCENTAGE } from "./constants";

export async function placeOrder(
    customerId: number,
    productItemId: number,
    sku: string,
    qty: number,
    minQty: number,
    price: number,
    uploadType: UPLOADVIA,
    fileUrls?: string[],
) {
    return await Prisma.$transaction(
        async (tx) => {
            const totalProductPrice = (price * Math.max(qty, minQty)) / minQty;

            const charge = totalProductPrice * IGST_TAX_IN_PERCENTAGE;
            const uploadCharge =
                uploadType === "EMAIL" ? FILE_UPLOAD_EMAIL_CHARGE : 0;

            const totalPrice = totalProductPrice + charge + uploadCharge;

            // Get customer wallet
            const wallet = await tx.wallet.findUnique({
                where: { customerId },
                include: { transactions: true },
            });

            if (!wallet) {
                throw new Error("Wallet not found");
            }

            if (wallet.balance < totalPrice) {
                throw new Error("Insufficient wallet balance");
            }

            // Deduct balance
            const updatedWallet = await tx.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: { decrement: totalPrice },
                },
            });

            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount: totalPrice,
                    type: TRANSACTION_TYPE.DEBIT,
                    description: `Order Payment for Product Item ${sku}`,
                    createBy: customerId,
                },
            });

            // Create order record
            const order = await tx.order.create({
                data: {
                    customerId,
                    productItemId,
                    qty,
                    igst: IGST_TAX_IN_PERCENTAGE,
                    price: totalProductPrice,
                    uploadCharge: uploadCharge,
                    total: totalPrice,
                    status: STATUS.PENDING, // Default status
                },
            });

            const file = await tx.attachment.create({
                data: {
                    uploadVia: uploadType,
                    orderId: order.id,
                    urls: fileUrls,
                },
            });

            return { updatedWallet, transaction, order, file };
        },
        { timeout: 60000 },
    );
}
