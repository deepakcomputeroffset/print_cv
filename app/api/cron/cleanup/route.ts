import { deleteOldFiles, GCLOUD_FOLDER_NAME } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Verify the cron secret for security
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const daysOld = 30;
        const folder: GCLOUD_FOLDER_NAME = "files";

        // Delete old files
        const result = await deleteOldFiles(folder, daysOld);

        return NextResponse.json({
            success: true,
            message: `Cleanup completed`,
            deleted: result.deleted,
            failed: result.failed,
            daysOld,
            folder: folder,
        });
    } catch (error) {
        console.error("Cron job error:", error);
        return NextResponse.json(
            {
                error: "Internal server error",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
