import { FileLike } from "@/types/types";
import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
    projectId: process.env.project_id,
    credentials: {
        private_key: process.env.private_key,
        client_email: process.env.client_email,
        private_key_id: process.env.private_key_id,
    },
});

export const bucket = storage.bucket(process?.env?.bucketName as string);

/**
 * Uploads a single file to Google Cloud Storage.
 * @param folder - The destination folder in the bucket (e.g., "files" or "images").
 * @param file - The file to upload.
 * @param name - The unique name for the file.
 * @returns {Promise<string>} - Returns the file URL.
 */
export const uploadFile = async (
    folder:
        | "files"
        | "images"
        | "design_category"
        | "design_category_items"
        | "design_category_items_file",
    file: FileLike,
    name: string,
): Promise<string> => {
    const fileName = `${folder}/${Date.now()}_${name.split(".").slice(0, -1).join(".")}`;
    const cloudFile = bucket.file(fileName);

    await new Promise(async (resolve, reject) => {
        const stream = cloudFile.createWriteStream({
            metadata: { contentType: file.type },
        });
        stream.on("error", reject);
        stream.on("finish", resolve);
        stream.end(Buffer.from(await file.arrayBuffer()));
    });
    await cloudFile.makePublic();
    return `https://storage.googleapis.com/${process.env.bucketName}/${fileName}`;
};

/**
 * Uploads multiple files to Google Cloud Storage in parallel.
 * @param folder - The destination folder (e.g., "files" or "images").
 * @param files - An array of File objects.
 * @param namePrefix - A prefix for file names (e.g., user ID).
 * @returns {Promise<string[]>} - Returns an array of uploaded file URLs.
 */
export const uploadMultipleFiles = async (
    folder:
        | "files"
        | "images"
        | "design_category"
        | "design_category_items"
        | "design_category_items_file",
    files: FileLike[],
    namePrefix: string,
): Promise<string[]> => {
    return Promise.all(
        files.map((file, index) =>
            uploadFile(folder, file, `${namePrefix}_${index}`),
        ),
    );
};

export const deleteFile = async (fileUrl: string): Promise<boolean> => {
    try {
        const filePath = fileUrl.split(
            `https://storage.googleapis.com/${process.env.bucketName}/`,
        )[1];

        if (!filePath) {
            throw new Error("Invalid file URL.");
        }

        const file = bucket.file(filePath);
        await file.delete();

        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

export const deleteFiles = async (fileUrls: string[]): Promise<boolean[]> => {
    try {
        const deletePromises = fileUrls.map(async (fileUrl) => {
            try {
                return await deleteFile(fileUrl);
            } catch (error) {
                console.error(`Error deleting file (${fileUrl}):`, error);
                return false;
            }
        });

        return await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error deleting multiple files:", error);
        return fileUrls.map(() => false); // Return false for all files in case of a major failure
    }
};
