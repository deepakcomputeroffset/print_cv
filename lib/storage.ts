import { FileLike } from "@/types/types";
import { Storage } from "@google-cloud/storage";

export type GCLOUD_FOLDER_NAME =
    | "files"
    | "images"
    | "design_category"
    | "design_category_items"
    | "design_category_items_file"
    | "carousel";

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
    folder: GCLOUD_FOLDER_NAME,
    file: FileLike,
    name: string,
): Promise<string> => {
    const fileName = `${folder}/${name}`;
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
    folder: GCLOUD_FOLDER_NAME,
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

/**
 * Gets URLs of files older than specified number of days from Google Cloud Storage.
 * @param folder - Optional folder to search in. If not provided, searches entire bucket.
 * @param daysOld - Number of days (default: 30).
 * @returns {Promise<string[]>} - Array of file URLs.
 */
export const getOldFiles = async (
    folder?: GCLOUD_FOLDER_NAME,
    daysOld: number = 30,
): Promise<string[]> => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const [files] = await bucket.getFiles({
            prefix: folder ? `${folder}/` : undefined,
        });

        const oldFileUrls = files
            .filter((file) => {
                const metadata = file.metadata;
                if (!metadata.timeCreated) return false;
                const createdDate = new Date(metadata.timeCreated);
                return createdDate <= cutoffDate;
            })
            .map(
                (file) =>
                    `https://storage.googleapis.com/${process.env.bucketName}/${file.name}`,
            );

        return oldFileUrls;
    } catch (error) {
        console.error("Error fetching old files:", error);
        return [];
    }
};

/**
 * Deletes files older than specified number of days from Google Cloud Storage.
 * @param folder - Optional folder to search in. If not provided, searches entire bucket.
 * @param daysOld - Number of days (default: 30).
 * @returns {Promise<{deleted: number, failed: number}>} - Count of deleted and failed deletions.
 */
export const deleteOldFiles = async (
    folder?: GCLOUD_FOLDER_NAME,
    daysOld: number = 30,
): Promise<{ deleted: number; failed: number }> => {
    try {
        const fileUrls = await getOldFiles(folder, daysOld);
        const results = await deleteFiles(fileUrls);

        const deleted = results.filter((result) => result === true).length;
        const failed = results.filter((result) => result === false).length;

        return { deleted, failed };
    } catch (error) {
        console.error("Error deleting old files:", error);
        return { deleted: 0, failed: 0 };
    }
};
