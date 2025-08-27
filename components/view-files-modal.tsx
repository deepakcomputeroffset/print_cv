"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { ExternalLink } from "lucide-react";

export function ViewFilesModal() {
    const { isOpen, onClose, data, modal } = useModal();
    const open = isOpen && modal === "viewFiles";
    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                        openChange();
                        onClick();
                    }}
                >
                    <FileText className="w-4 h-4 mr-2" />
                    View Files
                </Button>
            </DialogTrigger> */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order Files - {data?.orderId}</DialogTitle>
                    <DialogDescription>
                        View all files uploaded for this order
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    {data?.attachment?.map((attachment, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 text-sm border rounded-md w-full"
                        >
                            <span className="truncate">{attachment.type}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    window.open(attachment.url, "_blank")
                                }
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
