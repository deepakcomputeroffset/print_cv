import fs from "fs";
import path from "path";
import { bucket } from "./storage";

/**
 * Uploads a single file from the local filesystem to Google Cloud Storage.
 * @param folder - The destination folder in the bucket (e.g., "files" or "images").
 * @param localPath - The full path to the local file.
 * @returns {Promise<string>} - Returns the public URL of the uploaded file.
 */

export const uploadLocalFile = async (
    localPath: string,
    folder: "files" | "images" | "design_category" = "design_category",
): Promise<string> => {
    const baseName = path.basename(localPath);
    // Sanitize the baseName to remove extension for the name part
    const name = baseName.split(".").slice(0, -1).join(".");
    const fileName = `${folder}/${name}_${Date.now()}${path.extname(baseName)}`;
    const cloudFile = bucket.file(fileName);

    // Create a read stream from the local file and pipe it to the GCS write stream
    await new Promise<void>((resolve, reject) => {
        const localReadStream = fs.createReadStream(localPath);
        const remoteWriteStream = cloudFile.createWriteStream(); // Content-type is inferred by GCS

        localReadStream
            .pipe(remoteWriteStream)
            .on("finish", resolve)
            .on("error", reject);
    });

    await cloudFile.makePublic();
    console.log(`Successfully uploaded ${localPath} to ${fileName}`);
    return `https://storage.googleapis.com/${process.env.bucketName}/${fileName}`;
};

/**
 * Uploads multiple files from the local filesystem to Google Cloud Storage in parallel.
 * @param folder - The destination folder (e.g., "files" or "images").
 * @param localPaths - An array of full paths to the local files.
 * @returns {Promise<string[]>} - Returns an array of uploaded file URLs.
 */
export const uploadMultipleLocalFiles = async (
    localPaths: string[],
    folder: "files" | "images" | "design_category",
): Promise<string[]> => {
    // Use Promise.all to upload all files concurrently
    return Promise.all(
        localPaths.map((localPath) => uploadLocalFile(localPath, folder)),
    );
};
