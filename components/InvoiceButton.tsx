"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    order,
    pricing,
    product,
    productCategory,
    productItem,
} from "@prisma/client";
import { CalendarDays, Check, FileDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { addressType } from "@/types/types";
import { toast } from "sonner";

interface InvoiceOrder extends order {
    invoiceDate: Date | null;
    invoiceGeneratedAt: Date | null;
    productItem: productItem & {
        pricing: pricing[];
        product: product & {
            category: productCategory;
        };
    };
    customer: {
        address?: addressType;
        businessName: string;
        name: string;
        phone: string;
    };
}

interface InvoiceButtonProps {
    order: InvoiceOrder;
}

const toDateInputValue = (date?: Date | string | null) => {
    const value = date ? new Date(date) : new Date();
    const timezoneOffset = value.getTimezoneOffset() * 60000;
    return new Date(value.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
};

export function InvoiceButton({ order }: InvoiceButtonProps) {
    const { data: session, status } = useSession();
    const role = session?.user?.staff?.role;
    const isAdmin = role === "ADMIN";
    const canGenerateInvoice = isAdmin || role === "DISPATCHER";

    const [currentOrder, setCurrentOrder] = useState(order);
    const [invoiceDate, setInvoiceDate] = useState(
        toDateInputValue(order.invoiceDate),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    const isInvoiceGenerated = Boolean(currentOrder.invoiceGeneratedAt);

    useEffect(() => {
        setCurrentOrder(order);
        setInvoiceDate(toDateInputValue(order.invoiceDate));
    }, [order.id, order.invoiceDate, order.invoiceGeneratedAt]);

    const downloadInvoice = async (invoiceOrder: InvoiceOrder) => {
        const { generateInvoice } = await import("@/lib/utils/generateInvoice");
        await generateInvoice(invoiceOrder);
    };

    const handleGenerateInvoice = async () => {
        try {
            if (status === "loading") {
                return;
            }

            if (isInvoiceGenerated) {
                setIsLoading(true);
                await downloadInvoice(currentOrder);
                toast.success("Invoice downloaded successfully.");
                return;
            }

            if (!canGenerateInvoice) {
                toast.error("You are not allowed to generate invoices.");
                return;
            }

            setIsLoading(true);

            const response = await fetch("/api/orders/invoice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: currentOrder.id,
                    action: "generate",
                }),
            });

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(
                    payload?.message || "Failed to generate invoice",
                );
            }

            const updatedOrder = {
                ...currentOrder,
                ...(payload?.data ?? {}),
            } as InvoiceOrder;

            setCurrentOrder(updatedOrder);
            await downloadInvoice(updatedOrder);
            toast.success("Invoice generated and downloaded successfully.");
        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Failed to generate invoice. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCustomDate = async () => {
        try {
            if (!isAdmin) {
                toast.error("Only admins can edit the invoice date.");
                return;
            }

            setIsLoading(true);

            const response = await fetch("/api/orders/invoice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: currentOrder.id,
                    action: "set-date",
                    invoiceDate: new Date(
                        `${invoiceDate}T00:00:00`,
                    ).toISOString(),
                }),
            });

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(
                    payload?.message || "Failed to update invoice date",
                );
            }

            setCurrentOrder((current) => ({
                ...current,
                ...(payload?.data ?? {}),
            }));
            setIsDateModalOpen(false);
            toast.success("Invoice date updated successfully.");
        } catch (error) {
            console.error("Error updating invoice date:", error);
            toast.error("Failed to update invoice date. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return null;
    }

    if (!isInvoiceGenerated && !canGenerateInvoice) {
        return null;
    }

    if (isInvoiceGenerated) {
        return (
            <Button
                variant="outline"
                size="sm"
                className={cn(
                    "border-primary/20 text-primary hover:bg-primary/5",
                    "transition-all duration-200",
                )}
                onClick={() => downloadInvoice(currentOrder)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Check className="h-4 w-4" />
                )}
                {isLoading ? "Downloading..." : "Download Invoice"}
            </Button>
        );
    }

    return (
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            <Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Custom Invoice Date</DialogTitle>
                        <DialogDescription>
                            Only admins can change the invoice date before the
                            invoice is generated.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor={`invoice-date-${currentOrder.id}`}>
                            Invoice Date
                        </Label>
                        <Input
                            id={`invoice-date-${currentOrder.id}`}
                            type="date"
                            value={invoiceDate}
                            onChange={(event) =>
                                setInvoiceDate(event.target.value)
                            }
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDateModalOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveCustomDate}
                            disabled={isLoading || !invoiceDate}
                        >
                            {isLoading ? "Saving..." : "Save Date"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isAdmin && (
                <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-500/30 text-indigo-600 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20 transition-all duration-200 w-full"
                    onClick={() => setIsDateModalOpen(true)}
                    disabled={isLoading}
                >
                    <CalendarDays className="h-4 w-4" />
                    Custom Invoice Date
                </Button>
            )}

            <Button
                variant="outline"
                size="sm"
                className={cn(
                    "border-primary/20 text-primary hover:bg-primary/5",
                    "transition-all duration-200 w-full",
                )}
                onClick={handleGenerateInvoice}
                disabled={isLoading || !canGenerateInvoice}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <FileDown className="h-4 w-4" />
                )}
                {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
        </div>
    );
}
