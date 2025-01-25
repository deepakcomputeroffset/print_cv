import sharp from "sharp";

export async function optimizeImage(file: File): Promise<Blob> {
    const buffer = await file.arrayBuffer();
    const optimized = await sharp(buffer)
        .resize(800, 800, {
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

    return new Blob([optimized], { type: "image/webp" });
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
