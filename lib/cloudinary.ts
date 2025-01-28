import {
    UploadApiErrorResponse,
    UploadApiResponse,
    v2 as cloudinary,
} from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const UPLOAD_TO_CLOUDINARY = async (
    file: string,
    folder?: string,
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    try {
        const uploadToCloudinary = (): Promise<UploadApiResponse> => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload(file, {
                        invalidate: true,
                        folder,
                    })
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            });
        };

        const result = await uploadToCloudinary();

        return result;
    } catch (error) {
        console.log("ERROR While UPLOADING MEDIA", error);
        return error as UploadApiErrorResponse;
    }
};

export const DELETE_FILE = async (url: string) => {
    const publicId = extractPublicId(url);
    const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: "image",
    });
    return result;
};

export function calculateBase64Size(base64String: string) {
    // Remove the metadata if present (e.g., "data:image/png;base64,")
    const base64 = base64String.split(",")[1] || base64String;

    // Calculate the padding (number of '=' characters at the end)
    const padding = (base64.match(/=/g) || []).length;

    // Calculate the base64 size
    const sizeInBytes = (base64.length * 3) / 4 - padding;

    return sizeInBytes;
}
