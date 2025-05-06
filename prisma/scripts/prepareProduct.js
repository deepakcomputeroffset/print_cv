import path from "path";
import fs from "fs/promises";

export async function PrepareProduct() {
    try {
        const filePath = path.join(
            process.cwd(),
            "prisma",
            "data",
            "products.json",
        );

        const fileData = await fs.readFile(filePath, "utf8");
        const categories = JSON.parse(fileData);

        const data = [];
        for (const category of categories) {
            const temp = {
                ...category,
            };
            temp.price = category.minPrice;
            delete temp.minPrice;
            delete temp.avgPrice;
            delete temp.maxPrice;
            delete temp.category;

            const productItems = [];
            for (const productItem of category.productItems) {
                const temp2 = { ...productItem };
                temp2.price = productItem.minPrice;
                delete temp2.minPrice;
                delete temp2.avgPrice;
                delete temp2.maxPrice;
                console.log(temp2);
                productItems.push(temp2);
            }
            temp.productItems = productItems;
            data.push(temp);
        }

        fs.writeFile(
            path.join(process.cwd(), "prisma", "data", "newProducts.json"),
            JSON.stringify(data, null, 2),
            {
                flag: "w",
                encoding: "utf8",
            },
        );
    } catch (e) {
        console.log(e);
    }
}
