"use client";

import { Button } from "@/components/ui/button";
import { Tag, Check, FileText, ImageIcon } from "lucide-react";
import {
    CUSTOMER_CATEGORY,
    attachment,
    order,
    product,
    productItem,
} from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LabelButtonProps {
    order: order & {
        productItem: productItem & {
            product: product;
        };
        customer?: {
            businessName: string;
            name: string;
            phone: string;
            address: {
                line?: string;
                city?: {
                    name?: string;
                    state?: {
                        name?: string;
                        country: {
                            name: string;
                        };
                    };
                };
                pinCode: string;
            } | null;
            customerCategory: CUSTOMER_CATEGORY;
        };
        attachment?: attachment;
    };
}

export function LabelButton({ order }: LabelButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDownloadLabel = async () => {
        try {
            setIsGenerating(true);
            const { generateLabel, download } = await import(
                "@/lib/utils/generateLabel"
            );
            if (!order.customer) {
                toast.error(
                    "Cannot generate label: Missing customer information",
                );
                return;
            }
            const labelData = await generateLabel(order);
            download(labelData, order.id);

            // Show success state for 2 seconds
            setIsSuccess(true);
            toast.success("Shipping label generated successfully!");

            // Reset to original state after 2 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        } catch (error) {
            console.error("Error generating shipping label:", error);
            toast.error("Failed to generate shipping label. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant={isSuccess ? "default" : "outline"}
            size="sm"
            className={cn(
                isSuccess
                    ? "bg-green-500 hover:bg-green-600 text-white border-0"
                    : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20",
                "transition-all duration-200",
            )}
            onClick={handleDownloadLabel}
            disabled={isGenerating}
        >
            {isSuccess ? (
                <Check className="h-4 w-4 mr-2" />
            ) : (
                <Tag
                    className={cn("h-4 w-4", isGenerating && "animate-bounce")}
                />
            )}
            {isGenerating
                ? "Generating..."
                : isSuccess
                  ? "Downloaded!"
                  : "Label"}
        </Button>
    );
}

export function LabelButtonWithAttachment({ order }: LabelButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e?.target?.files?.[0]) return;
        setFile(e.target.files[0]);
    };
    const handleDownloadCustomLabel = async () => {
        if (!file) {
            toast.error("Please select an attachment first");
            return;
        }

        try {
            setIsGenerating(true);

            // Dynamic import the custom generate function
            const { generateLabelWithAttachment } = await import(
                "@/lib/utils/generateLabel"
            );

            if (!order.customer) {
                toast.error(
                    "Cannot generate label: Missing customer information",
                );
                return;
            }

            await generateLabelWithAttachment(order, file);

            toast.success("Custom label generated successfully!");
            setOpen(false);
        } catch (error) {
            console.error("Error generating custom label:", error);
            toast.error("Failed to generate custom label. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500/30 text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                    <ImageIcon className="h-4 w-4" />
                    Custom Label
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Custom Label</DialogTitle>
                    <DialogDescription>
                        Select an Image to combine with the shipping label
                    </DialogDescription>
                </DialogHeader>

                {order?.attachment &&
                order?.attachment?.urls &&
                order?.attachment?.urls?.length > 0 ? (
                    <div className="space-y-4">
                        <div className="border rounded-md p-4">
                            {order?.attachment?.urls?.map((url, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <Label
                                        htmlFor={`attachment-${index}`}
                                        className="flex-1 cursor-pointer"
                                    >
                                        Attachment {index + 1}
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            window.open(url, "_blank")
                                        }
                                    >
                                        <FileText className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="cursor-pointer"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDownloadCustomLabel}
                                disabled={!file || isGenerating}
                            >
                                {isGenerating
                                    ? "Generating..."
                                    : "Generate Label"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-muted p-4 rounded-md">
                        <p className="text-center text-muted-foreground">
                            No attachments found for this order.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
