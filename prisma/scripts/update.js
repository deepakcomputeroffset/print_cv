import { Prisma } from "./conn.js";

async function updatePrice(qty, price) {
    const dd = await Prisma.pricing.updateMany({
        where: {
            qty: qty,
            productItem: {
                productId: 14,
                productAttributeOptions: {
                    some: {
                        productAttributeValue: "Large",
                    },
                },
            },
        },
        data: {
            price: price,
        },
    });

    console.log(dd);
}

await updatePrice(2000, 780);
await updatePrice(4000, 1416);
await updatePrice(6000, 2014);
await updatePrice(8000, 2572);
await updatePrice(10000, 3090);
