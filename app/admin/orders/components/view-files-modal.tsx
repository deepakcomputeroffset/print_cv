"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, ExternalLink } from "lucide-react";

interface ViewFilesModalProps {
    orderId: number;
    files: string[];
}

export function ViewFilesModal({ orderId, files }: ViewFilesModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Files
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order Files - {orderId}</DialogTitle>
                    <DialogDescription>
                        View all files uploaded for this order
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    {files.map((url, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 text-sm border rounded-md w-full"
                        >
                            <span className="truncate">
                                {url.split("/").pop()}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(url, "_blank")}
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
