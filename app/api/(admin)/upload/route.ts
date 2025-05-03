import { auth } from "@/lib/auth";
import { maxImageSize } from "@/lib/constants";
import serverResponse from "@/lib/serverResponse";
import { deleteFile, uploadMultipleFiles } from "@/lib/storage";
import { FileLike } from "@/types/types";

export async function POST(res: Request): Promise<Response> {
    try {
        const session = await auth();
        if (
            !session ||
            session.user.userType !== "staff" ||
            !session.user?.staff
        ) {
            return serverResponse({
                status: 401,
                success: false,
                message: "Unauthorized",
            });
        }
        const data = await res.formData();
        const files = data?.getAll("files") as FileLike[];

        if (!files) {
            return serverResponse({
                status: 400,
                success: false,
                message: "File not found",
            });
        }

        const validFiles = files.filter((file) => file.size <= maxImageSize);

        if (validFiles.length !== files.length) {
            return serverResponse({
                message: "Some files are too large.",
                success: false,
                status: 400,
            });
        }

        const folder: "images" | "files" =
            data.get("folder") === "images" ? "images" : "files";

        const urls = await uploadMultipleFiles(
            folder,
            files,
            session.user.staff?.id.toString(),
        );
        return serverResponse({
            status: 201,
            success: true,
            message: "All files are uploaded.",
            data: urls,
        });
    } catch (error) {
        console.log(error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal error",
            error: error instanceof Error ? error.message : error,
        });
    }
}

export async function DELETE(res: Request) {
    try {
        const { searchParams } = new URL(res.url);
        const urlToDelete = searchParams?.get("url") as string;

        const result = await deleteFile(urlToDelete);
        if (!result) {
            return serverResponse({
                status: 400,
                success: false,
                message: "File not deleted",
                error: "Url can be invalid",
            });
        }
        return serverResponse({
            status: 200,
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.log("ERROR WHILE DELETE FILE", error);
        return serverResponse({
            status: 500,
            success: false,
            message: "Internal error",
            error: error instanceof Error ? error.message : error,
        });
    }
}
