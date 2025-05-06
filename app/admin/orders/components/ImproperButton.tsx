"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { FileText } from "lucide-react";

export function ImproperOrderButton({ order }: { order: { id: number } }) {
    const { onOpen } = useModal();
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => onOpen("improperOrder", { orderId: order.id })}
        >
            <FileText className="w-4 h-4 mr-2" />
            Mark as Improper
        </Button>
    );
}
