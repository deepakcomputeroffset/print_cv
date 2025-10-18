import {
    getPublicUrlsFromFolder,
    uploadMultipleLocalFiles,
} from "@/lib/storage-local";
import { Prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

export async function uploadFilesImage(
    data: {
        name: string;
        img: string;
        downloadUrl: string;
    }[],
) {
    const ud = await uploadMultipleLocalFiles(
        data.map((v) => v.img),
        "design_category_items",
    );
    return ud;
}
export async function uploadFilesZip(
    data: {
        name: string;
        img: string;
        downloadUrl: string;
    }[],
) {
    const ud = await uploadMultipleLocalFiles(
        data.map((v) => v.downloadUrl),
        "design_category_items_file",
    );
    return ud;
}

export async function viewUploadedFiles(
    folder:
        | "design_category"
        | "design_category_items"
        | "design_category_items_file",
) {
    const data = await getPublicUrlsFromFolder(folder);
    console.log(JSON.stringify(data, null, 2));
    return data;
}

export async function uploadToDatabase(
    id: number,
    dataToUpload: { name: string; img: string; downloadUrl: string }[],
) {
    const data = await Prisma.designCategory.update({
        where: {
            id,
        },
        data: {
            designs: {
                createMany: { data: dataToUpload },
            },
        },
    });
    console.log(data);
    return data;
}

/**
 * Creates a urls.txt file with all the uploaded cloud URLs
 * @param urls - Array of uploaded cloud URLs
 * @param filename - The output filename (default: "urls.txt")
 */
export function createUrlsFile(
    urls: string[],
    filename: string = "urls.txt",
): void {
    try {
        const content: string[] = [];

        // Add header
        content.push("=== UPLOADED CLOUD URLs ===");
        content.push(`Generated on: ${new Date().toISOString()}`);
        content.push(`Total URLs: ${urls.length}`);
        content.push("");

        // Add all URLs
        urls.forEach((url, index) => {
            content.push(`${index + 1}. ${url}`);
        });

        // Add summary
        content.push("");
        content.push("=== SUMMARY ===");
        content.push(`Total uploaded URLs: ${urls.length}`);

        // Write to file
        fs.writeFileSync(filename, content.join("\n"), "utf8");
        console.log(`✅ URLs file created: ${filename}`);
        console.log(`📁 File location: ${path.resolve(filename)}`);
    } catch (error) {
        console.error(`❌ Error creating URLs file: ${error}`);
    }
}

/**
 * Creates a detailed URLs file with additional information
 * @param data - The original data array
 * @param urls - Array of uploaded cloud URLs
 * @param uploadType - Type of upload ("images" or "zips")
 * @param filename - The output filename
 */
export function createDetailedUrlsFile(
    data: {
        name: string;
        img: string;
        downloadUrl: string;
    }[],
    urls: string[],
    uploadType: "images" | "zips",
    filename: string = "detailed_urls.txt",
): void {
    try {
        const content: string[] = [];

        // Add header
        content.push(`=== UPLOADED ${uploadType.toUpperCase()} URLs ===`);
        content.push(`Generated on: ${new Date().toISOString()}`);
        content.push(`Total items: ${data.length}`);
        content.push(`Successfully uploaded: ${urls.length}`);
        content.push("");

        // Match URLs with original data
        data.forEach((item, index) => {
            content.push(`Item ${index + 1}: ${item.name}`);
            content.push(
                `Original ${uploadType === "images" ? "img" : "Zip"}: ${uploadType === "images" ? item.img : item.downloadUrl}`,
            );

            // Try to find matching uploaded URL
            const uploadedUrl = urls.find((url) => {
                const fileName = path.basename(url);
                const originalFileName = path.basename(
                    uploadType === "images" ? item.img : item.downloadUrl,
                );
                return fileName.includes(originalFileName.split(".")[0]);
            });

            if (uploadedUrl) {
                content.push(`Cloud URL: ${uploadedUrl}`);
            } else {
                content.push(`Cloud URL: FAILED TO UPLOAD`);
            }
            content.push("");
        });

        // Write to file
        fs.writeFileSync(filename, content.join("\n"), "utf8");
        console.log(`✅ Detailed URLs file created: ${filename}`);
    } catch (error) {
        console.error(`❌ Error creating detailed URLs file: ${error}`);
    }
}

export async function completeUploadWorkflow(
    tdata: {
        name: string;
        img: string;
        downloadUrl: string;
    }[],
) {
    // Upload images and create URLs file
    console.log("📤 Uploading images...");
    const { successful: urls } = await uploadFilesImage(tdata);
    createUrlsFile(urls, "/upload_scripts/data/uploaded_image_urls.txt");
    createDetailedUrlsFile(
        tdata,
        urls,
        "images",
        "/upload_scripts/data/image_upload_details.txt",
    );

    // Upload zips and create URLs file
    console.log("📤 Uploading zip files...");
    const { successful: zipUrls } = await uploadFilesZip(tdata);
    createUrlsFile(zipUrls, "/upload_scripts/data/uploaded_zip_urls.txt");
    createDetailedUrlsFile(
        tdata,
        zipUrls,
        "zips",
        "/upload_scripts/data/zip_upload_details.txt",
    );

    console.log("🎉 All uploads completed and URLs files created!");
}
