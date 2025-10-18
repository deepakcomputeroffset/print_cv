import fs from "fs";
import path from "path";
import axios from "axios";
import { URL } from "url";

function getTransformedData(filePath: string) {
    // const transformedDataPath = path.join(__dirname, filePath);
    let imageData: {
        name: string;
        img: string;
        downloadUrl: string;
    }[] = [];

    try {
        const data = fs.readFileSync(filePath, "utf8");
        imageData = JSON.parse(data);
        console.log(
            `Successfully loaded ${imageData.length} items from transformed_data.json`,
        );

        return imageData;
    } catch (error) {
        console.error(`Error reading transformed_data.json: ${error}`);
        process.exit(1); // Exit if we can't read the data file
    }
}

/**
 * Dojs_images from the provided list of URLs and saves them to a local folder.
 */

// Shared helper function for delay
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add memory monitoring
function logMemoryUsage() {
    const used = process.memoryUsage();
    console.log(
        `🧠 Memory: RSS=${Math.round(used.rss / 1024 / 1024)}MB, Heap=${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    );
}

const DOWNLOAD_FOLDER =
    "C:/codes/PrintingPress/upload_scripts/downloaded_designs/images";

async function downloadImages(
    imageData: {
        name: string;
        img: string;
        downloadUrl: string;
    }[],
) {
    try {
        await fs.promises.mkdir(DOWNLOAD_FOLDER, { recursive: true });
        console.log(`📁 Directory is ready: ${DOWNLOAD_FOLDER}`);
    } catch (error) {
        console.error(`❌ Error creating directory: ${error}`);
        return;
    }

    console.log("\n🚀 Starting image downloads...");
    console.log(`📊 Total files: ${imageData.length}`);

    const BATCH_SIZE = 3; // Reduced batch size for stability
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < imageData.length; i += BATCH_SIZE) {
        const batch = imageData.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(imageData.length / BATCH_SIZE);

        console.log(
            `\n🔄 Batch ${batchNumber}/${totalBatches} (${batch.length} files)`,
        );

        // Process one item at a time within the batch to avoid overwhelming the system
        for (const item of batch) {
            try {
                await downloadSingleFile(item, DOWNLOAD_FOLDER, "image");
                successful++;
                console.log(`✅ Completed: ${item.name}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed: ${item.name} - ${error}`);
            }

            // Small delay between individual downloads
            await delay(500);
        }

        console.log(
            `📈 Batch ${batchNumber} progress: ${successful} ✅, ${failed} ❌`,
        );

        if (i + BATCH_SIZE < imageData.length) {
            console.log(`⏳ Waiting 3 seconds before next batch...`);
            await delay(3000); // Increased delay
        }
    }

    console.log(`\n🎉 Image download completed!`);
    console.log(`📊 Summary: ${successful} successful, ${failed} failed`);
}

const DOWNLOAD_FOLDER_ZIP =
    "C:/codes/PrintingPress/upload_scripts/downloaded_designs/zips";

async function downloadZipArchives(
    imageData: {
        name: string;
        img: string;
        downloadUrl: string;
    }[],
) {
    try {
        await fs.promises.mkdir(DOWNLOAD_FOLDER_ZIP, { recursive: true });
        console.log(`📁 Directory is ready: ${DOWNLOAD_FOLDER_ZIP}`);
    } catch (error) {
        console.error(`❌ Error creating directory: ${error}`);
        return;
    }

    console.log("\n🚀 Starting ZIP file downloads...");
    console.log(`📊 Total files: ${imageData.length}`);

    const BATCH_SIZE = 2; // Even smaller for zips (they're larger files)
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < imageData.length; i += BATCH_SIZE) {
        const batch = imageData.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(imageData.length / BATCH_SIZE);

        console.log(
            `\n🔄 Batch ${batchNumber}/${totalBatches} (${batch.length} files)`,
        );

        // Process sequentially within batch
        for (const item of batch) {
            try {
                await downloadSingleFile(item, DOWNLOAD_FOLDER_ZIP, "zip");
                successful++;
                console.log(`✅ Completed: ${item.name}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed: ${item.name} - ${error}`);
            }

            // Small delay between individual downloads
            await delay(1000); // Longer delay for zips
        }

        console.log(
            `📈 Batch ${batchNumber} progress: ${successful} ✅, ${failed} ❌`,
        );

        if (i + BATCH_SIZE < imageData.length) {
            console.log(`⏳ Waiting 4 seconds before next batch...`);
            await delay(4000); // Longer delay for zips
        }
    }

    console.log(`\n🎉 ZIP download completed!`);
    console.log(`📊 Summary: ${successful} successful, ${failed} failed`);
}

// Modified download function with memory monitoring
async function downloadSingleFile(
    item: { name: string; img: string; downloadUrl: string },
    downloadFolder: string,
    type: "image" | "zip",
): Promise<void> {
    const url = type === "image" ? item.img : item.downloadUrl;
    const name = item.name;

    if (!name || !url) {
        throw new Error(`Missing name or ${type} URL`);
    }

    return new Promise(async (resolve, reject) => {
        let response: any = null;
        let writer: fs.WriteStream | null = null;

        try {
            const urlObject = new URL(url);
            const originalFilename = path.basename(urlObject.pathname);
            const filePath = path.join(downloadFolder, originalFilename);

            console.log(`⬇️ Starting: ${originalFilename}`);
            logMemoryUsage();

            // Check if file already exists to avoid re-downloading
            try {
                await fs.promises.access(filePath);
                console.log(`⏭️ Already exists: ${originalFilename}`);
                resolve();
                return;
            } catch {
                // File doesn't exist, proceed with download
            }

            response = await axios({
                method: "GET",
                url: url,
                responseType: "stream",
                timeout: 60000, // 1 minute timeout
            });

            writer = fs.createWriteStream(filePath);

            const cleanup = () => {
                if (writer && !writer.closed) {
                    writer.destroy();
                }
                if (response && response.data) {
                    response.data.destroy();
                }
            };

            // Set timeout for the entire download process
            const downloadTimeout = setTimeout(() => {
                console.error(`⏰ Timeout: ${originalFilename}`);
                cleanup();
                reject(new Error(`Download timeout after 60 seconds`));
            }, 60000);

            writer.on("finish", () => {
                clearTimeout(downloadTimeout);
                console.log(`✅ Completed: ${originalFilename}`);
                logMemoryUsage();
                cleanup();
                resolve();
            });

            writer.on("error", (error) => {
                clearTimeout(downloadTimeout);
                console.error(`❌ Write error: ${originalFilename}`);
                cleanup();
                reject(error);
            });

            response.data.on("error", (error) => {
                clearTimeout(downloadTimeout);
                console.error(`❌ Stream error: ${originalFilename}`);
                cleanup();
                reject(error);
            });

            response.data.pipe(writer);
        } catch (error) {
            if (writer) writer.destroy();
            if (response && response.data) response.data.destroy();
            console.error(`❌ Failed: ${name} - ${error}`);
            reject(error);
        }
    });
}
export { getTransformedData, downloadImages, downloadZipArchives };
