import path from "path";
import fs from "fs/promises";
import { Prisma } from "@prisma/client";
import { Prisma as prisma } from "@/lib/prisma";
import { z } from "zod";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

/* ---------------------------------------------
   1. Read Prisma model relationships (DMMF)
---------------------------------------------- */
function getModelRelations() {
    const models = Prisma.dmmf.datamodel.models;
    const relations = new Map<string, { dependsOn: string[] }>();

    for (const model of models) {
        const dependsOn: string[] = [];

        for (const field of model.fields) {
            if (field.kind === "object" && field.relationFromFields?.length) {
                dependsOn.push(field.type);
            }
        }

        relations.set(model.name, { dependsOn });
    }

    return relations;
}

/* ---------------------------------------------
   2. Resolve order + detect cycles (no throw)
---------------------------------------------- */
function resolveSeedOrderWithCycles() {
    const graph = getModelRelations();
    const visited = new Set<string>();
    const temp = new Set<string>();
    const ordered: string[] = [];
    const cycles = new Set<string>();

    function visit(model: string) {
        if (temp.has(model)) {
            cycles.add(model);
            return;
        }

        if (visited.has(model)) return;

        temp.add(model);

        for (const dep of graph.get(model)?.dependsOn ?? []) {
            visit(dep);
        }

        temp.delete(model);
        visited.add(model);
        ordered.push(model);
    }

    for (const model of graph.keys()) {
        visit(model);
    }

    return {
        ordered: ordered.filter((m) => !cycles.has(m)),
        cycles: Array.from(cycles),
    };
}

/* ---------------------------------------------
   3. Helpers to strip / extract relations
---------------------------------------------- */
function stripRelations(model: Prisma.ModelName, item: any) {
    const meta = Prisma.dmmf.datamodel.models.find((m) => m.name === model)!;

    const clean = { ...item };

    for (const field of meta.fields) {
        if (field.kind === "object") {
            const isRequiredRelation = field.isRequired;

            // Optional relation → strip
            if (!isRequiredRelation) {
                delete clean[field.name];

                if (field.relationFromFields) {
                    for (const fk of field.relationFromFields) {
                        delete clean[fk];
                    }
                }
            }
            // Required relation → keep
        }
    }

    return clean;
}

/* ---------------------------------------------
   4. Read JSON safely
---------------------------------------------- */
const SNAPSHOTS_DIR = path.join(process.cwd(), "scripts/seed/snapshots");

async function listSnapshots(): Promise<string[]> {
    try {
        const stat = await fs.stat(SNAPSHOTS_DIR);
        if (!stat.isDirectory()) {
            throw new Error();
        }
    } catch {
        console.error(
            "❌ Seed aborted: 'snapshots' directory does not exist at:\n",
            SNAPSHOTS_DIR,
        );
        process.exit(1);
    }

    const entries = await fs.readdir(SNAPSHOTS_DIR, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    if (dirs.length === 0) {
        console.error(
            "❌ Seed aborted: No snapshot directories found inside 'snapshots/'",
        );
        process.exit(1);
    }

    return dirs;
}

async function promptSnapshotChoice(snapshots: string[]): Promise<string> {
    console.log("\n📸 Available seed snapshots:\n");

    snapshots.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s}`);
    });

    const rl = createInterface({ input, output });

    const answer = await rl.question("\nSelect snapshot number: ");
    rl.close();

    rl.close();

    const index = Number(answer) - 1;

    if (Number.isNaN(index) || !snapshots[index]) {
        console.error("❌ Invalid snapshot selection. Seed aborted.");
        process.exit(1);
    }

    return snapshots[index];
}

async function validateSnapshot(snapshotName: string) {
    const snapshotPath = path.join(SNAPSHOTS_DIR, snapshotName);

    let files: string[];

    try {
        files = await fs.readdir(snapshotPath);
    } catch {
        console.error(
            `❌ Seed aborted: Snapshot directory not found: ${snapshotName}`,
        );
        process.exit(1);
    }

    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    if (jsonFiles.length === 0) {
        console.error(
            `❌ Seed aborted: Snapshot '${snapshotName}' contains no JSON seed files`,
        );
        process.exit(1);
    }

    console.log(`\n✅ Using snapshot: ${snapshotName}`);
    return snapshotPath;
}

let ACTIVE_SNAPSHOT_PATH: string;

async function readModelData(model: Prisma.ModelName) {
    const dataPath = path.join(ACTIVE_SNAPSHOT_PATH, `${model}.json`);

    try {
        await fs.access(dataPath);
    } catch {
        // No file for this model → skip silently
        return [];
    }

    const fileContent = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(fileContent);

    if (!Array.isArray(parsed)) {
        throw new Error(
            `❌ ${model}.json inside snapshot is not a valid array`,
        );
    }

    return parsed;
}

/* ---------------------------------------------
   Helper to find unique where clause
---------------------------------------------- */
function getUniqueWhere(model: Prisma.ModelName, item: any) {
    const meta = Prisma.dmmf.datamodel.models.find((m) => m.name === model)!;

    // 1. Single @id
    const idField = meta.fields.find((f) => f.isId);
    if (idField && item[idField.name] !== undefined) {
        return { [idField.name]: item[idField.name] };
    }

    // 2. Single @unique
    const uniqueField = meta.fields.find(
        (f) => f.isUnique && item[f.name] !== undefined,
    );
    if (uniqueField) {
        return { [uniqueField.name]: item[uniqueField.name] };
    }

    // 3. Composite PK
    if (meta.primaryKey) {
        const keys = meta.primaryKey.fields;

        if (keys.every((k) => item[k] !== undefined)) {
            const name = meta.primaryKey.name || keys.join("_");
            const compound: any = {};

            keys.forEach((k) => (compound[k] = item[k]));

            return { [name]: compound };
        }
    }

    // 4. Composite Unique
    if (meta.uniqueFields?.length) {
        for (const keys of meta.uniqueFields) {
            if (keys.every((k) => item[k] !== undefined)) {
                const name = keys.join("_");
                const compound: any = {};

                keys.forEach((k) => (compound[k] = item[k]));

                return { [name]: compound };
            }
        }
    }

    // Fallback
    return { id: item.id };
}

async function verifySeedIntegrity(models: Prisma.ModelName[]) {
    console.log("\n🔍 Verifying seed integrity (count-based)...\n");

    let hasFailure = false;

    for (const model of models) {
        let items: any[];

        try {
            items = await readModelData(model);
        } catch {
            // No JSON file → nothing to verify
            continue;
        }

        if (items.length === 0) continue;

        // @ts-expect-error dynamic prisma access
        const dbCount = await prisma[model].count();
        const jsonCount = items.length;

        if (dbCount < jsonCount) {
            hasFailure = true;
            console.error(
                `❌ ${model}: DB has ${dbCount}, JSON expects ${jsonCount}`,
            );
        } else {
            console.log(
                `✅ ${model}: DB has ${dbCount}, JSON expects ${jsonCount}`,
            );
        }
    }

    if (hasFailure) {
        console.error("\n🚨 Seed verification FAILED (count mismatch)");
        process.exit(1);
    }

    console.log("\n🎉 Seed verification PASSED — counts are valid");
}

function extractRelations(model: Prisma.ModelName, item: any) {
    const meta = Prisma.dmmf.datamodel.models.find((m) => m.name === model)!;
    const relations: Record<string, any> = {};

    for (const field of meta.fields) {
        if (
            field.kind === "object" &&
            !field.isList &&
            field.relationFromFields?.length
        ) {
            const fkFields = field.relationFromFields;
            const referencedFields = field.relationToFields ?? ["id"];

            // 🔑 CHECK FK VALUES, NOT relation object
            if (
                !fkFields.every(
                    (fk) => item[fk] !== null && item[fk] !== undefined,
                )
            ) {
                continue;
            }

            const where: any = {};
            referencedFields.forEach((rf, i) => {
                where[rf] = item[fkFields[i]];
            });

            relations[field.name] = {
                connect: where,
            };
        }
    }

    return relations;
}

function extractReverseRelations(model: Prisma.ModelName, item: any) {
    const meta = Prisma.dmmf.datamodel.models.find((m) => m.name === model)!;
    const updates: Array<{
        targetModel: Prisma.ModelName;
        where: any;
        data: any;
    }> = [];

    for (const field of meta.fields) {
        if (
            field.kind === "object" &&
            field.isList &&
            field.type &&
            Array.isArray(item[field.name])
        ) {
            // Child model
            const childModel = field.type as Prisma.ModelName;

            // Find FK field on child pointing back to parent
            const childMeta = Prisma.dmmf.datamodel.models.find(
                (m) => m.name === childModel,
            )!;

            const backRelationField = childMeta.fields.find(
                (f) =>
                    f.kind === "object" &&
                    f.type === model &&
                    f.relationFromFields?.length,
            );

            if (!backRelationField) continue;

            const fkField = backRelationField.relationFromFields![0];
            const parentIdField =
                backRelationField.relationToFields?.[0] ?? "id";

            for (const childItem of item[field.name]) {
                if (!childItem || !childItem.id) continue;

                updates.push({
                    targetModel: childModel,
                    where: { id: childItem.id },
                    data: {
                        [fkField]: item[parentIdField],
                    },
                });
            }
        }
    }

    return updates;
}

async function linkDeferredRelations(models: Prisma.ModelName[]) {
    console.log("\n🔗 Linking deferred relations...\n");

    for (const model of models) {
        let items: any[];

        try {
            items = await readModelData(model);
        } catch {
            console.error(`❌ Failed to read data for model ${model}`);
            continue;
        }

        if (!items.length) continue;

        for (const item of items) {
            // 1️⃣ FK-owned relations (many-to-one / one-to-one)
            const directRelations = extractRelations(model, item);

            if (Object.keys(directRelations).length > 0) {
                try {
                    // @ts-expect-error dynamic prisma access
                    await prisma[model].update({
                        where: getUniqueWhere(model, item),
                        data: directRelations,
                    });
                } catch (e) {
                    console.warn(
                        `⚠️ Failed to link direct relations for ${model} (ID: ${
                            item.id
                        }): ${String(e).split("\n")[0]}`,
                    );
                }
            }

            // 2️⃣ Reverse relations (one-to-many)
            const reverseUpdates = extractReverseRelations(model, item);

            for (const update of reverseUpdates) {
                // @ts-expect-error dynamic prisma access
                await prisma[update.targetModel].update({
                    where: update.where,
                    data: update.data,
                });
            }
        }

        console.log(`✅ Relations linked for ${model}`);
    }
}

async function verifyFieldIntegrity(models: Prisma.ModelName[]) {
    console.log("\n🔎 Verifying field integrity (value-based)...\n");

    console.warn("The following fields will be excluded from verification.");
    [
        "Fields marked with the following:" +
            "\n " +
            ["@updatedAt", "@default(now())"].join("\n "),
    ].map((message, index) => {
        console.warn(`${index + 1}. ${message}`);
    });

    let hasFailure = false;

    for (const model of models) {
        let snapshotItems: any[];

        try {
            snapshotItems = await readModelData(model);
        } catch {
            continue;
        }

        if (snapshotItems.length === 0) continue;

        const meta = Prisma.dmmf.datamodel.models.find(
            (m) => m.name === model,
        )!;

        // Only scalar DB fields (including FK fields)
        const onlyScalarFields = meta.fields.filter((f) => f.kind === "scalar");
        const comparableFields = meta.fields.filter(
            (f) =>
                f.kind === "scalar" &&
                !f.isUpdatedAt &&
                !(
                    f.default &&
                    isPrismaDefaultFunction(f.default) &&
                    f.default.name === "now"
                ),
        );

        function isPrismaDefaultFunction(
            def: unknown,
        ): def is { name: string; args?: unknown[] } {
            return (
                typeof def === "object" &&
                def !== null &&
                "name" in def &&
                typeof (def as any).name === "string"
            );
        }

        console.log(
            "Fields that are being compared: ",
            comparableFields.map((f) => f.name).join(", "),
        );
        console.log(
            "Fields that are NOT being compared: ",
            onlyScalarFields
                .filter((f) => !comparableFields.includes(f))
                .map((f) => f.name)
                .join(", "),
        );

        for (const item of snapshotItems) {
            const where = getUniqueWhere(model, item);

            // @ts-expect-error dynamic prisma access
            const dbRow = await prisma[model].findUnique({ where });

            if (!dbRow) {
                hasFailure = true;
                console.error(`❌ ${model} record not found in DB`);
                console.error("Where:", where);
                continue;
            }

            for (const field of comparableFields) {
                const fieldName = field.name;

                const jsonValue = item[fieldName];
                const dbValue = dbRow[fieldName];

                // Ignore fields not present in snapshot
                if (jsonValue === undefined) continue;

                // Normalize dates
                const normalizedJson =
                    jsonValue instanceof Date
                        ? jsonValue.toISOString()
                        : jsonValue;

                const normalizedDb =
                    dbValue instanceof Date ? dbValue.toISOString() : dbValue;

                function normalizeEmptyValues(value: any) {
                    // Treat null / undefined as empty object
                    if (value === null || value === undefined) return {};

                    // Normalize objects with nulls → empty strings
                    if (typeof value === "object" && !Array.isArray(value)) {
                        return Object.fromEntries(
                            Object.entries(value).map(([k, v]) => [
                                k,
                                v === null || v === undefined ? "" : v,
                            ]),
                        );
                    }

                    return value;
                }

                const expected = normalizeEmptyValues(normalizedJson);
                const actual = normalizeEmptyValues(normalizedDb);

                if (JSON.stringify(expected) !== JSON.stringify(actual)) {
                    hasFailure = true;
                    console.error(`❌ Field mismatch in ${model}.${fieldName}`);
                    console.error("Where:", where);
                    console.error("Expected (JSON):", expected);
                    console.error("Actual (DB):", actual);
                }
            }
        }

        console.log(`✅ ${model} field integrity verified`);
    }

    if (hasFailure) {
        console.error("\n🚨 Field integrity verification FAILED");
        process.exit(1);
    }

    console.log("\n🎉 Field integrity verification PASSED");
}

export default async function runFlow() {
    const snapshots = await listSnapshots();
    const chosenSnapshot = await promptSnapshotChoice(snapshots);
    ACTIVE_SNAPSHOT_PATH = await validateSnapshot(chosenSnapshot);

    const { ordered, cycles } = resolveSeedOrderWithCycles();

    const orderedModels = z
        .array(z.nativeEnum(Prisma.ModelName))
        .parse([...ordered, ...cycles]);

    console.log("🧩 Seed order:", ordered);
    console.log("🔁 Cyclic models:", cycles);

    let failedSeedingModels: Prisma.ModelName[] = [];
    do {
        const previouslyFailedSeeingModelsLength = failedSeedingModels.length;
        const failureRecord: Record<string, string> = {};
        for (const model of failedSeedingModels.length === 0
            ? orderedModels
            : failedSeedingModels) {
            const items = await readModelData(model);

            if (items.length === 0) {
                console.log(`⏭️  Skipping ${model} (empty JSON)`);
                continue;
            }

            console.log(`➡️  Base seeding: ${model}`);
            try {
                await prisma.$transaction(
                    items.map((item) => {
                        const baseData = stripRelations(model, item);
                        // @ts-expect-error dynamic prisma access
                        return prisma[model].upsert({
                            where: getUniqueWhere(model, item),
                            update: baseData,
                            create: baseData,
                        });
                    }),
                );
                failedSeedingModels = failedSeedingModels.filter(
                    (item) => item !== model,
                );
            } catch (error) {
                failedSeedingModels.push(model);
                failureRecord[model] = String(error);
                console.error(`❌ Base seed failed for ${model}`);
                console.error(String(error));
                continue;
            }
        }

        if (failedSeedingModels.length > 0) {
            if (
                failedSeedingModels.length ===
                previouslyFailedSeeingModelsLength
            ) {
                const formattedErrors = Object.entries(failureRecord).map(
                    ([model, error]) => ({
                        model,
                        error: new Error(error).message,
                    }),
                );
                console.log("❌ Failed models:", formattedErrors);
                break;
            }

            console.log(
                `🔄 Retrying failed models: ${failedSeedingModels.join(", ")}`,
            );
        }
    } while (failedSeedingModels.length > 0);

    console.log("✅ Base seeding completed.");

    const enteredOrderedModelsName = orderedModels
        .map((model) => (!failedSeedingModels.includes(model) ? model : null))
        .filter((model) => model !== null) as Prisma.ModelName[];

    await verifySeedIntegrity(enteredOrderedModelsName);
    console.log("🧠 Integrity verified. Proceeding to relation linking...");

    await linkDeferredRelations(enteredOrderedModelsName);
    console.log("🔗 Relations linked.");

    await verifyFieldIntegrity(enteredOrderedModelsName);
    console.log("✅ Field integrity verified.");

    console.log("🎉 Seeding fully completed with relations linked.");
}

runFlow();
