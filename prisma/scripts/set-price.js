import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const product = await prisma.productItem.updateMany({
        where: {
            productId: 57,
            AND: [
                {
                    productAttributeOptions: {
                        some: { productAttributeValue: "Large" },
                    },
                },
                {
                    productAttributeOptions: {
                        some: {
                            productAttributeValue: "Both Side",
                        },
                    },
                },
            ],
        },
        data: {
            price: 1479,
            ogPrice: 1479,
            minQty: 2000,
            isAvailable: true,
        },
    });

    console.log(JSON.stringify(product));

    console.log(product, product.length);
}

main()
    .catch((e) => {
        console.error("Error resetting sequence:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
