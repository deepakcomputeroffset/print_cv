import {
    calculateBase64Size,
    DELETE_FILE,
    UPLOAD_TO_CLOUDINARY,
} from "@/lib/cloudinary";
import { maxImageSize } from "@/lib/constants";

export async function POST(res: Request): Promise<Response> {
    try {
        const data = await res.json();
        const files = data?.files as string[];
        if (!files) {
            return Response.json(
                {
                    message: "Image not found",
                    success: false,
                },
                {
                    status: 400,
                },
            );
        }

        const validFiles = files.filter(
            (file) => calculateBase64Size(file) <= maxImageSize,
        );

        if (validFiles.length !== files.length) {
            return Response.json(
                {
                    message: "Some image are too large.",
                    success: false,
                },
                {
                    status: 400,
                },
            );
        }

        const folder = "products";
        const promises = validFiles.map(
            async (file) => await UPLOAD_TO_CLOUDINARY(file, folder),
        );
        const results = await Promise.all(promises);
        return Response.json(results, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "some error occured while uploading", error },
            { status: 500 },
        );
    }
}

export async function DELETE(res: Request) {
    try {
        const { searchParams } = new URL(res.url);
        const urlToDelete = searchParams?.get("url") as string;

        const result = await DELETE_FILE(urlToDelete);
        return Response.json(result, { status: 200 });
    } catch (error) {
        console.log("ERROR WHILE DELETE FILE", error);
        return Response.json(
            {
                message: "Internal Error",
                error,
            },
            { status: 500 },
        );
    }
}
