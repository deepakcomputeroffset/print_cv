"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { FileText } from "lucide-react";

export function ViewFilesButton({
    order,
}: {
    order: { id: number; attachment: string[] };
}) {
    const { onOpen } = useModal();
    return (
        <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
                onOpen("viewFiles", {
                    orderId: order.id,
                    files: order?.attachment,
                })
            }
        >
            <FileText className="w-4 h-4 mr-2" />
            View Files
        </Button>
    );
}
