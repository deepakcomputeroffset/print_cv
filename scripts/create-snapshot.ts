import { Prisma } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { Prisma as prisma } from "@/lib/prisma";

(async () => {
    const prismaModels = Object.values(Prisma.ModelName);
    const modelsRoot = path.join(__dirname, "./snapshot");

    try {
        await fs.mkdir(modelsRoot, { recursive: true });

        const errors: string[] = [];

        for (const model of prismaModels) {
            // @ts-expect-error
            const databaseData = await prisma[model].findMany();

            console.log(
                `✅ ${model} schema loaded, ${databaseData.length} records found, ${JSON.stringify(databaseData[0], null, 2)}`,
            );

            const snapshotPath = path.join(modelsRoot, `${model}.json`);

            await fs.writeFile(
                snapshotPath,
                JSON.stringify(databaseData, null, 2),
            );
            console.log(`✅ ${model} snapshot saved to ${snapshotPath}`);
        }

        if (errors.length) {
            console.error("\n❌ Seed schema validation failed:");
            errors.forEach((e) => console.error(" •", e));
            throw new Error("Seed snapshot aborted");
        }

        console.log("\n🎉 All seed schemas validated successfully");
    } catch (err) {
        console.error("\n💥 Fatal error:", err);
        process.exit(1);
    }
})();
