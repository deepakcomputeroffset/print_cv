"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { improperOrderFormSchema } from "@/schemas/improper-order.form.schema";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";

type ImproperOrderFormValues = z.infer<typeof improperOrderFormSchema>;

export function ImproperOrderModal({ orderId }: { orderId: number }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<ImproperOrderFormValues>({
        resolver: zodResolver(improperOrderFormSchema),
        defaultValues: {
            reason: "",
        },
    });

    const handleMarkAsImproper = async (values: ImproperOrderFormValues) => {
        if (!orderId) {
            toast.error("Order ID is missing");
            return;
        }

        try {
            setIsSubmitting(true);
            // Update this API endpoint if needed
            const response = await axios.post(
                `/api/orders/${orderId}/improper`,
                {
                    reason: values.reason,
                },
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.error || "Failed to mark order as improper",
                );
            }

            toast.success(
                response.data.message ||
                    "Order marked as improper successfully",
            );
            router.refresh();
            form.reset();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to mark order as improper",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog onOpenChange={() => form.reset()}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Mark as Improper
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark Order as Improper</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for marking this order as
                        improper.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleMarkAsImproper)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Explain why this order is considered improper..."
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
                                type="submit"
                                variant="destructive"
                                disabled={isSubmitting}
                                className="flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4" />
                                        Mark as Improper
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
