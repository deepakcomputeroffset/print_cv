"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { order } from "@prisma/client";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

    const handleDownloadInvoice = async () => {
        try {
            setIsGenerating(true);
            const { generateInvoice } = await import(
                "@/lib/utils/generateInvoice"
            );
            if (!order.customer) {
                console.error(
                    "Customer data not available for invoice generation",
                );
                alert("Cannot generate invoice: Missing customer information");
                return;
            }
            //  eslint-disable-next-line
            generateInvoice(order as any);
        } catch (error) {
            console.error("Error generating invoice:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/5"
            onClick={handleDownloadInvoice}
            disabled={isGenerating}
        >
            <FileDown
                className={cn("h-4 w-4 mr-2", isGenerating && "animate-bounce")}
            />
            {isGenerating ? "Generating..." : "Download Invoice"}
        </Button>
    );
}
