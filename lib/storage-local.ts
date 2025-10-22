import fs from "fs";
import path from "path";
import { bucket } from "./storage";

/**
 * Uploads a single file from the local filesystem to Google Cloud Storage.
 * This function is designed to be robust with detailed error logging.
 * @param localPath - The full path to the local file.
 * @param folder - The destination folder in the bucket.
 * @returns {Promise<string>} - Returns the public URL of the uploaded file.
 */
export const uploadLocalFile = async (
    localPath: string,
    folder:
        | "files"
        | "images"
        | "design_category"
        | "design_category_items"
        | "design_category_items_file",
): Promise<string> => {
    try {
        // --- Pre-upload check: Verify the file exists and is readable ---
        await fs.promises.access(localPath, fs.constants.R_OK);

        const baseName = path.basename(localPath);
        const name = baseName.split(".").slice(0, -1).join(".");
        // Sanitize the baseName to remove extension for the name part
        const sanitizedName = name.replace(/[^a-zA-Z0-9-_]/g, "_");
        const fileName = `${folder}/${sanitizedName}_${Date.now()}${path.extname(baseName)}`;

        const cloudFile = bucket.file(fileName);

        // --- Streaming Upload ---
        // Create a read stream from the local file and pipe it to the GCS write stream
        await new Promise<void>((resolve, reject) => {
            const localReadStream = fs.createReadStream(localPath);
            const remoteWriteStream = cloudFile.createWriteStream({
                // Let GCS infer content type from the file extension for simplicity.
                // You can add it explicitly if needed: e.g., metadata: { contentType: 'image/jpeg' }
            });

            localReadStream
                .pipe(remoteWriteStream)
                .on("finish", () => {
                    // The file has been fully uploaded.
                    resolve();
                })
                .on("error", (error) => {
                    // An error occurred during the stream pipe.
                    console.error(`Stream error for ${localPath}:`, error);
                    reject(error);
                });
        });

        // --- Finalization ---
        // Make the file public and return its URL
        await cloudFile.makePublic();
        const publicUrl = `https://storage.googleapis.com/${process.env.bucketName}/${fileName}`;
        console.log(`Successfully uploaded ${localPath} to ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        // --- Catch-all for any errors in the process ---
        console.error(`Failed to upload ${localPath}. Reason:`, error);
        // Re-throw the error so Promise.allSettled can catch it as a 'rejected' state.
        throw error;
    }
};

/**
 * Uploads multiple files from the local filesystem to Google Cloud Storage in parallel.
 * This function is resilient and will not stop if a single file fails.
 * @param localPaths - An array of full paths to the local files.
 * @param folder - The destination folder for all files.
 * @returns {Promise<{successful: string[], failed: {path: string, reason: any}[]}>}
 * - Returns an object with arrays of successful URLs and failed uploads.
 */
export const uploadMultipleLocalFiles = async (
    localPaths: string[],
    folder:
        | "files"
        | "images"
        | "design_category"
        | "design_category_items"
        | "design_category_items_file",
): Promise<{
    successful: string[];
    // eslint-disable-next-line
    failed: { path: string; reason: any }[];
}> => {
    console.log(
        `\nStarting batch upload of ${localPaths.length} files to "${folder}"...`,
    );

    // Use Promise.allSettled to attempt every upload, regardless of individual failures.
    const results = await Promise.allSettled(
        localPaths.map((localPath) => uploadLocalFile(localPath, folder)),
    );

    const successful: string[] = [];
    // eslint-disable-next-line
    const failed: { path: string; reason: any }[] = [];

    // Process the results of all the settled promises.
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            // The upload was successful, and result.value is the returned URL.
            successful.push(result.value);
        } else {
            // The upload failed, and result.reason is the error that was thrown.
            failed.push({
                path: localPaths[index],
                reason: result.reason.message || result.reason,
            });
        }
    });

    console.log("\n--- Batch Upload Report ---");
    console.log(`Successful uploads: ${successful.length}`);
    console.log(`Failed uploads: ${failed.length}`);
    if (failed.length > 0) {
        console.log("Failed files:", failed);
    }
    console.log("---------------------------\n");

    return { successful, failed };
};

/**
 * Retrieves the public URLs of all files within a specified folder in the bucket.
 * @param folder - The folder from which to retrieve file URLs.
 * @returns {Promise<string[]>} - A promise that resolves to an array of public URLs.
 */
export const getPublicUrlsFromFolder = async (
    folder:
        | "files"
        | "images"
        | "design_category"
        | "design_category_items"
        | "design_category_items_file",
): Promise<string[]> => {
    try {
        // Ensure the folder name ends with a '/' to correctly list directory contents.
        const prefix = folder.endsWith("/") ? folder : `${folder}/`;

        const [files] = await bucket.getFiles({ prefix });

        const urls = files
            .map((file) => {
                // GCS may return the directory placeholder itself, which we should ignore.
                if (file.name === prefix) {
                    return null;
                }
                return `https://storage.googleapis.com/${process.env.bucketName}/${file.name}`;
            })
            .filter((url): url is string => url !== null); // Filter out any null values

        console.log(`Found ${urls.length} files in folder "${folder}".`);
        return urls;
    } catch (error) {
        console.error(
            `Failed to get files from folder "${folder}". Reason:`,
            error,
        );
        throw error;
    }
};
