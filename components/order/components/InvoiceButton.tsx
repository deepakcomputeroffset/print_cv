"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Check } from "lucide-react";
import { order } from "@prisma/client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InvoiceButtonProps {
    order: order & {
        productItem: {
            productId: number;
            sku: string;
            product: {
                name: string;
            };
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

export function InvoiceButton({ order }: InvoiceButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDownloadInvoice = async () => {
        try {
            setIsGenerating(true);
            const { generateInvoice } = await import(
                "@/lib/utils/generateInvoice"
            );
            if (!order.customer) {
                toast.error(
                    "Cannot generate invoice: Missing customer information",
                );
                return;
            }
            //  eslint-disable-next-line
            await generateInvoice(order as any);

            // Show success state for 2 seconds
            setIsSuccess(true);
            toast.success("Invoice generated successfully!");

            // Reset to original state after 2 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Failed to generate invoice. Please try again.");
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
                    : "border-primary/20 text-primary hover:bg-primary/5",
                "transition-all duration-200",
            )}
            onClick={handleDownloadInvoice}
            disabled={isGenerating}
        >
            {isSuccess ? (
                <Check className="h-4 w-4 mr-2" />
            ) : (
                <FileDown
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
                  : "Download Invoice"}
        </Button>
    );
}
