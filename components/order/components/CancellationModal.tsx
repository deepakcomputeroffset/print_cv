"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, XCircle } from "lucide-react";
import { cancelOrder } from "@/lib/api/order";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancellationFormSchema } from "@/schemas/cancellation.form.schema";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

type CancellationFormValues = z.infer<typeof cancellationFormSchema>;

export function CancellationModal() {
    const { isOpen, onClose, modal, data } = useModal();
    const isModalOpen = isOpen && modal === "cancelOrder";
    const orderId = data.orderId;

    const [isCancelling, setIsCancelling] = useState(false);
    const router = useRouter();

    const form = useForm<CancellationFormValues>({
        resolver: zodResolver(cancellationFormSchema),
        defaultValues: {
            reason: "",
        },
    });

    const handleCancelOrder = async (values: CancellationFormValues) => {
        if (!orderId) {
            toast.error("Order ID is missing");
            return;
        }

        try {
            setIsCancelling(true);
            const response = await cancelOrder(orderId, values.reason);

            if (!response.data.success) {
                throw new Error(
                    response.data.error || "Failed to cancel order",
                );
            }

            toast.success(
                response.data.message || "Order cancelled successfully",
            );
            router.refresh();
            onClose();
            form.reset();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel order",
            );
        } finally {
            setIsCancelling(false);
        }
    };

    // Reset form when modal is closed
    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Modal
            title="Cancel Order"
            isOpen={isModalOpen}
            onClose={handleClose}
            description="Please provide a reason for cancelling this order."
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleCancelOrder)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cancellation Reason</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Why are you cancelling this order?"
                                        {...field}
                                        rows={4}
                                        className="resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isCancelling}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isCancelling}
                            className="flex items-center gap-2"
                        >
                            {isCancelling ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4" />
                                    Cancel Order
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
}
