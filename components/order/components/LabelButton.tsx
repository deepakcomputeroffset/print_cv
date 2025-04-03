"use client";

import { Button } from "@/components/ui/button";
import { Tag, Check } from "lucide-react";
import { order, product, productItem } from "@prisma/client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
        };
    };
}

export function LabelButton({ order }: LabelButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDownloadLabel = async () => {
        try {
            setIsGenerating(true);
            const { generateLabel } = await import("@/lib/utils/generateLabel");
            if (!order.customer) {
                toast.error(
                    "Cannot generate label: Missing customer information",
                );
                return;
            }
            await generateLabel(order);

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
                    className={cn(
                        "h-4 w-4 mr-2",
                        isGenerating && "animate-bounce",
                    )}
                />
            )}
            {isGenerating
                ? "Generating..."
                : isSuccess
                  ? "Downloaded!"
                  : "Download Label"}
        </Button>
    );
}
