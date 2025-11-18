"use client";
import { Button } from "@/components/ui/button";
import { downloadHandler } from "@/lib/downloadHandler";
import { LucideDownload } from "lucide-react";

export function DownloadButton({ url }: { url: string }) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => downloadHandler(url)}
        >
           Download <LucideDownload className="h-3 w-3" />
        </Button>
    );
}
